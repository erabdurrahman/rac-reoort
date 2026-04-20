import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentArrowDownIcon, EyeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { reportService } from '../../services/report.service';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Select, Textarea } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { PageLoader } from '../../components/ui/Spinner';
import PDFPreview from '../../components/pdf/PDFPreview';
import { format } from 'date-fns';

export default function ViewReports() {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { fetchData(); }, [filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await reportService.getAll({ status: filterStatus || undefined, limit: 50 });
      setReports(data.data.reports);
      setTotal(data.data.total);
    } catch { toast.error('Failed to load reports'); }
    finally { setLoading(false); }
  };

  const handleGeneratePDF = async (id) => {
    setGeneratingPdf(id);
    try {
      const { data } = await reportService.generatePDF(id);
      toast.success('PDF generated successfully');
      fetchData();
      if (viewModal && viewModal._id === id) setViewModal({ ...viewModal, pdfUrl: data.data.pdfUrl });
    } catch { toast.error('PDF generation failed'); }
    finally { setGeneratingPdf(null); }
  };

  const onReview = async (data) => {
    setSaving(true);
    try {
      await reportService.approve(reviewModal._id, data);
      toast.success('Report status updated');
      setReviewModal(null);
      fetchData();
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const openReview = (r) => {
    setReviewModal(r);
    reset({ status: r.status, recommendation: r.recommendation, remarks: r.remarks, overallGrade: r.overallGrade });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">View Reports</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total RAC reports</p>
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-44">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? <PageLoader /> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Student', 'Semester', 'Meeting Date', 'Supervisor', 'Status', 'Recommendation', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => (
                <motion.tr key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{r.studentId?.userId?.name}</p>
                    <p className="text-xs text-slate-500">{r.studentId?.department?.name}</p>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-700">{r.semester}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{format(new Date(r.meetingDate), 'MMM d, yyyy')}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{r.supervisorId?.userId?.name || 'N/A'}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={r.recommendation || 'pending'} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewModal(r)} title="View"
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleGeneratePDF(r._id)} disabled={generatingPdf === r._id} title="Generate PDF"
                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <DocumentArrowDownIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => openReview(r)} title="Review"
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                        <CheckCircleIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {reports.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-slate-500">No reports found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {viewModal && (
        <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Report Details" size="xl"
          footer={
            <div className="flex justify-between">
              <Button onClick={() => handleGeneratePDF(viewModal._id)} loading={generatingPdf === viewModal._id} variant="secondary" icon={DocumentArrowDownIcon}>
                Generate PDF
              </Button>
              <Button onClick={() => setViewModal(null)} variant="secondary">Close</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">Student:</span> <strong>{viewModal.studentId?.userId?.name}</strong></div>
              <div><span className="text-slate-500">Scholar ID:</span> <strong>{viewModal.studentId?.scholarId}</strong></div>
              <div><span className="text-slate-500">Department:</span> <strong>{viewModal.studentId?.department?.name}</strong></div>
              <div><span className="text-slate-500">Semester:</span> <strong>{viewModal.semester}</strong></div>
              <div><span className="text-slate-500">Supervisor:</span> <strong>{viewModal.supervisorId?.userId?.name}</strong></div>
              <div><span className="text-slate-500">Meeting Date:</span> <strong>{format(new Date(viewModal.meetingDate), 'MMM d, yyyy')}</strong></div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-600 mb-1">PROGRESS SUMMARY</p>
              <p className="text-sm text-slate-700">{viewModal.progressSummary}</p>
            </div>
            {viewModal.courseworkStatus && <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-600 mb-1">COURSEWORK STATUS</p>
              <p className="text-sm text-slate-700">{viewModal.courseworkStatus}</p>
            </div>}
            {viewModal.remarks && <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-700 mb-1">REMARKS</p>
              <p className="text-sm text-amber-800">{viewModal.remarks}</p>
            </div>}
            <PDFPreview pdfUrl={viewModal.pdfUrl} />
          </div>
        </Modal>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <Modal isOpen={!!reviewModal} onClose={() => setReviewModal(null)} title="Review Report"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setReviewModal(null)}>Cancel</Button>
              <Button onClick={handleSubmit(onReview)} loading={saving}>Update Status</Button>
            </div>
          }
        >
          <form className="space-y-4">
            <Select label="Status" {...register('status')}>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
            <Select label="Recommendation" {...register('recommendation')}>
              <option value="pending">Pending</option>
              <option value="continue">Continue</option>
              <option value="probation">Probation</option>
              <option value="extend">Extend</option>
              <option value="terminate">Terminate</option>
            </Select>
            <Select label="Overall Grade" {...register('overallGrade')}>
              <option value="">Select Grade</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Satisfactory">Satisfactory</option>
              <option value="Unsatisfactory">Unsatisfactory</option>
            </Select>
            <Textarea label="Remarks" rows={3} {...register('remarks')} placeholder="Committee remarks..." />
          </form>
        </Modal>
      )}
    </div>
  );
}
