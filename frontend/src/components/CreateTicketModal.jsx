import React, { useState } from 'react';
import { api } from '../api/client';

export default function CreateTicketModal({ isOpen, onClose, onTicketCreated }) {
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!subject.trim()) {
      errs.subject = 'Subject is required.';
    } else if (subject.trim().length < 4) {
      errs.subject = 'Subject must be at least 4 characters long.';
    }

    if (!description.trim()) {
      errs.description = 'Description is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const data = await api.post('/tickets', {
        subject: subject.trim(),
        priority,
        description: description.trim(),
      });

      // Reset form
      setSubject('');
      setPriority('medium');
      setDescription('');
      setErrors({});

      onTicketCreated(data);
      onClose();
    } catch (err) {
      const msg = err.data?.message || err.message || 'Failed to create support ticket.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Support Ticket</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && (
              <div className="alert alert-danger">
                <span>{serverError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="ticket-subject">Subject</label>
              <input
                id="ticket-subject"
                type="text"
                className="form-control"
                placeholder="Brief summary of the issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.subject && <div className="form-error">{errors.subject}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ticket-priority">Priority</label>
              <select
                id="ticket-priority"
                className="select-control"
                style={{ width: '100%' }}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="low">Low — General inquiry</option>
                <option value="medium">Medium — Standard issue</option>
                <option value="high">High — Urgent feature impacted</option>
                <option value="urgent">Urgent — Critical blocker</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ticket-description">Description</label>
              <textarea
                id="ticket-description"
                className="form-control"
                rows="5"
                placeholder="Please describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="create-ticket-submit-btn"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
