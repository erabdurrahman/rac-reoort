import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { reportAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowDownTrayIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function RACReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    reportAPI.getMyReports().then(r => setReports(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const downloadPDF = async (id) => {
    try {
      const res = await reportAPI.getPDF(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `rac-report-${id}.pdf`; a.click();
    } catch { toast.error('Download failed'); }
  };

  return (
    <DashboardLayout title="My RAC Reports">
      <Card
        title={`Reports (${reports.length})`}
        actions={<Button onClick={() => navigate('/student/reports/new')}><PlusIcon className="w-4 h-4" /> New Report</Button>}
      >
        {loading ? <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded" />)}</div>
          : reports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">No RAC reports submitted yet.</p>
              <Button onClick={() => navigate('/student/reports/new')}>Submit Your First Report</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map(r => (
                <div key={r._id} className="p-4 border border-slate-200 rounded-xl hover:border-primary-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Semester {r.semester} RAC Report</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Supervisor: {r.supervisorId?.name || '—'} •
                        Submitted: {r.createdAt ? format(new Date(r.createdAt), 'MMM d, yyyy') : '—'}
                      </p>
                      {r.remarks && <p className="text-sm text-slate-600 mt-2 italic">"{r.remarks}"</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge status={r.status} />
                      <button onClick={() => downloadPDF(r._id)} className="flex items-center gap-1 text-xs text-primary-600 hover:underline">
                        <ArrowDownTrayIcon className="w-3.5 h-3.5" /> PDF
                      </button>
                    </div>
                  </div>
                  {r.recommendation && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <Badge status={r.recommendation} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </Card>
    </DashboardLayout>
  );
}
