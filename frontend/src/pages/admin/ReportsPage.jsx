import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { reportAPI } from '../../services/api';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    reportAPI.getAll({ status: statusFilter || undefined })
      .then(r => setReports(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const downloadPDF = async (id) => {
    try {
      const res = await reportAPI.getPDF(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `rac-report-${id}.pdf`;
      a.click();
    } catch { toast.error('Failed to download PDF'); }
  };

  const columns = [
    { key: 'studentId', label: 'Student', render: v => v?.name || '—' },
    { key: 'supervisorId', label: 'Supervisor', render: v => v?.name || '—' },
    { key: 'semester', label: 'Semester' },
    { key: 'createdAt', label: 'Submitted', render: v => v ? format(new Date(v), 'MMM d, yyyy') : '—' },
    { key: 'status', label: 'Status', render: v => <Badge status={v} /> },
    { key: '_id', label: 'PDF', render: id => (
      <button onClick={() => downloadPDF(id)} className="flex items-center gap-1 text-xs text-primary-600 hover:underline">
        <ArrowDownTrayIcon className="w-3.5 h-3.5" /> Download
      </button>
    )}
  ];

  return (
    <DashboardLayout title="RAC Reports">
      <Card
        title={`All Reports (${reports.length})`}
        actions={
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        }
      >
        <Table columns={columns} data={reports} loading={loading} emptyMessage="No reports found" />
      </Card>
    </DashboardLayout>
  );
}
