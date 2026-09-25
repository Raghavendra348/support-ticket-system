import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from './TicketBadge';

export default function TicketDetailModal({ ticketId, isOpen, onClose, onTicketUpdated }) {
  const { isAgent } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingTicket, setUpdatingTicket] = useState(false);
  const [error, setError] = useState('');

  // Load ticket details and agent list
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!ticketId || !isOpen) return;
      try {
        setLoading(true);
        setError('');
        const data = await api.get(`/tickets/${ticketId}`);
        if (isMounted) {
          setTicket(data);
          setComments(data.comments || []);
        }

        if (isAgent) {
          const agentList = await api.get('/users?role=agent');
          if (isMounted) {
            setAgents(agentList);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.data?.error || err.message || 'Failed to load ticket details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, ticketId, isAgent]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdatingTicket(true);
      const updated = await api.put(`/tickets/${ticketId}`, { status: newStatus });
      setTicket((prev) => ({ ...prev, ...updated }));
      if (onTicketUpdated) onTicketUpdated(updated);
    } catch (err) {
      alert(err.data?.error || 'Failed to update status.');
    } finally {
      setUpdatingTicket(false);
    }
  };

  const handleUpdatePriority = async (newPriority) => {
    try {
      setUpdatingTicket(true);
      const updated = await api.put(`/tickets/${ticketId}`, { priority: newPriority });
      setTicket((prev) => ({ ...prev, ...updated }));
      if (onTicketUpdated) onTicketUpdated(updated);
    } catch (err) {
      alert(err.data?.error || 'Failed to update priority.');
    } finally {
      setUpdatingTicket(false);
    }
  };

  const handleAssignAgent = async (agentId) => {
    try {
      setUpdatingTicket(true);
      const payload = { assigned_to_id: agentId ? parseInt(agentId) : null };
      const updated = await api.put(`/tickets/${ticketId}`, payload);
      setTicket((prev) => ({ ...prev, ...updated }));
      if (onTicketUpdated) onTicketUpdated(updated);
    } catch (err) {
      alert(err.data?.error || 'Failed to assign agent.');
    } finally {
      setUpdatingTicket(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const addedComment = await api.post(`/tickets/${ticketId}/comments`, {
        comment: newComment.trim(),
      });
      setComments((prev) => [...prev, addedComment]);
      setNewComment('');
    } catch (err) {
      alert(err.data?.errors?.comment?.[0] || 'Failed to post reply.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '780px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              TICKET #{ticket?.id}
            </span>
            <h2 className="modal-title">{ticket?.subject || 'Loading Ticket...'}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
              Loading ticket conversation...
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : ticket ? (
            <>
              {/* Metadata Bar */}
              <div className="ticket-detail-meta">
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Status</span>
                  <StatusBadge status={ticket.status} />
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Priority</span>
                  <PriorityBadge priority={ticket.priority} />
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Customer</span>
                  <strong style={{ fontSize: '0.9rem' }}>{ticket.user?.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
                    {ticket.user?.email}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Assigned Agent</span>
                  <strong style={{ fontSize: '0.9rem' }}>
                    {ticket.assigned_to ? ticket.assigned_to.name : 'Unassigned'}
                  </strong>
                </div>

                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Created</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    {formatDate(ticket.created_at)}
                  </span>
                </div>
              </div>

              {/* Agent Quick Controls */}
              {isAgent && (
                <div className="agent-controls-box">
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-navy)' }}>
                    Support Agent Actions
                  </strong>
                  <div className="agent-controls-grid">
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Update Status</label>
                      <select
                        className="select-control"
                        style={{ width: '100%' }}
                        value={ticket.status}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        disabled={updatingTicket}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Update Priority</label>
                      <select
                        className="select-control"
                        style={{ width: '100%' }}
                        value={ticket.priority}
                        onChange={(e) => handleUpdatePriority(e.target.value)}
                        disabled={updatingTicket}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Assign Agent</label>
                      <select
                        className="select-control"
                        style={{ width: '100%' }}
                        value={ticket.assigned_to?.id || ''}
                        onChange={(e) => handleAssignAgent(e.target.value)}
                        disabled={updatingTicket}
                      >
                        <option value="">-- Unassigned --</option>
                        {agents.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.name} ({ag.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Original Issue Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Original Issue Description
                </strong>
                <div className="detail-desc-box" style={{ marginTop: '0.4rem' }}>
                  {ticket.description}
                </div>
              </div>

              {/* Comment / Response Thread */}
              <div className="comment-thread">
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Responses & Comments ({comments.length})
                </strong>

                <div className="comment-list" style={{ marginTop: '0.6rem' }}>
                  {comments.length === 0 ? (
                    <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      No comments yet. Write a response below to start the conversation.
                    </div>
                  ) : (
                    comments.map((comm) => {
                      const isSenderAgent = comm.user?.role === 'agent';
                      return (
                        <div
                          key={comm.id}
                          className={`comment-bubble ${isSenderAgent ? 'agent-comment' : ''}`}
                        >
                          <div className="comment-bubble-header">
                            <div className="comment-author">
                              <span>{comm.user?.name}</span>
                              <span className={`badge ${isSenderAgent ? 'badge-agent' : 'badge-customer'}`}>
                                {isSenderAgent ? 'Support Agent' : 'Customer'}
                              </span>
                            </div>
                            <span className="comment-time">{formatDate(comm.created_at)}</span>
                          </div>
                          <div className="comment-text">{comm.comment}</div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Post Reply Form */}
                <form onSubmit={handleAddComment} style={{ marginTop: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                    <label className="form-label" htmlFor="reply-input">
                      {isAgent ? 'Post Support Agent Response' : 'Reply to Support'}
                    </label>
                    <textarea
                      id="reply-input"
                      className="form-control"
                      rows="3"
                      placeholder={isAgent ? 'Write a response to the customer...' : 'Add information or follow-up question...'}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={submittingComment}
                    />
                  </div>
                  <button
                    type="submit"
                    id="post-reply-btn"
                    className="btn btn-primary btn-sm"
                    disabled={submittingComment || !newComment.trim()}
                  >
                    {submittingComment ? 'Posting...' : 'Post Response'}
                  </button>
                </form>
              </div>
            </>
          ) : null}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
