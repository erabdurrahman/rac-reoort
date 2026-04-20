import React from 'react';

const variants = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  error: 'badge-danger',
  info: 'badge-info',
  default: 'badge-gray',
  blue: 'badge-info',
  green: 'badge-success',
  yellow: 'badge-warning',
  red: 'badge-danger',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

export const StatusBadge = ({ status }) => {
  const map = {
    approved: { label: 'Approved', variant: 'success' },
    pending: { label: 'Pending', variant: 'warning' },
    under_review: { label: 'Under Review', variant: 'info' },
    rejected: { label: 'Rejected', variant: 'danger' },
    draft: { label: 'Draft', variant: 'default' },
    active: { label: 'Active', variant: 'success' },
    inactive: { label: 'Inactive', variant: 'default' },
    scheduled: { label: 'Scheduled', variant: 'info' },
    completed: { label: 'Completed', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
    continue: { label: 'Continue', variant: 'success' },
    probation: { label: 'Probation', variant: 'warning' },
    terminate: { label: 'Terminate', variant: 'danger' },
    extend: { label: 'Extend', variant: 'info' },
  };
  const config = map[status] || { label: status, variant: 'default' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
