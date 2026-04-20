import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getMyProfile().then(r => setProfile(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-2xl">
        <Card title="Profile Information">
          {loading ? <div className="animate-pulse space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-slate-100 rounded" />)}</div> : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-500 uppercase">Full Name</p><p className="font-medium text-slate-900">{user?.name}</p></div>
                <div><p className="text-xs text-slate-500 uppercase">Email</p><p className="font-medium text-slate-900">{user?.email}</p></div>
                <div><p className="text-xs text-slate-500 uppercase">Scholar ID</p><p className="font-medium text-slate-900">{profile?.scholarId || '—'}</p></div>
                <div><p className="text-xs text-slate-500 uppercase">Registration No.</p><p className="font-medium text-slate-900">{profile?.registrationNo || '—'}</p></div>
                <div><p className="text-xs text-slate-500 uppercase">Department</p><p className="font-medium text-slate-900">{profile?.department?.name || '—'}</p></div>
                <div><p className="text-xs text-slate-500 uppercase">Supervisor</p><p className="font-medium text-slate-900">{profile?.supervisorId?.name || '—'}</p></div>
                <div><p className="text-xs text-slate-500 uppercase">Semester</p><p className="font-medium text-slate-900">{profile?.semester || '—'}</p></div>
                <div><p className="text-xs text-slate-500 uppercase">Progress</p><p className="font-medium text-slate-900">{profile?.progressPercent || 0}%</p></div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase mb-1">Research Title</p>
                <p className="font-medium text-slate-900">{profile?.researchTitle || 'Not specified'}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
