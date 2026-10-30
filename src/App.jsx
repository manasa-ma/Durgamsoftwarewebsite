import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { EmployeeAuthProvider } from './context/EmployeeAuthContext';

// Ensure all legacy remembered logins across Admin and Employee portals are purged
try {
  const PURGE_FLAG = 'durgam_login_clean_slate_20261030_v4';
  if (!localStorage.getItem(PURGE_FLAG)) {
    localStorage.removeItem('durgam_admin_user');
    localStorage.removeItem('durgam_admin_token');
    localStorage.removeItem('durgam_employee_user');
    localStorage.removeItem('durgam_employee_token');
    localStorage.removeItem('durgam_remember_admin');
    localStorage.removeItem('durgam_remember_employee');
    localStorage.removeItem('durgam_saved_email');
    localStorage.setItem(PURGE_FLAG, 'true');
  }
} catch {
  // silent
}

export const App = () => {
  return (
    <AdminAuthProvider>
      <EmployeeAuthProvider>
        <RouterProvider router={router} />
      </EmployeeAuthProvider>
    </AdminAuthProvider>
  );
};

export default App;
