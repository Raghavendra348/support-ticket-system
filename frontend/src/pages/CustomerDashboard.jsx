import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Navbar from '../components/Navbar';
import { StatusBadge, PriorityBadge } from '../components/TicketBadge';
import CreateTicketModal from '../components/CreateTicketModal';
import TicketDetailModal from '../components/TicketDetailModal';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('-created_at');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTickets() {
      try {
        setLoading(true);
        setError('');

        let query = `?ordering=${sortOrder}`;
        if (statusFilter !== 'all') query += `&status=${statusFilter}`;
        if (priorityFilter !== 'all') query += `&priority=${priorityFilter}`;
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
          setError(err.data?.message || err.message || 'Failed to load support tickets.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTickets();

    return () => {
      isMounted = false;
    };
  }, [sortOrder, statusFilter, priorityFilter, searchTerm]);

  const handleTicketCreated = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    setStats((prev) => ({
      ...prev,
      total: prev.total + 1,
      open: prev.open + 1,
    }));
    setSelectedTicketId(newTicket.id);
  };

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
      year: 'numeric',
    });
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {/* Header Title & Create Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary-navy)', fontWeight: 700 }}>
              Customer Support Portal
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Welcome back, <strong>{user?.name}</strong>. Manage your support inquiries and track responses.
            </p>
          </div>

          <button
            id="create-ticket-btn"
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Create New Ticket
          </button>
        </div>

        {/* Quick KPI Stats Summary */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">My Total Tickets</span>
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
            <span className="kpi-label">Resolved / Closed</span>
            <span className="kpi-value" style={{ color: '#16A34A' }}>{stats.resolved + stats.closed}</span>
          </div>
        </div>

        {/* Search and Filters Toolbar */}
        <div className="toolbar-container">
          <div className="toolbar-filters">
            <input
              type="text"
              id="ticket-search-input"
              className="search-input"
              placeholder="Search by subject or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              id="status-filter-select"
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
              id="priority-filter-select"
              className="select-control"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              id="sort-order-select"
              className="select-control"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="-updated_at">Recently Updated</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Tickets List / Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)' }}>
            Loading your support tickets...
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">No Support Tickets Found</h3>
            <p className="empty-state-desc">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No tickets match your search filters. Try clearing or adjusting your filter criteria.'
                : "You haven't created any support tickets yet. Click the button below to submit your first issue."}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Create New Ticket
            </button>
          </div>
        ) : (
          <div className="ticket-table-wrapper">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Responses</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} onClick={() => setSelectedTicketId(t.id)}>
                    <td style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>#{t.id}</td>
                    <td className="ticket-subject-cell">{t.subject}</td>
                    <td>
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td>
                      {t.assigned_to ? (
                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{t.assigned_to.name}</span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)' }}>
                        {t.comments_count || 0} {t.comments_count === 1 ? 'comment' : 'comments'}
                      </span>
                    </td>
                    <td className="ticket-date-cell">{formatDate(t.created_at)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicketId(t.id);
                        }}
                      >
                        View & Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create Ticket Modal */}
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTicketCreated={handleTicketCreated}
        />

        {/* Ticket Detail & Conversation Modal */}
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
