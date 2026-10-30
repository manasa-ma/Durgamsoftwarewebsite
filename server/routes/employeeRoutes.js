import express from 'express';
import db from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// ADMIN ATTENDANCE MONITORING
// ==========================================

/**
 * GET /api/admin/attendance
 * Protected: Fetch all employee attendance logs with date, department, status, and search filters
 */
router.get('/admin/attendance', authenticateAdmin, (req, res) => {
  try {
    const { date, department, status, search } = req.query;
    let query = 'SELECT * FROM employee_attendance WHERE 1=1';
    const params = [];

    if (date && date.trim() && date !== 'all') {
      query += ' AND date = ?';
      params.push(date.trim());
    }

    if (department && department !== 'All Departments' && department !== 'all') {
      query += ' AND department = ?';
      params.push(department);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      query += ' AND (employeeName LIKE ? OR employeeId LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s);
    }

    query += ' ORDER BY date DESC, checkIn ASC';

    const records = db.prepare(query).all(...params);

    // Compute summary statistics for the selected date or overall
    const targetDate = date && date !== 'all' ? date.trim() : new Date().toISOString().split('T')[0];
    const todayRows = db.prepare('SELECT status, COUNT(*) as count FROM employee_attendance WHERE date = ? GROUP BY status').all(targetDate);
    
    const summary = {
      targetDate,
      totalToday: 0,
      present: 0,
      late: 0,
      halfDay: 0,
      wfh: 0,
      absent: 0,
    };

    for (const row of todayRows) {
      summary.totalToday += row.count;
      if (row.status === 'Present') summary.present += row.count;
      else if (row.status === 'Late') summary.late += row.count;
      else if (row.status === 'Half Day') summary.halfDay += row.count;
      else if (row.status === 'Work From Home') summary.wfh += row.count;
      else if (row.status === 'Absent') summary.absent += row.count;
    }

    return res.json({
      success: true,
      count: records.length,
      records,
      summary,
    });
  } catch (err) {
    console.error('[API] Error fetching admin attendance:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve attendance logs.',
    });
  }
});

// ==========================================
// ADMIN LEAVE REQUESTS & APPROVALS
// ==========================================

/**
 * GET /api/admin/leaves
 * Protected: Fetch all employee leave requests with status, department, and search filters
 */
router.get('/admin/leaves', authenticateAdmin, (req, res) => {
  try {
    const { status, department, search } = req.query;
    let query = 'SELECT * FROM employee_leaves WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (department && department !== 'All Departments' && department !== 'all') {
      query += ' AND department = ?';
      params.push(department);
    }

    if (search && search.trim()) {
      query += ' AND (employeeName LIKE ? OR employeeId LIKE ? OR reason LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY CASE status WHEN \'Pending\' THEN 1 WHEN \'Approved\' THEN 2 ELSE 3 END, appliedOn DESC';

    const leaves = db.prepare(query).all(...params);

    // Summary counts
    const counts = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
      FROM employee_leaves
    `).get();

    return res.json({
      success: true,
      count: leaves.length,
      leaves,
      stats: {
        total: counts?.total || 0,
        pending: counts?.pending || 0,
        approved: counts?.approved || 0,
        rejected: counts?.rejected || 0,
      },
    });
  } catch (err) {
    console.error('[API] Error fetching admin leave requests:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve leave requests.',
    });
  }
});

/**
 * PATCH /api/admin/leaves/:id/status
 * Protected: Approve or Reject an employee leave request
 */
router.patch('/admin/leaves/:id/status', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, managerRemarks = '' } = req.body || {};

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "Approved" or "Rejected".',
      });
    }

    const existing = db.prepare('SELECT * FROM employee_leaves WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found.',
      });
    }

    const reviewer = req.user?.name || 'Venu Durgam (Managing Director)';
    const now = new Date().toISOString();
    const finalRemarks =
      managerRemarks && managerRemarks.trim()
        ? managerRemarks.trim()
        : status === 'Approved'
          ? `Approved by ${reviewer}`
          : `Rejected by ${reviewer}`;

    const update = db.prepare(`
      UPDATE employee_leaves
      SET status = ?, managerRemarks = ?, reviewedBy = ?, reviewedAt = ?, updatedAt = ?
      WHERE id = ?
    `);

    update.run(status, finalRemarks, reviewer, now, now, id);

    const updated = db.prepare('SELECT * FROM employee_leaves WHERE id = ?').get(id);

    return res.json({
      success: true,
      message: `Leave request for ${existing.employeeName} has been ${status.toLowerCase()}!`,
      leave: updated,
    });
  } catch (err) {
    console.error('[API] Error updating leave status:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update leave request status.',
    });
  }
});

// ==========================================
// ADMIN EMPLOYEE MANAGEMENT (CRUD)
// ==========================================

const formatEmployee = (row) => {
  if (!row) return null;
  let customColumns = [];
  let skills = [];
  let bankDetails = null;

  try {
    if (row.customColumns) customColumns = JSON.parse(row.customColumns);
  } catch {
    customColumns = [];
  }

  try {
    if (row.skills) skills = JSON.parse(row.skills);
  } catch {
    skills = [];
  }

  try {
    if (row.bankDetails) bankDetails = JSON.parse(row.bankDetails);
  } catch {
    bankDetails = null;
  }

  return {
    ...row,
    customColumns: Array.isArray(customColumns) ? customColumns : [],
    skills: Array.isArray(skills) ? skills : [],
    bankDetails: bankDetails || {
      bankName: 'HDFC Bank Ltd.',
      accountNumber: '•••• •••• •••• 4892',
      ifscCode: 'HDFC0001842',
      panNumber: 'ABCDE••••F',
      uanNumber: '1012••••8877',
    },
    emergencyContact: {
      name: row.emergencyContactName || 'Primary Contact',
      phone: row.emergencyContactPhone || '+91 98765 11223',
      relation: row.emergencyContactRelation || 'Family',
    },
  };
};

/**
 * GET /api/admin/employees
 * Protected: Fetch all employee records with search and filters, plus summary stats
 */
router.get('/admin/employees', authenticateAdmin, (req, res) => {
  try {
    const { search, department, status } = req.query;
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    if (department && department !== 'All Departments' && department !== 'all') {
      query += ' AND department = ?';
      params.push(department);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      query += ' AND (name LIKE ? OR email LIKE ? OR id LIKE ? OR designation LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY createdAt DESC';

    const rawEmployees = db.prepare(query).all(...params);
    const employees = rawEmployees.map(formatEmployee);

    // Compute stats across all employees
    const statsRow = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactive,
        SUM(CASE WHEN status = 'On Leave' THEN 1 ELSE 0 END) as onLeave,
        SUM(CASE WHEN status = 'Probation' THEN 1 ELSE 0 END) as probation,
        COUNT(DISTINCT department) as departmentsCount
      FROM employees
    `).get();

    return res.json({
      success: true,
      count: employees.length,
      employees,
      stats: {
        total: statsRow?.total || 0,
        active: statsRow?.active || 0,
        inactive: statsRow?.inactive || 0,
        onLeave: statsRow?.onLeave || 0,
        probation: statsRow?.probation || 0,
        departmentsCount: statsRow?.departmentsCount || 0,
      },
    });
  } catch (err) {
    console.error('[API] Error fetching admin employees:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve employee directory.',
    });
  }
});

/**
 * GET /api/admin/employees/:id
 * Protected: Get single employee profile with full details
 */
router.get('/admin/employees/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found.',
      });
    }

    return res.json({
      success: true,
      employee: formatEmployee(row),
    });
  } catch (err) {
    console.error('[API] Error fetching employee details:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve employee record.',
    });
  }
});

/**
 * POST /api/admin/employees
 * Protected: Create a new employee
 */
router.post('/admin/employees', authenticateAdmin, (req, res) => {
  try {
    const {
      id: customId,
      name,
      email,
      department,
      designation,
      phone = '+91 98800 12345',
      joiningDate = '01 Jan 2024',
      employmentType = 'Full-time / Permanent',
      reportingManager = 'Venu Durgam (Technical Director)',
      location = 'Cherlapalli',
      workShift = '9:00 AM - 6:00 PM',
      currentAddress = 'Cherlapalli, Telangana 500051',
      emergencyContactName = 'Primary Contact',
      emergencyContactPhone = '+91 98800 54321',
      emergencyContactRelation = 'Family',
      bloodGroup = 'B+',
      dateOfBirth = '15 Jul 1997',
      gender = 'Not Specified',
      status = 'Active',
      salary = '₹ 8,50,000 / annum',
      photo = null,
      customColumns = [],
      skills = [],
      bankDetails = null,
    } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Employee name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Work email is required.' });
    }
    if (!department || !department.trim()) {
      return res.status(400).json({ success: false, message: 'Department is required.' });
    }
    if (!designation || !designation.trim()) {
      return res.status(400).json({ success: false, message: 'Designation / job title is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM employees WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `An employee with email "${normalizedEmail}" already exists (ID: ${existing.id}).`,
      });
    }

    // Auto-generate employee ID if not provided
    let empId = customId && customId.trim() ? customId.trim().toUpperCase() : null;
    if (!empId) {
      const deptCode = department.includes('Software')
        ? 'SE'
        : department.includes('HR')
          ? 'HR'
          : department.includes('Sales')
            ? 'SL'
            : department.includes('Hardware')
              ? 'HW'
              : 'DS';
      const year = new Date().getFullYear();
      const randNum = Math.floor(100 + Math.random() * 900);
      empId = `DS-${deptCode}-${year}-${randNum}`;
    }

    const now = new Date().toISOString();
    const customColsJson = Array.isArray(customColumns) ? JSON.stringify(customColumns) : '[]';
    const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : '[]';
    const bankDetailsJson = bankDetails ? JSON.stringify(bankDetails) : JSON.stringify({
      bankName: 'HDFC Bank Ltd.',
      accountNumber: '•••• •••• •••• 5621',
      ifscCode: 'HDFC0001842',
      panNumber: 'ABCDE••••F',
      uanNumber: '1012••••8877',
    });

    const insert = db.prepare(`
      INSERT INTO employees (
        id, name, email, department, designation, phone, joiningDate,
        employmentType, reportingManager, location, workShift, currentAddress,
        emergencyContactName, emergencyContactPhone, emergencyContactRelation,
        bloodGroup, dateOfBirth, gender, status, salary, photo,
        skills, customColumns, bankDetails, createdBy, updatedBy, createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, 'CEO', 'CEO', ?, ?
      )
    `);

    insert.run(
      empId,
      name.trim(),
      normalizedEmail,
      department.trim(),
      designation.trim(),
      phone.trim(),
      joiningDate.trim(),
      employmentType.trim(),
      reportingManager.trim(),
      location.trim(),
      workShift.trim(),
      currentAddress.trim(),
      emergencyContactName.trim(),
      emergencyContactPhone.trim(),
      emergencyContactRelation.trim(),
      bloodGroup.trim(),
      dateOfBirth.trim(),
      gender.trim(),
      status.trim(),
      salary.trim(),
      photo || null,
      skillsJson,
      customColsJson,
      bankDetailsJson,
      now,
      now
    );

    const created = db.prepare('SELECT * FROM employees WHERE id = ?').get(empId);

    return res.status(201).json({
      success: true,
      message: `Employee "${name}" has been successfully added with ID ${empId}!`,
      employee: formatEmployee(created),
    });
  } catch (err) {
    console.error('[API] Error creating employee:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to add employee.',
    });
  }
});

/**
 * PUT /api/admin/employees/:id
 * Protected: Update employee details
 */
router.put('/admin/employees/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found.',
      });
    }

    const {
      name = existing.name,
      email = existing.email,
      department = existing.department,
      designation = existing.designation,
      phone = existing.phone,
      joiningDate = existing.joiningDate,
      employmentType = existing.employmentType,
      reportingManager = existing.reportingManager,
      location = existing.location,
      workShift = existing.workShift,
      currentAddress = existing.currentAddress,
      emergencyContactName = existing.emergencyContactName,
      emergencyContactPhone = existing.emergencyContactPhone,
      emergencyContactRelation = existing.emergencyContactRelation,
      bloodGroup = existing.bloodGroup,
      dateOfBirth = existing.dateOfBirth,
      gender = existing.gender,
      status = existing.status,
      salary = existing.salary,
      photo = existing.photo,
      customColumns,
      skills,
      bankDetails,
    } = req.body || {};

    const customColsJson = customColumns !== undefined
      ? (Array.isArray(customColumns) ? JSON.stringify(customColumns) : '[]')
      : existing.customColumns;

    const skillsJson = skills !== undefined
      ? (Array.isArray(skills) ? JSON.stringify(skills) : '[]')
      : existing.skills;

    const bankDetailsJson = bankDetails !== undefined
      ? (typeof bankDetails === 'object' ? JSON.stringify(bankDetails) : existing.bankDetails)
      : existing.bankDetails;

    const now = new Date().toISOString();

    const update = db.prepare(`
      UPDATE employees SET
        name = ?, email = ?, department = ?, designation = ?, phone = ?,
        joiningDate = ?, employmentType = ?, reportingManager = ?, location = ?,
        workShift = ?, currentAddress = ?, emergencyContactName = ?,
        emergencyContactPhone = ?, emergencyContactRelation = ?, bloodGroup = ?,
        dateOfBirth = ?, gender = ?, status = ?, salary = ?, photo = ?,
        skills = ?, customColumns = ?, bankDetails = ?, updatedBy = 'CEO', updatedAt = ?
      WHERE id = ?
    `);

    update.run(
      name,
      email,
      department,
      designation,
      phone,
      joiningDate,
      employmentType,
      reportingManager,
      location,
      workShift,
      currentAddress,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      bloodGroup,
      dateOfBirth,
      gender,
      status,
      salary,
      photo,
      skillsJson,
      customColsJson,
      bankDetailsJson,
      now,
      id
    );

    const updated = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);

    return res.json({
      success: true,
      message: `Employee "${name}" has been updated successfully!`,
      employee: formatEmployee(updated),
    });
  } catch (err) {
    console.error('[API] Error updating employee:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update employee details.',
    });
  }
});

/**
 * DELETE /api/admin/employees/:id
 * Protected: Delete an employee from the organization
 */
router.delete('/admin/employees/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found.',
      });
    }

    db.prepare('DELETE FROM employees WHERE id = ?').run(id);

    return res.json({
      success: true,
      message: `Employee "${existing.name}" (${id}) has been successfully deleted from the organization.`,
      deletedId: id,
    });
  } catch (err) {
    console.error('[API] Error deleting employee:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete employee record.',
    });
  }
});

// ==========================================
// EMPLOYEE PORTAL API ENDPOINTS
// ==========================================

/**
 * GET /api/employee/profile
 * Fetch employee profile details by email or id
 */
router.get('/employee/profile', (req, res) => {
  try {
    const { email, id } = req.query;
    if (!email && !id) {
      return res.status(400).json({ success: false, message: 'Email or ID is required.' });
    }

    let row = null;
    if (id) {
      row = db.prepare('SELECT * FROM employees WHERE id = ?').get(id.trim());
    } else if (email) {
      row = db.prepare('SELECT * FROM employees WHERE LOWER(email) = ?').get(email.trim().toLowerCase());
    }

    if (!row) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    return res.json({
      success: true,
      employee: formatEmployee(row),
    });
  } catch (err) {
    console.error('[API] Error fetching employee profile:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
});

/**
 * PUT /api/employee/profile
 * Allow employee to update their editable profile fields (photo, phone, location, address, emergency contact, custom columns)
 */
router.put('/employee/profile', (req, res) => {
  try {
    const { id, email, ...updates } = req.body || {};
    if (!id && !email) {
      return res.status(400).json({ success: false, message: 'Employee ID or email is required.' });
    }

    const existing = id
      ? db.prepare('SELECT * FROM employees WHERE id = ?').get(id)
      : db.prepare('SELECT * FROM employees WHERE LOWER(email) = ?').get(email.toLowerCase());

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    const name = updates.name !== undefined ? updates.name : existing.name;
    const phone = updates.phone !== undefined ? updates.phone : existing.phone;
    const location = updates.location !== undefined ? updates.location : existing.location;
    const workShift = updates.workShift !== undefined ? updates.workShift : existing.workShift;
    const currentAddress = updates.currentAddress !== undefined ? updates.currentAddress : existing.currentAddress;
    const photo = updates.photo !== undefined ? updates.photo : existing.photo;
    const emergencyContactName = updates.emergencyContactName || updates.emergencyContact?.name || existing.emergencyContactName;
    const emergencyContactPhone = updates.emergencyContactPhone || updates.emergencyContact?.phone || existing.emergencyContactPhone;
    const emergencyContactRelation = updates.emergencyContactRelation || updates.emergencyContact?.relation || existing.emergencyContactRelation;

    const customColsJson = updates.customColumns !== undefined
      ? JSON.stringify(updates.customColumns)
      : existing.customColumns;

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE employees SET
        name = ?, phone = ?, location = ?, workShift = ?, currentAddress = ?,
        photo = ?, emergencyContactName = ?, emergencyContactPhone = ?,
        emergencyContactRelation = ?, customColumns = ?, updatedBy = 'Employee', updatedAt = ?
      WHERE id = ?
    `).run(
      name,
      phone,
      location,
      workShift,
      currentAddress,
      photo,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      customColsJson,
      now,
      existing.id
    );

    const updated = db.prepare('SELECT * FROM employees WHERE id = ?').get(existing.id);

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      employee: formatEmployee(updated),
    });
  } catch (err) {
    console.error('[API] Error updating employee profile:', err);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
});

/**
 * GET /api/employee/attendance
 * Fetch attendance history for the logged-in employee
 */
router.get('/employee/attendance', (req, res) => {
  try {
    const { employeeId } = req.query;
    let query = 'SELECT * FROM employee_attendance';
    const params = [];

    if (employeeId && employeeId.trim()) {
      query += ' WHERE employeeId = ?';
      params.push(employeeId.trim());
    }

    query += ' ORDER BY date DESC';

    const records = db.prepare(query).all(...params);

    return res.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (err) {
    console.error('[API] Error fetching employee attendance:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve employee attendance history.',
    });
  }
});

/**
 * POST /api/employee/attendance/punch
 * Check-in or check-out an employee with verified photo
 */
router.post('/employee/attendance/punch', (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      department = 'Software Engineer',
      type = 'in', // 'in' | 'out'
      photoUrl = null,
      punchInPhoto = null,
      punchOutPhoto = null,
    } = req.body || {};

    if (!employeeId || !employeeName) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID and Name are required.',
      });
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];

    const existing = db.prepare(
      'SELECT * FROM employee_attendance WHERE employeeId = ? AND date = ?'
    ).get(employeeId, dateStr);

    const verifiedPhoto = photoUrl || punchInPhoto || punchOutPhoto || null;

    if (type === 'in') {
      if (existing) {
        // If already punched in but photo is now provided, update photo
        if (verifiedPhoto && !existing.punchInPhoto) {
          db.prepare('UPDATE employee_attendance SET punchInPhoto = ?, updatedAt = ? WHERE id = ?').run(verifiedPhoto, now.toISOString(), existing.id);
          const updated = db.prepare('SELECT * FROM employee_attendance WHERE id = ?').get(existing.id);
          return res.json({
            success: true,
            message: 'Punch-in verification photo updated successfully!',
            record: updated,
          });
        }
        return res.status(400).json({
          success: false,
          message: `Already punched in today at ${existing.checkIn}.`,
        });
      }

      // Check if late (after 09:30 AM)
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const isLate = hours > 9 || (hours === 9 && minutes > 30);
      const status = isLate ? 'Late' : 'Present';

      const id = `att-${Date.now()}`;
      const nowIso = now.toISOString();

      db.prepare(`
        INSERT INTO employee_attendance (
          id, employeeId, employeeName, department, date, day,
          checkIn, checkOut, workHours, status, punchInPhoto, punchOutPhoto, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        employeeId,
        employeeName,
        department,
        dateStr,
        dayName,
        timeStr,
        '--:--',
        'In Progress',
        status,
        verifiedPhoto,
        null,
        nowIso,
        nowIso
      );

      const created = db.prepare('SELECT * FROM employee_attendance WHERE id = ?').get(id);

      return res.json({
        success: true,
        message: `Punched in successfully at ${timeStr}!`,
        record: created,
      });
    } else {
      // Punch out
      if (!existing) {
        return res.status(400).json({
          success: false,
          message: 'Cannot punch out without punching in first.',
        });
      }

      // Calculate accurate working hours between check-in and check-out
      const parseTimeToMinutes = (tStr) => {
        if (!tStr) return null;
        const match = tStr.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
        if (!match) return null;
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const meridian = match[3] ? match[3].toUpperCase() : null;
        if (meridian === 'PM' && hours < 12) hours += 12;
        if (meridian === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      const inMins = parseTimeToMinutes(existing.checkIn);
      const outMins = parseTimeToMinutes(timeStr);
      let calculatedHours = '8h 00m';

      if (inMins !== null && outMins !== null) {
        let diff = outMins - inMins;
        if (diff < 0) diff += 24 * 60;
        const hrs = Math.floor(diff / 60);
        const mins = diff % 60;
        calculatedHours = `${hrs}h ${mins.toString().padStart(2, '0')}m`;
      }

      const nowIso = now.toISOString();
      db.prepare(`
        UPDATE employee_attendance
        SET checkOut = ?, workHours = ?, punchOutPhoto = COALESCE(?, punchOutPhoto), updatedAt = ?
        WHERE id = ?
      `).run(timeStr, calculatedHours, verifiedPhoto, nowIso, existing.id);

      const updated = db.prepare('SELECT * FROM employee_attendance WHERE id = ?').get(existing.id);

      return res.json({
        success: true,
        message: `Punched out successfully at ${timeStr}!`,
        record: updated,
      });
    }
  } catch (err) {
    console.error('[API] Error recording attendance punch:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to record attendance punch.',
    });
  }
});

/**
 * POST /api/employee/attendance/photo
 * Direct attendance photo update for the current date
 */
router.post('/employee/attendance/photo', (req, res) => {
  try {
    const { employeeId, photoUrl, date } = req.body || {};
    if (!employeeId || !photoUrl) {
      return res.status(400).json({ success: false, message: 'Employee ID and photoUrl required.' });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];
    const existing = db.prepare('SELECT * FROM employee_attendance WHERE employeeId = ? AND date = ?').get(employeeId, targetDate);

    if (existing) {
      db.prepare('UPDATE employee_attendance SET punchInPhoto = ?, updatedAt = ? WHERE id = ?')
        .run(photoUrl, new Date().toISOString(), existing.id);
    }
    return res.json({ success: true, message: 'Photo saved successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to upload photo.' });
  }
});

/**
 * GET /api/employee/leaves
 * Fetch leave requests submitted by the employee
 */
router.get('/employee/leaves', (req, res) => {
  try {
    const { employeeId } = req.query;
    let query = 'SELECT * FROM employee_leaves';
    const params = [];

    if (employeeId && employeeId.trim()) {
      query += ' WHERE employeeId = ?';
      params.push(employeeId.trim());
    }

    query += ' ORDER BY appliedOn DESC';

    const leaves = db.prepare(query).all(...params);

    return res.json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (err) {
    console.error('[API] Error fetching employee leaves:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve leave requests.',
    });
  }
});

/**
 * POST /api/employee/leaves
 * Submit a new leave request from the employee portal
 */
router.post('/employee/leaves', (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      department = 'Software Engineer',
      leaveType,
      fromDate,
      toDate,
      daysCount = 1,
      reason,
      attachmentUrl = null,
      attachmentName = null,
    } = req.body || {};

    if (!employeeId || !employeeName || !leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'All fields (employee, leave type, dates, reason) are required.',
      });
    }

    const id = `LR-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const appliedOn = now.split('T')[0];

    db.prepare(`
      INSERT INTO employee_leaves (
        id, employeeId, employeeName, department, leaveType,
        fromDate, toDate, daysCount, reason, appliedOn,
        status, managerRemarks, reviewedBy, reviewedAt, attachmentUrl, attachmentName, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      employeeId.trim(),
      employeeName.trim(),
      department.trim(),
      leaveType.trim(),
      fromDate.trim(),
      toDate.trim(),
      Number(daysCount) || 1,
      reason.trim(),
      appliedOn,
      'Pending',
      'Under review by Department Manager.',
      null,
      null,
      attachmentUrl,
      attachmentName,
      now,
      now
    );

    const created = db.prepare('SELECT * FROM employee_leaves WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully! Your manager has been notified.',
      leave: created,
    });
  } catch (err) {
    console.error('[API] Error applying for leave:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit leave request.',
    });
  }
});

export default router;
