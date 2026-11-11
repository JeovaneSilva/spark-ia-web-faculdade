import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ConnectionError } from './ConnectionError';
import { useAuth } from './useAuth';

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, connectionError, retry, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (connectionError) {
    return <ConnectionError message={connectionError} onRetry={retry} onLogout={logout} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
