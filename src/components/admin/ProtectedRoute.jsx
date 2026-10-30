import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#071525] text-white">
        <div className="w-10 h-10 border-3 border-orange-500/20 border-t-[#F97316] rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
