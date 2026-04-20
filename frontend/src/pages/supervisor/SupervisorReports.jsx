import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { reportAPI } from '../../services/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function SupervisorReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const fetchReports = async () => {
    setLoading(true);
    try { const r = await reportAPI.getAll(); setReports(r.data.data || []); } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, []);

  const onReview = async (data) => {
    try {
      await reportAPI.review(reviewModal._id, data);
      toast.success('Review submitted!');
      setReviewModal(null);
      reset();
      fetchReports();
    } catch { toast.error('Failed to submit review'); }
  };

  const downloadPDF = async (id) => {
    try {
      const res = await reportAPI.getPDF(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `rac-report-${id}.pdf`; a.click();
    } catch { toast.error('Download failed'); }
  };

  return (
    <DashboardLayout title="RAC Reports Review">
      <Card title={`All Reports (${reports.length})`}>
        {loading ? <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded" />)}</div>
          : reports.length === 0 ? <p className="text-slate-400 text-center py-10">No reports found</p>
          : (
          <div className="space-y-4">
            {reports.map(r => (
              <div key={r._id} className="p-4 border border-slate-200 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{r.studentId?.name}</p>
                    <p className="text-sm text-slate-500">
                      Semester {r.semester} • {r.createdAt ? format(new Date(r.createdAt), 'MMM d, yyyy') : '—'}
                    </p>
                    {r.progressSummary && (
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{r.progressSummary}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge status={r.status} />
                    <div className="flex gap-2">
                      <button onClick={() => downloadPDF(r._id)} className="flex items-center gap-1 text-xs text-primary-600 hover:underline">
                        <ArrowDownTrayIcon className="w-3.5 h-3.5" /> PDF
                      </button>
                      {['submitted', 'under_review'].includes(r.status) && (
                        <button onClick={() => { setReviewModal(r); reset(); }}
                          className="text-xs bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 transition-colors">
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {r.remarks && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">Remarks: <span className="text-slate-700 italic">{r.remarks}</span></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Review Modal */}
      <Modal isOpen={!!reviewModal} onClose={() => setReviewModal(null)} title={`Review - ${reviewModal?.studentId?.name}`}>
        <form onSubmit={handleSubmit(onReview)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
            <textarea rows={4} {...register('remarks', { required: 'Remarks are required' })} placeholder="Add your remarks and feedback..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Recommendation</label>
              <select {...register('recommendation', { required: true })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="satisfactory">Satisfactory</option>
                <option value="needs_improvement">Needs Improvement</option>
                <option value="unsatisfactory">Unsatisfactory</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Decision</label>
              <select {...register('status', { required: true })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
                <option value="revision_requested">Request Revision</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Next Review Date</label>
            <input type="date" {...register('nextReviewDate')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setReviewModal(null)}>Cancel</Button>
            <Button type="submit">Submit Review</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
