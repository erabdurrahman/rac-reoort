import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { userAPI, reportAPI, meetingAPI } from '../../services/api';
import { AcademicCapIcon, UserGroupIcon, DocumentTextIcon, CalendarIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [reportStats, setReportStats] = useState({});
  const [recentReports, setRecentReports] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userAPI.getDashboardStats(),
      reportAPI.getDashboardStats(),
      reportAPI.getAll({ limit: 5 }),
      meetingAPI.getUpcoming()
    ]).then(([statsRes, reportStatsRes, reportsRes, meetingsRes]) => {
      setStats(statsRes.data.data);
      setReportStats(reportStatsRes.data.data);
      setRecentReports(reportsRes.data.data || []);
      setUpcomingMeetings(meetingsRes.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const pieData = [
    { name: 'Approved', value: reportStats.approved || 0 },
    { name: 'Pending', value: reportStats.submitted || 0 },
    { name: 'Under Review', value: reportStats.underReview || 0 },
    { name: 'Rejected', value: reportStats.rejected || 0 }
  ].filter(d => d.value > 0);

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard title="Total Students" value={stats.totalStudents ?? '...'} icon={AcademicCapIcon} color="blue" />
        <StatCard title="Supervisors" value={stats.totalSupervisors ?? '...'} icon={UserGroupIcon} color="purple" />
        <StatCard title="Pending Reports" value={stats.pendingReports ?? '...'} icon={DocumentTextIcon} color="orange" />
        <StatCard title="Approved Reports" value={stats.approvedReports ?? '...'} icon={CheckCircleIcon} color="green" />
        <StatCard title="Upcoming Meetings" value={stats.upcomingMeetings ?? '...'} icon={CalendarIcon} color="slate" />
        <StatCard title="Departments" value={stats.totalDepartments ?? '...'} icon={BuildingOfficeIcon} color="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Report Status Chart */}
        <Card title="Report Status Distribution">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-400 text-center py-10">No report data</p>}
        </Card>

        {/* Upcoming Meetings */}
        <Card title="Upcoming Meetings">
          {upcomingMeetings.length === 0 ? (
            <p className="text-slate-400 text-center py-10">No upcoming meetings</p>
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.map(m => (
                <div key={m._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{m.title}</p>
                    <p className="text-xs text-slate-500">{m.studentId?.name} • {m.venue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-primary-600">{m.scheduledDate ? format(new Date(m.scheduledDate), 'MMM d, yyyy') : '—'}</p>
                    <Badge status={m.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Reports */}
      <Card title="Recent RAC Reports">
        {recentReports.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No reports yet</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentReports.map(r => (
              <div key={r._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{r.studentId?.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500">Submitted: {r.createdAt ? format(new Date(r.createdAt), 'MMM d, yyyy') : '—'}</p>
                </div>
                <Badge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
