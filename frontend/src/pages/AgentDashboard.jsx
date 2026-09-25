import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function AgentDashboard() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="card">
          <div className="card-header">
            <div>
              <h1 className="card-title">Support Agent Portal</h1>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                Welcome, Agent <strong>{user?.name}</strong> ({user?.email})
              </p>
            </div>
            <span className="badge badge-agent">Support Agent</span>
          </div>

          <div className="alert alert-success">
            <strong>Phase 1 Status:</strong> Support Agent Authorization & JWT Security Verified.
          </div>

          <div className="status-grid">
            <div className="status-card">
              <h4>Role Privilege</h4>
              <p>Support Agent ({user?.role})</p>
            </div>
            <div className="status-card">
              <h4>Authorization</h4>
              <p>Backend Role Enforced</p>
            </div>
            <div className="status-card">
              <h4>Agent APIs</h4>
              <p>Active & Protected</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderStyle: 'dashed' }}>
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <h3 style={{ color: 'var(--color-primary-navy)', marginBottom: '0.5rem' }}>
              Phase 1 Agent Foundation Ready
            </h3>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '540px', margin: '0 auto' }}>
              Ticket queue management, status updates, agent assignment, and customer response threads will be loaded in <strong>Phase 2</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
