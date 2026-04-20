import React from 'react';

const statusConfig = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
  submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-700' },
  under_review: { label: 'Under Review', className: 'bg-purple-100 text-purple-700' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  revision_requested: { label: 'Revision Needed', className: 'bg-orange-100 text-orange-700' },
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  inactive: { label: 'Inactive', className: 'bg-red-100 text-red-700' },
  scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
  satisfactory: { label: 'Satisfactory', className: 'bg-green-100 text-green-700' },
  needs_improvement: { label: 'Needs Improvement', className: 'bg-yellow-100 text-yellow-700' },
  unsatisfactory: { label: 'Unsatisfactory', className: 'bg-red-100 text-red-700' }
};

export default function Badge({ status, label, className = '' }) {
  const config = statusConfig[status] || { label: status || label, className: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}>
      {label || config.label}
    </span>
  );
}
