/**
 * Shared LocalStorage Data Management for Durgam Soft
 * Bridges Employee Portal actions (Attendance Punch & Leave Applications)
 * with the Admin / CEO Portal (Attendance Oversight, Leave Approvals & Dashboard Metrics).
 */

export const ATTENDANCE_STORAGE_KEY = 'durgam_shared_attendance';
export const LEAVES_STORAGE_KEY = 'durgam_shared_leaves';

/**
 * Get all shared attendance records from localStorage
 */
export const getSharedAttendance = () => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[sharedStorage] Error reading shared attendance:', err);
    return [];
  }
};

/**
 * Save or update an attendance record in shared localStorage
 */
export const saveSharedAttendanceRecord = (record) => {
  if (!record || !record.employeeId || !record.date) return null;
  try {
    const existing = getSharedAttendance();
    const index = existing.findIndex(
      (r) => r.employeeId === record.employeeId && r.date === record.date
    );

    let updated;
    if (index >= 0) {
      // Merge update
      const merged = { ...existing[index], ...record };
      existing[index] = merged;
      updated = [...existing];
    } else {
      updated = [record, ...existing];
    }

    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('durgam_attendance_updated'));
    return updated;
  } catch (err) {
    console.error('[sharedStorage] Error saving attendance:', err);
    return null;
  }
};

/**
 * Get attendance records filtered for a specific employee
 */
export const getEmployeeAttendanceRecords = (employeeId) => {
  if (!employeeId) return [];
  const all = getSharedAttendance();
  return all.filter((r) => r.employeeId === employeeId);
};

/**
 * Calculate attendance summary stats for a given date (defaults to today)
 */
export const calculateAttendanceSummary = (records, targetDate) => {
  const dateStr = targetDate || new Date().toISOString().split('T')[0];
  const targetRecords = (records || []).filter((r) => r.date === dateStr);

  return {
    totalToday: targetRecords.length,
    present: targetRecords.filter((r) => r.status === 'Present').length,
    late: targetRecords.filter((r) => r.status === 'Late').length,
    halfDay: targetRecords.filter((r) => r.status === 'Half Day').length,
    wfh: targetRecords.filter((r) => r.status === 'Work From Home').length,
    absent: targetRecords.filter((r) => r.status === 'Absent').length,
  };
};

/**
 * Get all shared leave requests from localStorage
 */
export const getSharedLeaves = () => {
  try {
    const raw = localStorage.getItem(LEAVES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[sharedStorage] Error reading shared leaves:', err);
    return [];
  }
};

/**
 * Add a new leave request from employee portal to shared storage
 */
export const saveSharedLeaveRequest = (leaveRequest) => {
  if (!leaveRequest || !leaveRequest.id) return null;
  try {
    const existing = getSharedLeaves();
    const updated = [leaveRequest, ...existing.filter((l) => l.id !== leaveRequest.id)];
    localStorage.setItem(LEAVES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('durgam_leaves_updated'));
    return leaveRequest;
  } catch (err) {
    console.error('[sharedStorage] Error saving leave request:', err);
    return null;
  }
};

/**
 * Update leave status (Approve / Reject) by Admin
 */
export const updateSharedLeaveStatus = (leaveId, { status, managerRemarks, reviewedBy }) => {
  if (!leaveId) return null;
  try {
    const existing = getSharedLeaves();
    const index = existing.findIndex((l) => l.id === leaveId);
    if (index === -1) return null;

    const updatedLeave = {
      ...existing[index],
      status: status || existing[index].status,
      managerRemarks: managerRemarks !== undefined ? managerRemarks : existing[index].managerRemarks,
      reviewedBy: reviewedBy || 'CEO',
      reviewedAt: new Date().toISOString(),
    };

    existing[index] = updatedLeave;
    localStorage.setItem(LEAVES_STORAGE_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event('durgam_leaves_updated'));
    return updatedLeave;
  } catch (err) {
    console.error('[sharedStorage] Error updating leave status:', err);
    return null;
  }
};

/**
 * Get leaves filtered for a specific employee
 */
export const getEmployeeLeaves = (employeeId) => {
  if (!employeeId) return [];
  const all = getSharedLeaves();
  return all.filter((l) => l.employeeId === employeeId);
};

/**
 * Calculate leave stats (total, pending, approved, rejected)
 */
export const calculateLeavesStats = (leaves) => {
  const list = leaves || [];
  return {
    total: list.length,
    pending: list.filter((l) => l.status === 'Pending').length,
    approved: list.filter((l) => l.status === 'Approved').length,
    rejected: list.filter((l) => l.status === 'Rejected').length,
  };
};
