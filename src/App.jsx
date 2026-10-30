import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { EmployeeAuthProvider } from './context/EmployeeAuthContext';

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
