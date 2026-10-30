import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';

export const EmployeeProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useEmployeeAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/employee/login" replace state={{ from: location }} />;
  }

  return children;
};

export default EmployeeProtectedRoute;
