import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Navbar from '../components/Navbar';
import { StatusBadge, PriorityBadge } from '../components/TicketBadge';
import TicketDetailModal from '../components/TicketDetailModal';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
    unassigned: 0,
  });
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter controls
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('-created_at');

  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTicketsAndStats() {
      try {
        setLoading(true);
        setError('');

        let query = `?ordering=${sortOrder}`;
        if (statusFilter !== 'all') query += `&status=${statusFilter}`;
        if (priorityFilter !== 'all') query += `&priority=${priorityFilter}`;
        if (assignedFilter !== 'all') query += `&assigned_to=${assignedFilter}`;
        if (searchTerm.trim()) query += `&search=${encodeURIComponent(searchTerm.trim())}`;

        const [ticketData, statsData] = await Promise.all([
          api.get(`/tickets${query}`),
          api.get('/tickets/stats'),
        ]);

        if (isMounted) {
          setTickets(ticketData);
          setStats(statsData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.data?.message || err.message || 'Failed to load tickets queue.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTicketsAndStats();

    return () => {
      isMounted = false;
    };
  }, [sortOrder, statusFilter, priorityFilter, assignedFilter, searchTerm]);

  // Load agents for filter dropdown
  useEffect(() => {
    let isMounted = true;
    async function loadAgents() {
      try {
        const agentList = await api.get('/users?role=agent');
        if (isMounted) {
          setAgents(agentList);
        }
      } catch (err) {
        console.error('Failed to load agents for filter:', err);
      }
    }
    loadAgents();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTicketUpdated = (updatedTicket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? { ...t, ...updatedTicket } : t))
    );
    api.get('/tickets/stats').then((res) => setStats(res)).catch(() => {});
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {/* Page Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary-navy)', fontWeight: 700 }}>
              Support Agent Workspace
            </h1>
            <span className="badge badge-agent">Support Agent</span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Agent: <strong>{user?.name}</strong> ({user?.email}) — Manage customer tickets, update resolutions, and assign inquiries.
          </p>
        </div>

        {/* Live KPI Statistics Grid */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Total Tickets</span>
            <span className="kpi-value">{stats.total}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Open Tickets</span>
            <span className="kpi-value" style={{ color: 'var(--color-primary-blue)' }}>{stats.open}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">In Progress</span>
            <span className="kpi-value" style={{ color: '#D97706' }}>{stats.in_progress}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Urgent Issues</span>
            <span className="kpi-value" style={{ color: '#DC2626' }}>{stats.urgent}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Unassigned</span>
            <span className="kpi-value" style={{ color: '#6B7280' }}>{stats.unassigned}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Resolved / Closed</span>
            <span className="kpi-value" style={{ color: '#16A34A' }}>{stats.resolved + stats.closed}</span>
          </div>
        </div>

        {/* Search, Filters, and Sorting Toolbar */}
        <div className="toolbar-container">
          <div className="toolbar-filters">
            <input
              type="text"
              id="agent-search-input"
              className="search-input"
              placeholder="Search by subject, customer name, email, or issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              id="agent-status-filter"
              className="select-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              id="agent-priority-filter"
              className="select-control"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              id="agent-assignment-filter"
              className="select-control"
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
            >
              <option value="all">All Assignments</option>
              <option value="unassigned">Unassigned Only</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  Assigned: {ag.name}
                </option>
              ))}
            </select>

            <select
              id="agent-sort-order"
              className="select-control"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="-updated_at">Recently Updated</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || assignedFilter !== 'all') && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setAssignedFilter('all');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Tickets Queue Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)' }}>
            Loading all support tickets...
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">No Tickets in Queue</h3>
            <p className="empty-state-desc">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || assignedFilter !== 'all'
                ? 'No support tickets match the selected filters.'
                : 'All customer support tickets have been resolved! Great work.'}
            </p>
          </div>
        ) : (
          <div className="ticket-table-wrapper">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>ID</th>
                  <th>Subject</th>
                  <th>Customer</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Agent</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} onClick={() => setSelectedTicketId(t.id)}>
                    <td style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>#{t.id}</td>
                    <td className="ticket-subject-cell">
                      <span>{t.subject}</span>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                        {t.comments_count || 0} responses
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.85rem' }}>{t.user?.name}</strong>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {t.user?.email}
                      </span>
                    </td>
                    <td>
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td>
                      {t.assigned_to ? (
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-navy)' }}>
                          {t.assigned_to.name}
                        </span>
                      ) : (
                        <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="ticket-date-cell">{formatDate(t.created_at)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicketId(t.id);
                        }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Ticket Detail & Management Modal */}
        <TicketDetailModal
          ticketId={selectedTicketId}
          isOpen={!!selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          onTicketUpdated={handleTicketUpdated}
        />
      </main>
    </div>
  );
}
