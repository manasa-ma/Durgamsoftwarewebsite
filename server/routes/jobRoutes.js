import express from 'express';
import db from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { sendApplicationAcknowledgment } from '../services/emailService.js';

const router = express.Router();

// Helper to safely parse JSON strings or fallback
function parseJsonArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // If it's a newline or comma separated string
      return val.split('\n').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

// Helper to normalize job output
function formatJob(row) {
  if (!row) return null;
  return {
    ...row,
    responsibilities: parseJsonArray(row.responsibilities),
    requirements: parseJsonArray(row.requirements),
    skills: parseJsonArray(row.skills),
    locations: row.location ? row.location.split(',').map((s) => s.trim()) : [],
    createdBy: row.createdBy || 'CEO',
    updatedBy: row.updatedBy || row.createdBy || 'CEO',
    statusChangedAt: row.statusChangedAt || row.updatedAt || row.createdAt,
    applicationCount: typeof row.applicationCount === 'number' ? row.applicationCount : (Number(row.applicationCount) || 0),
    newApplicationCount: typeof row.newApplicationCount === 'number' ? row.newApplicationCount : (Number(row.newApplicationCount) || 0),
  };
}

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

/**
 * GET /api/jobs
 * Public: Get all PUBLISHED jobs only
 */
router.get('/jobs', (req, res) => {
  try {
    const { department, search } = req.query;
    let query = "SELECT * FROM jobs WHERE status = 'published'";
    const params = [];

    if (department && department !== 'All') {
      query += ' AND department = ?';
      params.push(department);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY createdAt DESC';
    const rows = db.prepare(query).all(...params);
    const jobs = rows.map(formatJob);

    return res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error('[API] Error fetching public jobs:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve jobs.',
    });
  }
});

/**
 * GET /api/jobs/:id
 * Public: Get single PUBLISHED job by id or slug
 */
router.get('/jobs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare("SELECT * FROM jobs WHERE (id = ? OR id = ?) AND status = 'published'").get(
      id,
      id.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    );

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found or no longer active.',
      });
    }

    return res.json({
      success: true,
      job: formatJob(row),
    });
  } catch (err) {
    console.error('[API] Error fetching single public job:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve job details.',
    });
  }
});

/**
 * POST /api/applications
 * Public: Submit a job application
 * Immediately records application in database and sends automated confirmation email to candidate
 */
router.post('/applications', async (req, res) => {
  try {
    const {
      jobId = '',
      jobTitle = 'General Application',
      candidateName,
      candidateEmail,
      candidatePhone,
      experience = '',
      resumeName = '',
      resumeData = '',
      resumeUrl = '',
      coverNote = '',
    } = req.body || {};

    if (!candidateName || !candidateEmail || !candidatePhone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone number are required.',
      });
    }

    const id = 'app-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO applications (
        id, jobId, jobTitle, candidateName, candidateEmail, candidatePhone,
        experience, resumeName, resumeData, resumeUrl, coverNote, isViewed, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      jobId,
      jobTitle,
      candidateName,
      candidateEmail,
      candidatePhone,
      experience,
      resumeName,
      resumeData,
      resumeUrl,
      coverNote,
      0,
      createdAt
    );

    // Immediately dispatch automated confirmation email to the candidate
    let emailSent = false;
    let emailMessage = '';
    try {
      const emailResult = await sendApplicationAcknowledgment({
        candidateName,
        candidateEmail,
        jobTitle,
        applicationId: id,
        createdAt,
      });
      emailSent = emailResult?.success || false;
      emailMessage = `Confirmation email sent to ${candidateEmail}`;
      console.log(`[API] Automated acknowledgment email dispatched to ${candidateEmail} for ${jobTitle}`);
    } catch (mailErr) {
      console.warn('[API] Warning: Automated email dispatch failed (non-fatal):', mailErr.message);
      emailMessage = 'Application saved. Email dispatch logged.';
    }

    return res.status(201).json({
      success: true,
      message: 'Application recorded successfully.',
      applicationId: id,
      emailSent,
      emailMessage,
      acknowledgment: {
        candidateName,
        candidateEmail,
        jobTitle,
        status: 'Under Review',
        message: `Thank you for applying for the ${jobTitle} position! We have received your application and our hiring team is currently reviewing your profile. We will get back to you once your profile is shortlisted/selected for the next round.`,
      },
    });
  } catch (err) {
    console.error('[API] Error recording application:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to save application.',
    });
  }
});

// ==========================================
// PROTECTED ADMIN API ENDPOINTS
// ==========================================

/**
 * GET /api/admin/stats
 * Protected: Dashboard statistics
 */
router.get('/admin/stats', authenticateAdmin, (req, res) => {
  try {
    const totalRow = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
    const publishedRow = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'published'").get();
    const deactivatedRow = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'deactivated' OR status = 'deactivate'").get();
    const draftRow = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'draft'").get();
    const closedRow = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'closed'").get();
    const appsRow = db.prepare('SELECT COUNT(*) as count FROM applications').get();
    const newAppsRow = db.prepare('SELECT COUNT(*) as count FROM applications WHERE isViewed = 0 OR isViewed IS NULL').get();
    const totalBlogsRow = db.prepare('SELECT COUNT(*) as count FROM blogs').get();
    const publishedBlogsRow = db.prepare("SELECT COUNT(*) as count FROM blogs WHERE status = 'published'").get();
    const totalAnnouncementsRow = db.prepare('SELECT COUNT(*) as count FROM announcements').get();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendanceRow = db.prepare("SELECT COUNT(*) as count FROM employee_attendance WHERE date = ? AND status != 'Absent'").get(todayStr);
    const pendingLeavesRow = db.prepare("SELECT COUNT(*) as count FROM employee_leaves WHERE status = 'Pending'").get();
    const totalEmployeesRow = db.prepare('SELECT COUNT(*) as count FROM employees').get();

    const recentJobs = db.prepare(`
      SELECT j.*,
        (SELECT COUNT(*) FROM applications a WHERE a.jobId = j.id OR LOWER(TRIM(a.jobTitle)) = LOWER(TRIM(j.title))) AS applicationCount
      FROM jobs j
      ORDER BY j.createdAt DESC
      LIMIT 5
    `).all().map(formatJob);

    return res.json({
      success: true,
      stats: {
        totalJobs: totalRow?.count || 0,
        publishedJobs: publishedRow?.count || 0,
        deactivatedJobs: deactivatedRow?.count || 0,
        draftJobs: draftRow?.count || 0,
        closedJobs: closedRow?.count || 0,
        totalApplications: appsRow?.count || 0,
        newApplications: newAppsRow?.count || 0,
        totalBlogs: totalBlogsRow?.count || 0,
        publishedBlogs: publishedBlogsRow?.count || 0,
        totalAnnouncements: totalAnnouncementsRow?.count || 0,
        todayAttendanceCount: todayAttendanceRow?.count || 0,
        pendingLeavesCount: pendingLeavesRow?.count || 0,
        totalEmployeesCount: totalEmployeesRow?.count || 0,
      },
      recentJobs,
    });
  } catch (err) {
    console.error('[API] Error fetching admin stats:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to load dashboard statistics.',
    });
  }
});

/**
 * GET /api/admin/jobs
 * Protected: Get all jobs with application count, search and status filter
 */
router.get('/admin/jobs', authenticateAdmin, (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT j.*,
        (SELECT COUNT(*) FROM applications a WHERE a.jobId = j.id OR LOWER(TRIM(a.jobTitle)) = LOWER(TRIM(j.title))) AS applicationCount,
        (SELECT COUNT(*) FROM applications a WHERE (a.jobId = j.id OR LOWER(TRIM(a.jobTitle)) = LOWER(TRIM(j.title))) AND (a.isViewed IS NULL OR a.isViewed = 0)) AS newApplicationCount
      FROM jobs j
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      if (status === 'active' || status === 'published') {
        query += " AND j.status = 'published'";
      } else if (status === 'deactivate' || status === 'deactivated') {
        query += " AND j.status != 'published'";
      } else {
        query += ' AND j.status = ?';
        params.push(status);
      }
    }

    if (search) {
      query += ' AND (j.title LIKE ? OR j.department LIKE ? OR j.location LIKE ? OR j.createdBy LIKE ? OR j.updatedBy LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term);
    }

    query += ' ORDER BY j.createdAt DESC';
    const rows = db.prepare(query).all(...params);
    const jobs = rows.map(formatJob);

    return res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error('[API] Error fetching admin jobs:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to load jobs list.',
    });
  }
});

/**
 * GET /api/admin/jobs/:id
 * Protected: Get any job by ID with applicant count
 */
router.get('/admin/jobs/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare(`
      SELECT j.*,
        (SELECT COUNT(*) FROM applications a WHERE a.jobId = j.id OR a.jobTitle = j.title) AS applicationCount,
        (SELECT COUNT(*) FROM applications a WHERE (a.jobId = j.id OR a.jobTitle = j.title) AND (a.isViewed IS NULL OR a.isViewed = 0)) AS newApplicationCount
      FROM jobs j
      WHERE j.id = ?
    `).get(id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    return res.json({
      success: true,
      job: formatJob(row),
    });
  } catch (err) {
    console.error('[API] Error fetching admin job by id:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to load job details.',
    });
  }
});

/**
 * GET /api/admin/jobs/:id/applications
 * Protected: Get all candidate applications for a specific job posting
 * (Automatically marks unseen applications as viewed by the admin)
 */
router.get('/admin/jobs/:id/applications', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const jobRow = db.prepare(`
      SELECT j.*,
        (SELECT COUNT(*) FROM applications a WHERE a.jobId = j.id OR a.jobTitle = j.title) AS applicationCount,
        (SELECT COUNT(*) FROM applications a WHERE (a.jobId = j.id OR a.jobTitle = j.title) AND (a.isViewed IS NULL OR a.isViewed = 0)) AS newApplicationCount
      FROM jobs j
      WHERE j.id = ?
    `).get(id);

    if (!jobRow) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    const applications = db.prepare(`
      SELECT * FROM applications
      WHERE jobId = ? OR jobTitle = ?
      ORDER BY createdAt DESC
    `).all(id, jobRow.title);

    // Auto-mark any unviewed applications as viewed now that admin opened the candidates page
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE applications SET isViewed = 1, viewedAt = ?
      WHERE (jobId = ? OR jobTitle = ?) AND (isViewed = 0 OR isViewed IS NULL)
    `).run(now, id, jobRow.title);

    return res.json({
      success: true,
      job: formatJob(jobRow),
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error('[API] Error fetching candidates for job:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to load candidate applications for this job.',
    });
  }
});

/**
 * POST /api/admin/jobs/:id/mark-viewed
 * Explicitly mark all applications for a job as viewed by admin
 */
router.post('/admin/jobs/:id/mark-viewed', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();
    const result = db.prepare(`
      UPDATE applications SET isViewed = 1, viewedAt = ?
      WHERE (jobId = ? OR jobTitle = (SELECT title FROM jobs WHERE id = ?)) AND (isViewed = 0 OR isViewed IS NULL)
    `).run(now, id, id);

    return res.json({
      success: true,
      message: 'Applications marked as viewed.',
      markedCount: result.changes,
    });
  } catch (err) {
    console.error('[API] Error marking applications as viewed:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark applications as viewed.',
    });
  }
});

/**
 * GET /api/admin/applications/:id/resume
 * Protected: Download / view resume attachment
 */
router.get('/admin/applications/:id/resume', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const application = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    const cleanCandidateName = (application.candidateName || 'candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
    const defaultFilename = `${cleanCandidateName}_Resume.pdf`;
    const filename = application.resumeName || defaultFilename;

    if (application.resumeData && application.resumeData.startsWith('data:')) {
      const matches = application.resumeData.match(/^data:([A-Za-z-+/0-9]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send(buffer);
      }
    }

    // Fallback: Generate structured resume summary document
    const summaryDoc =
      `============================================================\n` +
      `               DURGAM SOFT CANDIDATE RESUME                 \n` +
      `============================================================\n\n` +
      `CANDIDATE INFORMATION\n` +
      `------------------------------------------------------------\n` +
      `Full Name:       ${application.candidateName}\n` +
      `Target Role:     ${application.jobTitle}\n` +
      `Email Address:   ${application.candidateEmail}\n` +
      `Phone Number:    ${application.candidatePhone}\n` +
      `Experience:      ${application.experience || 'Not specified'}\n` +
      `Applied Date:    ${new Date(application.createdAt).toLocaleString()}\n` +
      `Resume File:     ${application.resumeName || 'Attached on application'}\n\n` +
      `APPLICANT COVER NOTE / SUMMARY\n` +
      `------------------------------------------------------------\n` +
      `${application.coverNote || 'No additional note provided.'}\n\n` +
      `============================================================\n` +
      `Durgam Soft Technologies Pvt. Ltd. · Recruitment Management\n`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename.replace(/\.pdf$/i, '.txt')}"`);
    return res.send(summaryDoc);
  } catch (err) {
    console.error('[API] Error retrieving resume:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve resume attachment.',
    });
  }
});

/**
 * POST /api/admin/jobs
 * Protected: Create a new job posting
 */
router.post('/admin/jobs', authenticateAdmin, (req, res) => {
  try {
    const {
      title,
      department,
      location,
      jobType = 'Full Time',
      experience,
      description,
      responsibilities = [],
      requirements = [],
      skills = [],
      salary = '',
      applicationLink = 'careers@durgamsoft.com',
      status = 'draft',
      createdBy = 'HR',
      updatedBy = 'HR',
    } = req.body || {};

    if (!title || !department || !location || !experience || !description) {
      return res.status(400).json({
        success: false,
        message: 'Job title, department, location, experience, and description are required.',
      });
    }

    if (!['draft', 'published', 'closed', 'deactivated'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be draft, published, closed, or deactivated.',
      });
    }

    // Generate slug-based ID
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slugId = baseSlug || 'job-' + Date.now();
    const existing = db.prepare('SELECT id FROM jobs WHERE id = ?').get(slugId);
    if (existing) {
      slugId = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const now = new Date().toISOString();
    const respStr = JSON.stringify(Array.isArray(responsibilities) ? responsibilities : [responsibilities]);
    const reqStr = JSON.stringify(Array.isArray(requirements) ? requirements : [requirements]);
    const skillsStr = JSON.stringify(Array.isArray(skills) ? skills : [skills]);

    const finalCreatedBy = (req.body?.createdBy && req.body.createdBy.trim()) ? req.body.createdBy.trim() : 'CEO';
    const finalUpdatedBy = (req.body?.updatedBy && req.body.updatedBy.trim()) ? req.body.updatedBy.trim() : 'CEO';

    db.prepare(`
      INSERT INTO jobs (
        id, title, department, location, jobType, experience,
        description, responsibilities, requirements, skills,
        salary, applicationLink, status, createdBy, updatedBy,
        statusChangedAt, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      slugId,
      title.trim(),
      department.trim(),
      location.trim(),
      jobType.trim(),
      experience.trim(),
      description.trim(),
      respStr,
      reqStr,
      skillsStr,
      salary ? salary.trim() : '',
      applicationLink ? applicationLink.trim() : 'careers@durgamsoft.com',
      status,
      finalCreatedBy,
      finalUpdatedBy,
      now,
      now,
      now
    );

    const created = db.prepare(`
      SELECT j.*, 0 AS applicationCount FROM jobs j WHERE j.id = ?
    `).get(slugId);

    return res.status(201).json({
      success: true,
      message: `Job posting created successfully (${status}).`,
      job: formatJob(created),
    });
  } catch (err) {
    console.error('[API] Error creating job:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create job posting.',
    });
  }
});

/**
 * PUT /api/admin/jobs/:id
 * Protected: Update an existing job posting
 */
router.put('/admin/jobs/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    const {
      title = existing.title,
      department = existing.department,
      location = existing.location,
      jobType = existing.jobType,
      experience = existing.experience,
      description = existing.description,
      responsibilities = parseJsonArray(existing.responsibilities),
      requirements = parseJsonArray(existing.requirements),
      skills = parseJsonArray(existing.skills),
      salary = existing.salary,
      applicationLink = existing.applicationLink,
      status = existing.status,
      createdBy = existing.createdBy || 'HR',
      updatedBy = 'HR',
    } = req.body || {};

    if (!['draft', 'published', 'closed', 'deactivated'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be draft, published, closed, or deactivated.',
      });
    }

    const now = new Date().toISOString();
    const statusChanged = status !== existing.status;
    const statusChangedAt = statusChanged ? now : (existing.statusChangedAt || existing.updatedAt || now);

    const respStr = JSON.stringify(Array.isArray(responsibilities) ? responsibilities : [responsibilities]);
    const reqStr = JSON.stringify(Array.isArray(requirements) ? requirements : [requirements]);
    const skillsStr = JSON.stringify(Array.isArray(skills) ? skills : [skills]);

    const finalCreatedBy = (req.body?.createdBy && req.body.createdBy.trim()) ? req.body.createdBy.trim() : (existing.createdBy || 'CEO');
    const finalUpdatedBy = (req.body?.updatedBy && req.body.updatedBy.trim()) ? req.body.updatedBy.trim() : 'CEO';

    db.prepare(`
      UPDATE jobs SET
        title = ?,
        department = ?,
        location = ?,
        jobType = ?,
        experience = ?,
        description = ?,
        responsibilities = ?,
        requirements = ?,
        skills = ?,
        salary = ?,
        applicationLink = ?,
        status = ?,
        createdBy = ?,
        updatedBy = ?,
        statusChangedAt = ?,
        updatedAt = ?
      WHERE id = ?
    `).run(
      title.trim(),
      department.trim(),
      location.trim(),
      jobType.trim(),
      experience.trim(),
      description.trim(),
      respStr,
      reqStr,
      skillsStr,
      salary ? salary.trim() : '',
      applicationLink ? applicationLink.trim() : 'careers@durgamsoft.com',
      status,
      finalCreatedBy,
      finalUpdatedBy,
      statusChangedAt,
      now,
      id
    );

    const updated = db.prepare(`
      SELECT j.*,
        (SELECT COUNT(*) FROM applications a WHERE a.jobId = j.id OR a.jobTitle = j.title) AS applicationCount
      FROM jobs j
      WHERE j.id = ?
    `).get(id);

    return res.json({
      success: true,
      message: 'Job posting updated successfully.',
      job: formatJob(updated),
    });
  } catch (err) {
    console.error('[API] Error updating job:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update job posting.',
    });
  }
});

/**
 * PATCH /api/admin/jobs/:id/status
 * Protected: Quick activate/deactivate/close toggle
 */
router.patch('/admin/jobs/:id/status', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body || {};

    if (status === 'active') status = 'published';
    if (status === 'deactivate') status = 'deactivated';

    if (!['draft', 'published', 'closed', 'deactivated'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, published, deactivated, draft, or closed.',
      });
    }

    const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    const now = new Date().toISOString();
    const finalUpdatedBy = (req.body?.updatedBy && req.body.updatedBy.trim()) ? req.body.updatedBy.trim() : 'CEO';

    db.prepare('UPDATE jobs SET status = ?, statusChangedAt = ?, updatedAt = ?, updatedBy = ? WHERE id = ?').run(
      status,
      now,
      now,
      finalUpdatedBy,
      id
    );

    return res.json({
      success: true,
      message: `Job status updated to ${status}.`,
      status,
      statusChangedAt: now,
      updatedBy: finalUpdatedBy,
    });
  } catch (err) {
    console.error('[API] Error changing job status:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update job status.',
    });
  }
});

/**
 * PATCH /api/admin/jobs/:id/role
 * Protected: Update createdBy and/or updatedBy role
 */
router.patch('/admin/jobs/:id/role', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { createdBy, updatedBy } = req.body || {};

    const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    const newCreatedBy = createdBy !== undefined ? createdBy.trim() : existing.createdBy;
    const newUpdatedBy = updatedBy !== undefined ? updatedBy.trim() : existing.updatedBy;
    const now = new Date().toISOString();

    db.prepare('UPDATE jobs SET createdBy = ?, updatedBy = ?, updatedAt = ? WHERE id = ?').run(
      newCreatedBy,
      newUpdatedBy,
      now,
      id
    );

    return res.json({
      success: true,
      message: 'Roles updated successfully.',
      createdBy: newCreatedBy,
      updatedBy: newUpdatedBy,
    });
  } catch (err) {
    console.error('[API] Error updating job roles:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update job roles.',
    });
  }
});

/**
 * DELETE /api/admin/jobs/:id
 * Protected: Delete a job posting
 */
router.delete('/admin/jobs/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    db.prepare('DELETE FROM jobs WHERE id = ?').run(id);

    return res.json({
      success: true,
      message: `Job "${existing.title}" deleted successfully.`,
    });
  } catch (err) {
    console.error('[API] Error deleting job:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete job posting.',
    });
  }
});

/**
 * GET /api/admin/applications
 * Protected: List submitted applications
 */
router.get('/admin/applications', authenticateAdmin, (req, res) => {
  try {
    const applications = db.prepare('SELECT * FROM applications ORDER BY createdAt DESC').all();
    return res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error('[API] Error fetching applications:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to load applications.',
    });
  }
});

/**
 * POST /api/admin/applications/:id/send-acknowledgment
 * Protected: Manually send/resend application acknowledgment & under-review email
 */
router.post('/admin/applications/:id/send-acknowledgment', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const application = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidate application not found.',
      });
    }

    const emailResult = await sendApplicationAcknowledgment({
      candidateName: application.candidateName,
      candidateEmail: application.candidateEmail,
      jobTitle: application.jobTitle,
      applicationId: application.id,
      createdAt: application.createdAt,
    });

    return res.json({
      success: true,
      message: `Acknowledgment & review status email sent to ${application.candidateEmail} for ${application.jobTitle}.`,
      result: emailResult,
    });
  } catch (err) {
    console.error('[API] Error sending candidate acknowledgment email:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to dispatch acknowledgment email.',
    });
  }
});

export default router;
