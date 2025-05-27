import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  // Если требуется авторизация, но пользователь не авторизован
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Если указаны разрешенные роли и роль пользователя не входит в список
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Доступ запрещен
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            У вас нет прав для доступа к этой странице
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 