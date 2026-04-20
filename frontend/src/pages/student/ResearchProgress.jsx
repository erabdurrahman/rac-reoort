import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { studentAPI } from '../../services/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function ResearchProgress() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    studentAPI.getMyProfile().then(r => {
      const p = r.data.data;
      setProfile(p);
      reset({ researchTitle: p?.researchTitle, progressPercent: p?.progressPercent, thesisStatus: p?.thesisStatus });
    }).catch(() => {});
  }, [reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await studentAPI.updateProgress(data);
      toast.success('Progress updated!');
    } catch { toast.error('Failed to update'); } finally { setLoading(false); }
  };

  return (
    <DashboardLayout title="Research Progress">
      <div className="max-w-2xl">
        <Card title="Update Research Progress">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Research Title</label>
              <input {...register('researchTitle')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Progress: {profile?.progressPercent || 0}%</label>
              <input type="range" min="0" max="100" {...register('progressPercent')}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thesis Status</label>
              <select {...register('thesisStatus')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
              </select>
            </div>
            <Button type="submit" loading={loading}>Save Progress</Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
