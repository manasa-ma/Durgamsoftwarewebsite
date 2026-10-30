import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser } from '../utils/authStorage';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('durgam_admin_token') || null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('durgam_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Verify session on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('durgam_admin_user');
      if (saved) {
        setAdminUser(JSON.parse(saved));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithUser = (user) => {
    if (!user) return { success: false, error: 'User is required' };
    const adminProfile = {
      id: user.id || 'DS-CEO-001',
      name: user.name || user.username || 'Venu Durgam',
      email: user.email,
      role: 'CEO',
      designation: user.designation || 'CEO & Managing Director',
    };
    const newToken = `durgam_admin_token_${Date.now()}`;
    setToken(newToken);
    setAdminUser(adminProfile);
    localStorage.setItem('durgam_admin_token', newToken);
    localStorage.setItem('durgam_admin_user', JSON.stringify(adminProfile));
    return { success: true, user: adminProfile };
  };

  const login = async (email, password) => {
    // Validate credentials using static auth storage
    const localRes = authenticateUser({ email, password });
    if (localRes.success && (localRes.user.role === 'CEO' || localRes.user.role === 'admin')) {
      return loginWithUser(localRes.user);
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const updateProfile = (updatedFields) => {
    setAdminUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('durgam_admin_user', JSON.stringify(next));
      try {
        const usersRaw = localStorage.getItem('durgam_registered_users');
        if (usersRaw) {
          const users = JSON.parse(usersRaw);
          const updated = users.map((u) => {
            if (u.email && next.email && u.email.toLowerCase() === next.email.toLowerCase()) {
              return { ...u, ...next };
            }
            return u;
          });
          localStorage.setItem('durgam_registered_users', JSON.stringify(updated));
        }
      } catch (err) {
        console.warn('[AdminAuth] Error updating registered users cache:', err);
      }
      return next;
    });
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('durgam_admin_token');
    localStorage.removeItem('durgam_admin_user');
  };

  const getAuthHeaders = () => {
    const currentToken = token || localStorage.getItem('durgam_admin_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };
  };

  const value = {
    token,
    adminUser,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    loginWithUser,
    updateProfile,
    logout,
    getAuthHeaders,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
