import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { studentService } from '../../services/student.service';
import { PageLoader } from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/Badge';
import { format } from 'date-fns';

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getByUserId(user._id)
      .then(r => setProfile(r.data.data.student))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user._id]);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Your PhD scholar profile</p>
      </div>

      {/* Avatar + basic */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
          <span className="text-3xl font-bold text-primary-700">{user.name?.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
          <p className="text-slate-500">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <StatusBadge status={profile?.status || 'active'} />
            <span className="badge-info">PhD Scholar</span>
          </div>
        </div>
      </div>

      {profile && (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Academic Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Scholar ID', value: profile.scholarId },
                { label: 'Registration No', value: profile.registrationNo },
                { label: 'Department', value: profile.department?.name },
                { label: 'Semester', value: profile.semester },
                { label: 'Joining Date', value: profile.joiningDate ? format(new Date(profile.joiningDate), 'MMMM d, yyyy') : 'N/A' },
                { label: 'Progress', value: `${profile.progressPercent}%` },
                { label: 'Coursework', value: profile.courseworkCompleted ? 'Completed' : 'In Progress' },
                { label: 'Phone', value: profile.phone || 'N/A' },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-slate-500 text-xs">{f.label}</p>
                  <p className="font-medium text-slate-900">{f.value || 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Research Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Research Title</p>
                <p className="font-medium text-slate-900">{profile.researchTitle || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Supervisor</p>
                <p className="font-medium text-slate-900">{profile.supervisorId?.userId?.name || 'Not assigned'}</p>
                {profile.supervisorId?.designation && <p className="text-xs text-slate-500">{profile.supervisorId.designation}</p>}
              </div>
              {profile.publications?.length > 0 && (
                <div>
                  <p className="text-slate-500 text-xs mb-2">Publications</p>
                  {profile.publications.map((p, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3 mb-2">
                      <p className="font-medium text-slate-800 text-xs">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.journal} • {p.year} • {p.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Research Progress</h3>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Overall Completion</span>
              <span className="font-semibold text-primary-600">{profile.progressPercent}%</span>
            </div>
            <div className="bg-slate-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all"
                style={{ width: `${profile.progressPercent}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Keep up the good work! You are {100 - profile.progressPercent}% away from completion.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
