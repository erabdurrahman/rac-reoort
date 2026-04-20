import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { studentAPI, reportAPI, meetingAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { DocumentTextIcon, CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reportStats, setReportStats] = useState({});
  const [recentReports, setRecentReports] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    studentAPI.getMyProfile().then(r => setProfile(r.data.data)).catch(() => {});
    reportAPI.getDashboardStats().then(r => setReportStats(r.data.data)).catch(() => {});
    reportAPI.getMyReports().then(r => setRecentReports(r.data.data?.slice(0, 5) || [])).catch(() => {});
    meetingAPI.getUpcoming().then(r => setUpcomingMeetings(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <DashboardLayout title="Student Dashboard">
      {/* Welcome */}
      <div className="mb-6 p-6 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white">
        <h2 className="text-xl font-bold">Welcome back, {user?.name}! 👋</h2>
        <p className="text-primary-100 text-sm mt-1">
          {profile?.researchTitle ? `Research: ${profile.researchTitle}` : 'Update your research title in your profile'}
        </p>
        {profile && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-primary-100">Overall Progress</span>
              <span className="text-sm font-semibold">{profile.progressPercent || 0}%</span>
            </div>
            <div className="h-2 bg-primary-500 rounded-full">
              <div className="h-2 bg-white rounded-full transition-all" style={{ width: `${profile.progressPercent || 0}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Reports" value={reportStats.total ?? 0} icon={DocumentTextIcon} color="blue" />
        <StatCard title="Approved" value={reportStats.approved ?? 0} icon={DocumentTextIcon} color="green" />
        <StatCard title="Pending" value={(reportStats.submitted ?? 0) + (reportStats.underReview ?? 0)} icon={DocumentTextIcon} color="orange" />
        <StatCard title="Upcoming Meetings" value={upcomingMeetings.length} icon={CalendarIcon} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card title="My RAC Reports" actions={
          <Button size="sm" onClick={() => navigate('/student/reports/new')}>
            New Report
          </Button>
        }>
          {recentReports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-3">No reports submitted yet</p>
              <Button size="sm" onClick={() => navigate('/student/reports/new')}>Submit First Report</Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentReports.map(r => (
                <div key={r._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Semester {r.semester} Report</p>
                    <p className="text-xs text-slate-500">{r.createdAt ? format(new Date(r.createdAt), 'MMM d, yyyy') : '—'}</p>
                  </div>
                  <Badge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming Meetings */}
        <Card title="Upcoming Meetings">
          {upcomingMeetings.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No upcoming meetings</p>
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.map(m => (
                <div key={m._id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-slate-900">{m.title}</p>
                  <p className="text-xs text-slate-500 mt-1">📍 {m.venue || 'TBD'}</p>
                  <p className="text-xs font-semibold text-primary-600 mt-1">
                    📅 {m.scheduledDate ? format(new Date(m.scheduledDate), 'EEEE, MMM d yyyy') : '—'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
