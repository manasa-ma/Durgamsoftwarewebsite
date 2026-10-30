import express from 'express';
import db from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

function formatAnnouncement(row) {
  if (!row) return null;
  return {
    ...row,
    isPinned: Boolean(row.isPinned),
    createdBy: row.createdBy || 'CEO',
    updatedBy: row.updatedBy || 'CEO',
  };
}

// ==========================================
// EMPLOYEE / PUBLIC ANNOUNCEMENTS ENDPOINTS
// ==========================================

/**
 * GET /api/announcements
 * Fetch all announcements for the employee dashboard
 */
router.get('/announcements', (req, res) => {
  try {
    const { department } = req.query;
    let query = 'SELECT * FROM announcements WHERE 1=1';
    const params = [];

    if (department && department !== 'All Departments') {
      query += ' AND (targetDepartment = ? OR targetDepartment = ? OR targetDepartment IS NULL)';
      params.push('All Departments', department);
    }

    query += ' ORDER BY isPinned DESC, createdAt DESC';

    const rows = db.prepare(query).all(...params);
    const announcements = rows.map(formatAnnouncement);

    return res.json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (err) {
    console.error('[API] Error fetching announcements:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements.',
    });
  }
});

/**
 * GET /api/announcements/:id
 * Fetch single announcement details
 */
router.get('/announcements/:id', (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.',
      });
    }

    return res.json({
      success: true,
      announcement: formatAnnouncement(row),
    });
  } catch (err) {
    console.error('[API] Error fetching announcement:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve announcement.',
    });
  }
});

// ==========================================
// PROTECTED ADMIN ANNOUNCEMENTS ENDPOINTS
// ==========================================

/**
 * GET /api/admin/announcements
 * Protected: list all announcements for admin management
 */
router.get('/admin/announcements', authenticateAdmin, (req, res) => {
  try {
    const { search, priority } = req.query;
    let query = 'SELECT * FROM announcements WHERE 1=1';
    const params = [];

    if (priority && priority !== 'all') {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (search && search.trim()) {
      query += ' AND (title LIKE ? OR summary LIKE ? OR content LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY isPinned DESC, createdAt DESC';

    const rows = db.prepare(query).all(...params);
    const announcements = rows.map(formatAnnouncement);

    return res.json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (err) {
    console.error('[API] Error fetching admin announcements:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements list.',
    });
  }
});

/**
 * POST /api/admin/announcements
 * Protected: create a new announcement that appears in the employee dashboard
 */
router.post('/admin/announcements', authenticateAdmin, (req, res) => {
  try {
    const {
      title,
      category = 'General Notice',
      priority = 'Normal',
      content,
      summary = '',
      targetDepartment = 'All Departments',
      isPinned = 0,
      author = 'Venu Durgam (Managing Director)',
      date,
    } = req.body || {};

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Announcement title is required.',
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Announcement message / content is required.',
      });
    }

    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    const cleanSummary =
      summary && summary.trim()
        ? summary.trim()
        : cleanContent.replace(/\n+/g, ' ').slice(0, 140) + '...';

    const id = `ann-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const announcementDate = date && date.trim() ? date.trim() : now.split('T')[0];

    const insert = db.prepare(`
      INSERT INTO announcements (
        id, title, category, priority, date, author, summary, content,
        targetDepartment, isPinned, createdBy, updatedBy, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      cleanTitle,
      category.trim() || 'General Notice',
      ['Urgent', 'High', 'Normal', 'Info'].includes(priority) ? priority : 'Normal',
      announcementDate,
      author.trim() || 'Venu Durgam (Managing Director)',
      cleanSummary,
      cleanContent,
      targetDepartment || 'All Departments',
      isPinned ? 1 : 0,
      'CEO',
      'CEO',
      now,
      now
    );

    const created = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully! It is now live in the employee portal.',
      announcement: formatAnnouncement(created),
    });
  } catch (err) {
    console.error('[API] Error creating announcement:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create announcement: ' + (err.message || ''),
    });
  }
});

/**
 * PUT /api/admin/announcements/:id
 * Protected: update an announcement
 */
router.put('/admin/announcements/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.',
      });
    }

    const {
      title = existing.title,
      category = existing.category,
      priority = existing.priority,
      content = existing.content,
      summary = existing.summary,
      targetDepartment = existing.targetDepartment,
      isPinned = existing.isPinned,
      author = existing.author,
      date = existing.date,
    } = req.body || {};

    const now = new Date().toISOString();

    const update = db.prepare(`
      UPDATE announcements SET
        title = ?,
        category = ?,
        priority = ?,
        date = ?,
        author = ?,
        summary = ?,
        content = ?,
        targetDepartment = ?,
        isPinned = ?,
        updatedBy = 'CEO',
        updatedAt = ?
      WHERE id = ?
    `);

    update.run(
      title.trim(),
      category.trim(),
      priority,
      date,
      author.trim(),
      summary ? summary.trim() : existing.summary,
      content.trim(),
      targetDepartment,
      isPinned ? 1 : 0,
      now,
      id
    );

    const updated = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);

    return res.json({
      success: true,
      message: 'Announcement updated successfully.',
      announcement: formatAnnouncement(updated),
    });
  } catch (err) {
    console.error('[API] Error updating announcement:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update announcement.',
    });
  }
});

/**
 * DELETE /api/admin/announcements/:id
 * Protected: delete an announcement
 */
router.delete('/admin/announcements/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM announcements WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found for deletion.',
      });
    }

    return res.json({
      success: true,
      message: 'Announcement removed successfully.',
    });
  } catch (err) {
    console.error('[API] Error deleting announcement:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete announcement.',
    });
  }
});

export default router;
