/**
 * Frontend-only Authentication & User Registration Storage
 * Manages user registration, credential validation, and role assignment via localStorage.
 */

export const EMPLOYEE_ROLES = [
  'Software Engineer',
  'HR',
  'Sales',
  'Hardware & POS Support',
];

export const PORTAL_ROLES = [
  ...EMPLOYEE_ROLES,
  'CEO',
];

export const DEFAULT_USERS = [];

const STORAGE_KEY = 'durgam_registered_users';

/**
 * Get registered users from localStorage
 */
export const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[authStorage] Error loading registered users:', err);
    return [];
  }
};

/**
 * Register a new user in frontend localStorage
 * Fields: username, email, password, role ('Software Engineer' | 'HR' | 'Sales' | 'CEO')
 */
export const registerUser = ({ username, email, password, role }) => {
  if (!username || !username.trim()) {
    return { success: false, error: 'Username is required.' };
  }
  if (!email || !email.trim()) {
    return { success: false, error: 'Email is required.' };
  }
  if (!password) {
    return { success: false, error: 'Password is required.' };
  }
  if (!role || !PORTAL_ROLES.includes(role)) {
    return {
      success: false,
      error: `Please select a valid role: ${PORTAL_ROLES.join(', ')}`,
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const users = getRegisteredUsers();
  const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existingUser) {
    return {
      success: false,
      error: 'An account with this email already exists. Please login instead.',
    };
  }

  const deptCode =
    role === 'CEO'
      ? 'CEO'
      : role === 'Software Engineer'
        ? 'SE'
        : role === 'HR'
          ? 'HR'
          : 'SL';

  const randomId = Math.floor(100 + Math.random() * 900);
  const newUser = {
    id: `DS-${deptCode}-2026-${randomId}`,
    username: username.trim(),
    name: username.trim(),
    email: cleanEmail,
    password, // Stored for frontend matching as requested
    role: role.trim(),
    department: role === 'CEO' ? 'Executive Leadership' : role.trim(),
    designation:
      role === 'CEO'
        ? 'CEO & Managing Director'
        : role === 'Software Engineer'
          ? 'Software Development Engineer'
          : role === 'HR'
            ? 'Human Resources Executive'
            : 'Enterprise Sales Executive',
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  } catch (err) {
    console.error('[authStorage] Failed to save user to localStorage:', err);
    return { success: false, error: 'Failed to save account locally. Storage quota may be full.' };
  }

  return { success: true, user: newUser };
};

/**
 * Authenticate credentials against registered accounts
 * Returns { success: true, user } or { success: false, error: 'Invalid email or password' }
 */
export const authenticateUser = ({ email, password }) => {
  if (!email || !email.trim() || !password) {
    return { success: false, error: 'Invalid email or password' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();

  const matchedUser = users.find((u) => {
    const emailMatches = u.email && u.email.toLowerCase() === cleanEmail;
    const usernameMatches = u.username && u.username.toLowerCase() === cleanEmail;
    return (emailMatches || usernameMatches) && u.password === password;
  });

  if (!matchedUser) {
    return { success: false, error: 'Invalid email or password' };
  }

  return { success: true, user: matchedUser };
};

/**
 * Helper to determine dashboard path based on role
 */
export const getDashboardPathForRole = (role) => {
  if (role === 'CEO') {
    return '/admin/dashboard';
  }
  return '/employee/dashboard';
};

/**
 * Check if a role is Admin/CEO
 */
export const isRoleAdmin = (role) => role === 'CEO';
