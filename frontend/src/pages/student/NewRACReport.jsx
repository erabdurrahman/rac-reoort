import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { reportAPI } from '../../services/api';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function NewRACReport() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await reportAPI.create({ ...data, status: 'submitted' });
      setSubmitted(true);
      toast.success('RAC Report submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <DashboardLayout title="New RAC Report">
        <div className="max-w-lg mx-auto text-center py-16">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Submitted!</h2>
          <p className="text-slate-500 mb-6">Your RAC report has been submitted for review.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => navigate('/student/reports')}>View All Reports</Button>
            <Button onClick={() => { setSubmitted(false); }}>Submit Another</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="New RAC Report">
      <div className="max-w-3xl">
        <Card title="RAC Progress Report Form">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Semester */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Semester *</label>
                <input type="number" min="1" max="12" {...register('semester', { required: 'Semester is required' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                {errors.semester && <p className="text-xs text-red-500 mt-1">{errors.semester.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Date</label>
                <input type="date" {...register('meetingDate')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            {/* Progress Summary */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Progress Summary *</label>
              <textarea rows={4} {...register('progressSummary', { required: 'Progress summary is required' })}
                placeholder="Describe your research progress in this period..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              {errors.progressSummary && <p className="text-xs text-red-500 mt-1">{errors.progressSummary.message}</p>}
            </div>

            {/* Work Completed */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Completed</label>
              <textarea rows={3} {...register('workCompleted')} placeholder="Describe work completed in detail..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            {/* Coursework & Publication Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Coursework Status</label>
                <textarea rows={2} {...register('courseworkStatus')} placeholder="Status of required courses..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Publication Status</label>
                <textarea rows={2} {...register('publicationStatus')} placeholder="Papers published / submitted..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            {/* Next Plan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Next Plan of Work</label>
              <textarea rows={3} {...register('nextPlanOfWork')} placeholder="What you plan to achieve in the next semester..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => navigate('/student/reports')}>Cancel</Button>
              <Button type="submit" loading={loading}>Submit RAC Report</Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
