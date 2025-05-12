import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode | ((role: string) => React.ReactNode);
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    // Rediriger vers le dashboard approprié selon le rôle
    if (user?.role) {
      switch (user.role) {
        case 'ADMIN':
          return <Navigate to="/dashboard" replace />;
        case 'GESTIONNAIRE':
          return <Navigate to="/dashboard" replace />;
        case 'TECHNICIEN':
          return <Navigate to="/dashboard" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
    return <Navigate to="/login" replace />;
  }

  if (typeof children === 'function') {
    return <>{children(user?.role || '')}</>;
  }

  return <>{children}</>;
};

export default PrivateRoute; 