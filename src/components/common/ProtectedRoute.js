// components/common/ProtectedRoute.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="unauthorized">
        <h3>Access Denied</h3>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  if (adminOnly && currentUser.role !== 'superadmin') {
    return (
      <div className="unauthorized">
        <h3>Access Denied</h3>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;