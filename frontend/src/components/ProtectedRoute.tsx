import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  allowedRoles?: Array<'ADMIN' | 'OWNER' | 'TENANT'>;
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { token, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === 'ADMIN' || role === 'OWNER' ? '/admin/dashboard' : '/tenant/dashboard'}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
