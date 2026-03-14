import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import AdminLogin from '../pages/AdminLogin';
import UserLogin from '../pages/UserLogin';
import UserRegister from '../pages/UserRegister';
import AdminHome from '../pages/AdminHome';
import UserHome from '../pages/UserHome';
import MaintenanceHome from '../pages/MaintenanceHome';
import AddMembership from '../pages/AddMembership';
import UpdateMembership from '../pages/UpdateMembership';
import AddBook from '../pages/AddBook';
import UpdateBook from '../pages/UpdateBook';
import UserManagement from '../pages/UserManagement';
import AdminRegistrationCode from '../pages/AdminRegistrationCode';
import BookSearch from '../pages/BookSearch';
import BookIssue from '../pages/BookIssue';
import ReturnBook from '../pages/ReturnBook';
import PayFine from '../pages/PayFine';
import Reports from '../pages/Reports';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/admin-home" element={<ProtectedRoute allowRole="admin"><AdminHome /></ProtectedRoute>} />
      <Route path="/user-home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
      <Route path="/maintenance" element={<ProtectedRoute allowRole="admin"><MaintenanceHome /></ProtectedRoute>} />
      <Route path="/maintenance/add-membership" element={<ProtectedRoute allowRole="admin"><AddMembership /></ProtectedRoute>} />
      <Route path="/maintenance/update-membership" element={<ProtectedRoute allowRole="admin"><UpdateMembership /></ProtectedRoute>} />
      <Route path="/maintenance/add-book" element={<ProtectedRoute allowRole="admin"><AddBook /></ProtectedRoute>} />
      <Route path="/maintenance/update-book" element={<ProtectedRoute allowRole="admin"><UpdateBook /></ProtectedRoute>} />
      <Route path="/maintenance/users" element={<ProtectedRoute allowRole="admin"><UserManagement /></ProtectedRoute>} />
      <Route path="/maintenance/admin-code" element={<ProtectedRoute allowRole="admin"><AdminRegistrationCode /></ProtectedRoute>} />
      <Route path="/transactions/search" element={<ProtectedRoute><BookSearch /></ProtectedRoute>} />
      <Route path="/transactions/issue" element={<ProtectedRoute><BookIssue /></ProtectedRoute>} />
      <Route path="/transactions/return" element={<ProtectedRoute><ReturnBook /></ProtectedRoute>} />
      <Route path="/transactions/payfine" element={<ProtectedRoute><PayFine /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
