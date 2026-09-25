import React from 'react';

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export function StatusBadge({ status }) {
  const normalized = (status || 'open').toLowerCase();
  const label = STATUS_LABELS[normalized] || normalized;
  return <span className={`badge badge-${normalized}`}>{label}</span>;
}

export function PriorityBadge({ priority }) {
  const normalized = (priority || 'medium').toLowerCase();
  const label = PRIORITY_LABELS[normalized] || normalized;
  return <span className={`badge badge-${normalized}`}>{label}</span>;
}
