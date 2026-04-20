import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DocumentTextIcon, CalendarIcon, ClockIcon, DocumentPlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { studentService } from '../../services/student.service';
import { reportService } from '../../services/report.service';
import { meetingService } from '../../services/student.service';
import { StatusBadge } from '../../components/ui/Badge';
import { PageLoader } from '../../components/ui/Spinner';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, reportsRes, meetingsRes] = await Promise.all([
          studentService.getByUserId(user._id),
          reportService.getAll({ limit: 5 }),
          meetingService.getUpcoming(),
        ]);
        setProfile(profileRes.data.data.student);
        setReports(reportsRes.data.data.reports);
        setUpcomingMeetings(meetingsRes.data.data.meetings);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, [user._id]);

  if (loading) return <PageLoader />;

  const quickLinks = [
    { label: 'Submit Report', path: '/student/submit-report', icon: DocumentPlusIcon, color: 'bg-primary-600 text-white hover:bg-primary-700' },
    { label: 'My Reports', path: '/student/reports', icon: DocumentTextIcon, color: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' },
    { label: 'My Profile', path: '/student/profile', icon: CheckCircleIcon, color: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <p className="text-primary-200 text-sm mb-1">Welcome back,</p>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        {profile && (
          <p className="text-primary-200 mt-1 text-sm">
            {profile.department?.name} &bull; Scholar ID: {profile.scholarId} &bull; Semester {profile.semester}
          </p>
        )}
        {profile && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-primary-200">Research Progress</span>
              <span className="font-semibold">{profile.progressPercent}%</span>
            </div>
            <div className="bg-primary-500/50 rounded-full h-2">
              <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${profile.progressPercent}%` }} />
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap">
        {quickLinks.map((l) => (
          <Link key={l.label} to={l.path}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${l.color}`}>
            <l.icon className="w-4 h-4" />
            {l.label}
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Semester', value: profile?.semester || '-', color: 'text-primary-600 bg-primary-50' },
          { label: 'Progress', value: `${profile?.progressPercent || 0}%`, color: 'text-green-600 bg-green-50' },
          { label: 'Reports', value: reports.length, color: 'text-amber-600 bg-amber-50' },
          { label: 'Meetings', value: upcomingMeetings.length, color: 'text-purple-600 bg-purple-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent Reports</h2>
            <Link to="/student/reports" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No reports yet</p>
              <Link to="/student/submit-report" className="text-xs text-primary-600 hover:underline mt-1 block">Submit your first report</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((r) => (
                <div key={r._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Semester {r.semester} Report</p>
                    <p className="text-xs text-slate-500">{format(new Date(r.meetingDate), 'MMM d, yyyy')}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Upcoming Meetings</h2>
          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No upcoming meetings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.map((m) => (
                <div key={m._id} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50">
                  <div className="text-center bg-white rounded-xl p-2 min-w-12">
                    <p className="text-xs text-blue-600 font-medium">{format(new Date(m.scheduledDate), 'MMM')}</p>
                    <p className="text-lg font-bold text-blue-700">{format(new Date(m.scheduledDate), 'd')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{m.title}</p>
                    <p className="text-xs text-slate-600">{format(new Date(m.scheduledDate), 'h:mm a')} &bull; {m.venue || m.mode}</p>
                    {m.agenda && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{m.agenda}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Research info */}
      {profile && profile.researchTitle && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-3">Research Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Research Title:</span><p className="font-medium text-slate-900 mt-0.5">{profile.researchTitle}</p></div>
            <div><span className="text-slate-500">Supervisor:</span><p className="font-medium text-slate-900 mt-0.5">{profile.supervisorId?.userId?.name || 'Not assigned'}</p></div>
            <div><span className="text-slate-500">Joining Date:</span><p className="font-medium text-slate-900 mt-0.5">{profile.joiningDate ? format(new Date(profile.joiningDate), 'MMMM d, yyyy') : 'N/A'}</p></div>
            <div><span className="text-slate-500">Department:</span><p className="font-medium text-slate-900 mt-0.5">{profile.department?.name}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
