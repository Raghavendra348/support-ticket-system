import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import NotFound from './pages/NotFound';

function RoleRedirect() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Loading SupportDesk...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'agent' ? (
    <Navigate to="/agent/dashboard" replace />
  ) : (
    <Navigate to="/customer/dashboard" replace />
  );
}

function PublicAuthRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return user.role === 'agent' ? (
      <Navigate to="/agent/dashboard" replace />
    ) : (
      <Navigate to="/customer/dashboard" replace />
    );
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Root Role Redirect */}
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/dashboard" element={<RoleRedirect />} />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <Login />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicAuthRoute>
            <Register />
          </PublicAuthRoute>
        }
      />

      {/* Protected Role-Based Routes */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/dashboard"
        element={
          <ProtectedRoute allowedRole="agent">
            <AgentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
