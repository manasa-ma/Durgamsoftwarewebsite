import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEMO_EMPLOYEES,
  INITIAL_ATTENDANCE_HISTORY,
  INITIAL_LEAVE_BALANCES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/employeeMockData';
import { calculateWorkHours } from '../utils/workHoursCalculator';
import { authenticateUser } from '../utils/authStorage';
import {
  saveSharedAttendanceRecord,
  getEmployeeAttendanceRecords,
  saveSharedLeaveRequest,
  getEmployeeLeaves,
} from '../utils/sharedStorage';

const EmployeeAuthContext = createContext(null);

const getUserStorageKey = (user) => {
  if (!user) return 'guest';
  const raw = user.email || user.id || 'employee';
  return raw.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
};

const getInitialTodayStatus = () => ({
  hasCheckedIn: false,
  hasCheckedOut: false,
  checkInTime: null,
  checkOutTime: null,
  workHours: null,
  date: new Date().toISOString().split('T')[0],
  punchInPhoto: null,
  punchOutPhoto: null,
});

export const EmployeeAuthProvider = ({ children }) => {
  // 1. Employee Session & Auth Token State
  const [token, setToken] = useState(() => localStorage.getItem('durgam_employee_token') || null);
  const [employeeUser, setEmployeeUser] = useState(() => {
    try {
      const saved = localStorage.getItem('durgam_employee_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return {
            ...parsed,
            location: parsed.location || 'Cherlapalli',
            workShift: parsed.workShift || '9:00 AM - 6:00 PM',
          };
        }
      }
    } catch {
      // Fallback
    }
    return null;
  });

  const getAuthHeaders = () => {
    const currentToken = token || localStorage.getItem('durgam_employee_token');
    return {
      'Content-Type': 'application/json',
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
    };
  };

  // 2. Attendance State - Scoped per logged-in employee
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    try {
      const savedUser = localStorage.getItem('durgam_employee_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const key = getUserStorageKey(parsedUser);
        const saved = localStorage.getItem(`durgam_employee_attendance_${key}`);
        if (saved) return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_ATTENDANCE_HISTORY;
  });

  const [todayAttendance, setTodayAttendance] = useState(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      const savedUser = localStorage.getItem('durgam_employee_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const key = getUserStorageKey(parsedUser);
        const saved = localStorage.getItem(`durgam_employee_today_status_${key}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.date === todayStr) {
            return parsed;
          }
        }
      }
    } catch {
      // Fallback
    }
    return getInitialTodayStatus();
  });

  // 3. Leave Requests State - Scoped per logged-in employee
  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const savedUser = localStorage.getItem('durgam_employee_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const key = getUserStorageKey(parsedUser);
        const saved = localStorage.getItem(`durgam_employee_leaves_${key}`);
        if (saved) return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_LEAVE_REQUESTS;
  });

  const [leaveBalances, setLeaveBalances] = useState(() => {
    try {
      const savedUser = localStorage.getItem('durgam_employee_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const key = getUserStorageKey(parsedUser);
        const saved = localStorage.getItem(`durgam_employee_leave_balances_${key}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          // If legacy format with casual/sick or lacking accrued tracking, reset to 1-leave-per-month policy
          if (!parsed?.paid?.accrued) {
            return INITIAL_LEAVE_BALANCES;
          }
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_LEAVE_BALANCES;
  });

  // 4. Announcements
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const cached = localStorage.getItem('durgam_employee_announcements_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_ANNOUNCEMENTS;
  });
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);

  // Read Announcements Tracking (for notification badges)
  const [readAnnouncementIds, setReadAnnouncementIds] = useState(() => {
    try {
      const saved = localStorage.getItem('durgam_employee_read_announcements');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Clean legacy shared storage keys and dummy records
  useEffect(() => {
    try {
      localStorage.removeItem('durgam_employee_attendance');
      localStorage.removeItem('durgam_employee_today_status');

      const CLEAN_SLATE_KEY = 'durgam_clean_slate_20261030';
      if (!localStorage.getItem(CLEAN_SLATE_KEY)) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (
            k &&
            (k.startsWith('durgam_employee_attendance_') ||
              k.startsWith('durgam_employee_leaves_') ||
              k.startsWith('durgam_employee_today_status_') ||
              k.startsWith('durgam_employee_leave_balances_'))
          ) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        localStorage.setItem(CLEAN_SLATE_KEY, 'true');
        setAttendanceRecords([]);
        setLeaveRequests([]);
        setLeaveBalances(INITIAL_LEAVE_BALANCES);
        setTodayAttendance(getInitialTodayStatus());
      }
    } catch {
      // silent
    }
  }, []);

  // Refresh announcements helper (maintains local cache)
  const refreshAnnouncements = () => {
    try {
      const cached = localStorage.getItem('durgam_employee_announcements_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAnnouncements(parsed);
          return;
        }
      }
    } catch {
      // fallback
    }
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
  };

  const refreshEmployeeLeaves = () => {
    // Loaded per active user from localStorage
  };

  // Save read announcement IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'durgam_employee_read_announcements',
        JSON.stringify(readAnnouncementIds)
      );
    } catch {
      // silent
    }
  }, [readAnnouncementIds]);

  // Mark single announcement as read
  const markAnnouncementAsRead = (id) => {
    if (!id) return;
    setReadAnnouncementIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  // Mark all current announcements as read
  const markAllAnnouncementsAsRead = () => {
    const allIds = announcements.map((a) => a.id);
    setReadAnnouncementIds((prev) => Array.from(new Set([...prev, ...allIds])));
  };

  // Calculate unread announcements count
  const unreadAnnouncementsCount = announcements.filter(
    (ann) => !readAnnouncementIds.includes(ann.id)
  ).length;

  // Sync employeeUser to localStorage
  useEffect(() => {
    if (employeeUser) {
      localStorage.setItem('durgam_employee_user', JSON.stringify(employeeUser));
    } else {
      localStorage.removeItem('durgam_employee_user');
    }
  }, [employeeUser]);

  // When active employeeUser changes (e.g. login, logout, account switch), load THAT specific user's isolated data
  useEffect(() => {
    if (!employeeUser) {
      setAttendanceRecords([]);
      setTodayAttendance(getInitialTodayStatus());
      setLeaveRequests([]);
      setLeaveBalances(INITIAL_LEAVE_BALANCES);
      return;
    }

    const key = getUserStorageKey(employeeUser);
    const todayStr = new Date().toISOString().split('T')[0];

    // Load user's attendance records (check shared storage first)
    try {
      const sharedAtt = getEmployeeAttendanceRecords(employeeUser.id);
      if (sharedAtt && sharedAtt.length > 0) {
        setAttendanceRecords(sharedAtt);
      } else {
        const savedAtt = localStorage.getItem(`durgam_employee_attendance_${key}`);
        if (savedAtt) {
          setAttendanceRecords(JSON.parse(savedAtt));
        } else {
          setAttendanceRecords([]);
        }
      }
    } catch {
      setAttendanceRecords([]);
    }

    // Load user's today attendance status
    try {
      const savedToday = localStorage.getItem(`durgam_employee_today_status_${key}`);
      if (savedToday) {
        const parsed = JSON.parse(savedToday);
        if (parsed && parsed.date === todayStr) {
          setTodayAttendance(parsed);
        } else {
          const fresh = getInitialTodayStatus();
          setTodayAttendance(fresh);
          localStorage.setItem(`durgam_employee_today_status_${key}`, JSON.stringify(fresh));
        }
      } else {
        const fresh = getInitialTodayStatus();
        setTodayAttendance(fresh);
        localStorage.setItem(`durgam_employee_today_status_${key}`, JSON.stringify(fresh));
      }
    } catch {
      setTodayAttendance(getInitialTodayStatus());
    }

    // Load user's leave requests (check shared storage first)
    try {
      const sharedLeaves = getEmployeeLeaves(employeeUser.id);
      if (sharedLeaves && sharedLeaves.length > 0) {
        setLeaveRequests(sharedLeaves);
      } else {
        const savedLeaves = localStorage.getItem(`durgam_employee_leaves_${key}`);
        if (savedLeaves) {
          setLeaveRequests(JSON.parse(savedLeaves));
        } else {
          setLeaveRequests([]);
        }
      }
    } catch {
      setLeaveRequests([]);
    }

    // Load user's leave balances
    try {
      const savedBalances = localStorage.getItem(`durgam_employee_leave_balances_${key}`);
      if (savedBalances) {
        const parsed = JSON.parse(savedBalances);
        if (!parsed?.paid?.accrued) {
          setLeaveBalances(INITIAL_LEAVE_BALANCES);
          localStorage.setItem(`durgam_employee_leave_balances_${key}`, JSON.stringify(INITIAL_LEAVE_BALANCES));
        } else {
          setLeaveBalances(parsed);
        }
      } else {
        setLeaveBalances(INITIAL_LEAVE_BALANCES);
        localStorage.setItem(`durgam_employee_leave_balances_${key}`, JSON.stringify(INITIAL_LEAVE_BALANCES));
      }
    } catch {
      setLeaveBalances(INITIAL_LEAVE_BALANCES);
    }
  }, [employeeUser?.email, employeeUser?.id]);

  // Real-time synchronization when Admin updates leaves or attendance
  useEffect(() => {
    if (!employeeUser?.id) return;

    const onLeavesUpdated = () => {
      try {
        const sharedLeaves = getEmployeeLeaves(employeeUser.id);
        if (sharedLeaves && sharedLeaves.length > 0) {
          setLeaveRequests(sharedLeaves);
        }
      } catch {
        // silent
      }
    };

    const onAttendanceUpdated = () => {
      try {
        const sharedAtt = getEmployeeAttendanceRecords(employeeUser.id);
        if (sharedAtt && sharedAtt.length > 0) {
          setAttendanceRecords(sharedAtt);
        }
      } catch {
        // silent
      }
    };

    window.addEventListener('durgam_leaves_updated', onLeavesUpdated);
    window.addEventListener('durgam_attendance_updated', onAttendanceUpdated);
    window.addEventListener('storage', onLeavesUpdated);

    return () => {
      window.removeEventListener('durgam_leaves_updated', onLeavesUpdated);
      window.removeEventListener('durgam_attendance_updated', onAttendanceUpdated);
      window.removeEventListener('storage', onLeavesUpdated);
    };
  }, [employeeUser?.id]);


  // Persist per-user changes
  useEffect(() => {
    if (!employeeUser) return;
    const key = getUserStorageKey(employeeUser);
    try {
      localStorage.setItem(`durgam_employee_attendance_${key}`, JSON.stringify(attendanceRecords));
    } catch (err) {
      console.warn('LocalStorage error saving attendance:', err);
    }
  }, [attendanceRecords, employeeUser]);

  useEffect(() => {
    if (!employeeUser) return;
    const key = getUserStorageKey(employeeUser);
    try {
      localStorage.setItem(`durgam_employee_today_status_${key}`, JSON.stringify(todayAttendance));
    } catch (err) {
      console.warn('LocalStorage error saving today attendance:', err);
    }
  }, [todayAttendance, employeeUser]);

  useEffect(() => {
    if (!employeeUser) return;
    const key = getUserStorageKey(employeeUser);
    try {
      localStorage.setItem(`durgam_employee_leaves_${key}`, JSON.stringify(leaveRequests));
    } catch (err) {
      console.warn('LocalStorage error saving leaves:', err);
    }
  }, [leaveRequests, employeeUser]);

  useEffect(() => {
    if (!employeeUser) return;
    const key = getUserStorageKey(employeeUser);
    try {
      localStorage.setItem(`durgam_employee_leave_balances_${key}`, JSON.stringify(leaveBalances));
    } catch (err) {
      console.warn('LocalStorage error saving leave balances:', err);
    }
  }, [leaveBalances, employeeUser]);

  /**
   * Frontend-only Login Handler
   * Validates credentials and matches or creates employee profile.
   * Supports both 2-field login ({ email, password }) and explicit registration login.
   */
  const login = async ({ name, department, email, password, loginPhoto, loginLocation }) => {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const normalizedEmail = email.trim().toLowerCase();

    let resolvedName = name ? name.trim() : '';
    let resolvedDepartment = department ? department.trim() : '';

    // If name or department not passed (standard 2-field login), match against authStorage
    if (!resolvedName || !resolvedDepartment) {
      const authRes = authenticateUser({ email: normalizedEmail, password });
      if (!authRes.success) {
        return { success: false, error: 'Invalid email or password' };
      }

      if (authRes.user.role === 'CEO') {
        return {
          success: false,
          isCeo: true,
          user: authRes.user,
          error: 'CEO executive account. Please log in via Admin Portal.',
        };
      }

      resolvedName = authRes.user.username || authRes.user.name || 'Employee';
      resolvedDepartment = authRes.user.department || authRes.user.role || 'Software Engineer';
    }

    const demoProfile = DEMO_EMPLOYEES[normalizedEmail];
    let fullEmployeeProfile;

    if (demoProfile) {
      fullEmployeeProfile = {
        ...demoProfile,
        name: resolvedName,
        department: resolvedDepartment,
        location: 'Cherlapalli',
        workShift: '9:00 AM - 6:00 PM',
        photo: loginPhoto || demoProfile.photo || null,
        loginPhoto: loginPhoto || null,
        loginLocation: loginLocation || null,
      };
    } else {
      const deptCode = resolvedDepartment.includes('Software') ? 'SE' : resolvedDepartment.includes('HR') ? 'HR' : 'SL';
      const randomNum = Math.floor(100 + Math.random() * 900);
      fullEmployeeProfile = {
        id: `DS-${deptCode}-2026-${randomNum}`,
        name: resolvedName,
        department: resolvedDepartment,
        designation:
          resolvedDepartment === 'Software Engineer'
            ? 'Software Development Engineer'
            : resolvedDepartment === 'HR'
              ? 'Human Resources Executive'
              : 'Senior Sales Representative',
        email: normalizedEmail,
        phone: '+91 98800 12345',
        joiningDate: '01 Jan 2024',
        employmentType: 'Full-time / Permanent',
        reportingManager: 'Venu Durgam (Technical Director)',
        location: 'Cherlapalli',
        workShift: '9:00 AM - 6:00 PM',
        photo: loginPhoto || null,
        loginPhoto: loginPhoto || null,
        loginLocation: loginLocation || null,
        bloodGroup: 'B+',
        dateOfBirth: '15 Jul 1997',
        gender: 'Not Specified',
        currentAddress: 'Cherlapalli, Telangana 500051',
        emergencyContact: {
          name: 'Primary Contact',
          relation: 'Family',
          phone: '+91 98800 54321',
        },
        bankDetails: {
          bankName: 'HDFC Bank Ltd.',
          accountNumber: '•••• •••• •••• 5621',
          ifscCode: 'HDFC0001842',
          panNumber: 'ABCDE••••F',
          uanNumber: '1012••••8877',
        },
        skills:
          department === 'Software Engineer'
            ? ['React.js', 'JavaScript', 'HTML5 & CSS3', 'Tailwind CSS', 'Git']
            : department === 'HR'
              ? ['Talent Sourcing', 'Employee Onboarding', 'Compliance', 'HR Operations']
              : ['Enterprise Prospecting', 'B2B Client Demos', 'Pipeline Management', 'Customer Success'],
      };
    }

    logout();
    setEmployeeUser(fullEmployeeProfile);
    localStorage.setItem('durgam_employee_user', JSON.stringify(fullEmployeeProfile));

    // If a GPS-stamped photo was captured on login, record today's attendance punch-in
    if (loginPhoto) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const dateStr = now.toISOString().split('T')[0];
      const key = getUserStorageKey(fullEmployeeProfile);

      const newTodayStatus = {
        date: dateStr,
        hasCheckedIn: true,
        hasCheckedOut: false,
        checkInTime: timeStr,
        checkOutTime: null,
        punchInPhoto: loginPhoto,
        punchOutPhoto: null,
        location: loginLocation?.address || 'Cherlapalli',
      };

      setTodayAttendance(newTodayStatus);
      localStorage.setItem(`durgam_employee_today_status_${key}`, JSON.stringify(newTodayStatus));

      const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);
      const status = isLate ? 'Late' : 'Present';

      const newRecord = {
        id: `att-${Date.now()}`,
        employeeId: fullEmployeeProfile.id,
        employeeName: fullEmployeeProfile.name,
        department: fullEmployeeProfile.department,
        date: dateStr,
        day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        checkIn: timeStr,
        checkOut: '--:--',
        workHours: 'In Progress',
        status,
        photoUrl: loginPhoto,
        punchInPhoto: loginPhoto,
        punchOutPhoto: null,
        location: loginLocation?.address || 'Cherlapalli',
      };

      setAttendanceRecords((prev) => {
        const filtered = prev.filter((r) => r.date !== dateStr);
        const updated = [newRecord, ...filtered];
        localStorage.setItem(`durgam_employee_attendance_${key}`, JSON.stringify(updated));
        return updated;
      });

      // Save to shared storage so Admin sees the punch in immediately
      saveSharedAttendanceRecord(newRecord);
    }

    return { success: true };
  };

  /**
   * Login directly with an authenticated user record
   */
  const loginWithUser = async (user, options = {}) => {
    if (!user) return { success: false, error: 'User is required.' };
    return login({
      name: user.name || user.username,
      department: user.department || user.role,
      email: user.email,
      password: user.password,
      ...options,
    });
  };

  /**
   * Logout Handler
   */
  const logout = () => {
    setEmployeeUser(null);
    localStorage.removeItem('durgam_employee_user');
    localStorage.removeItem('durgam_employee_token');
    localStorage.removeItem('durgam_remember_employee');
    localStorage.removeItem('durgam_remember_admin');
    setTodayAttendance(getInitialTodayStatus());
    setAttendanceRecords([]);
    setLeaveRequests([]);
    setLeaveBalances(INITIAL_LEAVE_BALANCES);
  };

  /**
   * Update Profile Details
   */
  const updateProfile = (updatedFields) => {
    setEmployeeUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('durgam_employee_user', JSON.stringify(next));
      return next;
    });
  };

  /**
   * Punch-in action for current day with optional photo & location
   */
  const markCheckIn = (options = {}) => {
    const photoUrl = typeof options === 'object' && options?.photoUrl ? options.photoUrl : null;
    const location =
      typeof options === 'object' && options?.location
        ? (options.location.address || options.location)
        : 'Cherlapalli, Hyderabad';

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = now.toISOString().split('T')[0];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];

    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);
    const status = isLate ? 'Late' : 'Present';

    const updatedToday = {
      hasCheckedIn: true,
      hasCheckedOut: false,
      checkInTime: timeStr,
      checkOutTime: null,
      date: dateStr,
      punchInPhoto: photoUrl || null,
      punchOutPhoto: null,
      location,
    };
    setTodayAttendance(updatedToday);

    const newRecord = {
      id: `att-${Date.now()}`,
      employeeId: employeeUser?.id || 'DS-EMP-001',
      employeeName: employeeUser?.name || 'Employee',
      department: employeeUser?.department || 'Software Engineer',
      date: dateStr,
      day: dayName,
      checkIn: timeStr,
      checkOut: '--:--',
      workHours: 'In Progress',
      status,
      photoUrl: photoUrl || null,
      punchInPhoto: photoUrl || null,
      punchOutPhoto: null,
      location,
    };

    setAttendanceRecords((prev) => {
      const filtered = prev.filter((r) => r.date !== dateStr);
      return [newRecord, ...filtered];
    });

    // Save to shared localStorage so Admin Attendance Page displays it immediately
    saveSharedAttendanceRecord(newRecord);

    return { success: true, time: timeStr, photoUrl, location };
  };

  /**
   * Punch-out action for current day with optional photo & location
   */
  const markCheckOut = (options = {}) => {
    const photoUrl = typeof options === 'object' && options?.photoUrl ? options.photoUrl : null;
    const location =
      typeof options === 'object' && options?.location
        ? (options.location.address || options.location)
        : todayAttendance.location || 'Cherlapalli, Hyderabad';

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = now.toISOString().split('T')[0];

    const inTime = todayAttendance.checkInTime || '09:00 AM';
    const computedHours = calculateWorkHours(inTime, timeStr);

    const updatedToday = {
      ...todayAttendance,
      hasCheckedOut: true,
      checkOutTime: timeStr,
      workHours: computedHours,
      punchOutPhoto: photoUrl || todayAttendance.punchOutPhoto || null,
      location,
    };
    setTodayAttendance(updatedToday);

    let updatedRecord = null;
    setAttendanceRecords((prev) => {
      return prev.map((record) => {
        if (record.date === dateStr) {
          const recIn = record.checkIn && record.checkIn !== '--:--' ? record.checkIn : inTime;
          const actualHours = calculateWorkHours(recIn, timeStr);
          updatedRecord = {
            ...record,
            checkOut: timeStr,
            workHours: actualHours,
            status: 'Present',
            photoUrl: photoUrl || record.photoUrl || null,
            punchOutPhoto: photoUrl || null,
            location,
          };
          return updatedRecord;
        }
        return record;
      });
    });

    if (!updatedRecord) {
      updatedRecord = {
        id: `att-${Date.now()}`,
        employeeId: employeeUser?.id || 'DS-EMP-001',
        employeeName: employeeUser?.name || 'Employee',
        department: employeeUser?.department || 'Software Engineer',
        date: dateStr,
        day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        checkIn: inTime,
        checkOut: timeStr,
        workHours: computedHours,
        status: 'Present',
        photoUrl: photoUrl || null,
        punchOutPhoto: photoUrl || null,
        location,
      };
    }

    // Save to shared localStorage so Admin Attendance Page displays it immediately
    saveSharedAttendanceRecord(updatedRecord);

    return { success: true, time: timeStr, photoUrl, location };
  };

  /**
   * Direct Attendance Photo Upload for current day
   */
  const uploadAttendancePhoto = (photoUrl, location = null) => {
    if (!photoUrl) return;
    const dateStr = new Date().toISOString().split('T')[0];
    const locStr =
      location?.address || (typeof location === 'string' ? location : 'Cherlapalli, Hyderabad');

    setTodayAttendance((prev) => ({
      ...prev,
      punchInPhoto: photoUrl,
      location: locStr,
    }));

    setAttendanceRecords((prev) =>
      prev.map((record) => {
        if (record.date === dateStr) {
          return {
            ...record,
            photoUrl,
            punchInPhoto: photoUrl,
            location: locStr,
          };
        }
        return record;
      })
    );

    if (employeeUser?.id) {
      saveSharedAttendanceRecord({
        employeeId: employeeUser.id,
        employeeName: employeeUser.name,
        department: employeeUser.department,
        date: dateStr,
        photoUrl,
        punchInPhoto: photoUrl,
        location: locStr,
      });
    }
  };

  /**
   * Apply for Leave
   */
  const applyLeave = ({
    leaveType,
    fromDate,
    toDate,
    reason,
    daysCount = 1,
    attachmentUrl = null,
    attachmentName = null,
  }) => {
    const newRequest = {
      id: `LR-2026-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: employeeUser?.id || 'DS-EMP-001',
      employeeName: employeeUser?.name || 'Employee',
      department: employeeUser?.department || 'Software Engineer',
      leaveType,
      fromDate,
      toDate,
      daysCount: Number(daysCount),
      reason: reason ? reason.trim() : '',
      attachmentUrl: attachmentUrl || null,
      attachmentName: attachmentName || null,
      appliedOn: new Date().toISOString().split('T')[0],
      status: 'Pending',
      managerRemarks: 'Under review by Department Manager.',
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);

    // Save to shared localStorage so Admin Leave Approvals Page displays it immediately
    saveSharedLeaveRequest(newRequest);

    // Deduct from paid leave balance unless it's unpaid / LOP
    const isUnpaid =
      leaveType.toLowerCase().includes('unpaid') ||
      leaveType.toLowerCase().includes('lop');

    if (!isUnpaid) {
      setLeaveBalances((prev) => {
        const currentPaid = prev.paid || INITIAL_LEAVE_BALANCES.paid;
        const count = Number(daysCount) || 1;
        return {
          ...prev,
          paid: {
            ...currentPaid,
            available: Math.max(0, (currentPaid.available ?? 8) - count),
            used: (currentPaid.used ?? 2) + count,
          },
        };
      });
    }

    return { success: true, newRequest };
  };

  const value = {
    employeeUser,
    isAuthenticated: Boolean(employeeUser),
    login,
    loginWithUser,
    logout,
    updateProfile,
    todayAttendance,
    attendanceRecords,
    markCheckIn,
    markCheckOut,
    uploadAttendancePhoto,
    leaveRequests,
    leaveBalances,
    applyLeave,
    announcements,
    announcementsLoading,
    unreadAnnouncementsCount,
    readAnnouncementIds,
    markAnnouncementAsRead,
    markAllAnnouncementsAsRead,
    refreshAnnouncements,
  };

  return <EmployeeAuthContext.Provider value={value}>{children}</EmployeeAuthContext.Provider>;
};

export const useEmployeeAuth = () => {
  const context = useContext(EmployeeAuthContext);
  if (!context) {
    throw new Error('useEmployeeAuth must be used within an EmployeeAuthProvider');
  }
  return context;
};

export default EmployeeAuthContext;
