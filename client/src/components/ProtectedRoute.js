import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowRole }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/user-login" replace />;
  }

  if (allowRole && role !== allowRole) {
    return <Navigate to={role === 'admin' ? '/admin-home' : '/user-home'} replace />;
  }

  return children;
}
