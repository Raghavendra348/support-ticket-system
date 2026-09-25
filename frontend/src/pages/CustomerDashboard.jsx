import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="card">
          <div className="card-header">
            <div>
              <h1 className="card-title">Customer Portal</h1>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                Welcome, <strong>{user?.name}</strong> ({user?.email})
              </p>
            </div>
            <span className="badge badge-customer">Customer</span>
          </div>

          <div className="alert alert-success">
            <strong>Phase 1 Status:</strong> JWT Authentication & Role-Based Authorization Verified.
          </div>

          <div className="status-grid">
            <div className="status-card">
              <h4>Account Role</h4>
              <p>Customer ({user?.role})</p>
            </div>
            <div className="status-card">
              <h4>Session State</h4>
              <p>JWT Authenticated</p>
            </div>
            <div className="status-card">
              <h4>Data Isolation</h4>
              <p>Strict Customer Separation</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderStyle: 'dashed' }}>
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <h3 style={{ color: 'var(--color-primary-navy)', marginBottom: '0.5rem' }}>
              Phase 1 Authentication & Database Foundation Ready
            </h3>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '540px', margin: '0 auto' }}>
              Customer ticket creation, ticket listing, filtering, and comment threads will be loaded in <strong>Phase 2</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
