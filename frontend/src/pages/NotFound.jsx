import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user, isAgent } = useAuth();
  const homeTarget = user ? (isAgent ? '/agent/dashboard' : '/customer/dashboard') : '/login';

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--color-primary-navy)', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          The page you are looking for does not exist or you do not have permission to view it.
        </p>
        <Link to={homeTarget} className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
