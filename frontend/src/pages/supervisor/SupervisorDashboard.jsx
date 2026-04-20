import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { supervisorAPI, reportAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { UserGroupIcon, DocumentTextIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [reportStats, setReportStats] = useState({});
  const [recentReports, setRecentReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supervisorAPI.getMyStudents().then(r => setStudents(r.data.data || [])).catch(() => {});
    reportAPI.getDashboardStats().then(r => setReportStats(r.data.data)).catch(() => {});
    reportAPI.getAll({ limit: 5 }).then(r => setRecentReports(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <DashboardLayout title="Supervisor Dashboard">
      <div className="mb-6 p-6 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl text-white">
        <h2 className="text-xl font-bold">Welcome, {user?.name} 👋</h2>
        <p className="text-slate-300 text-sm mt-1">You have {students.length} assigned scholar(s)</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="My Scholars" value={students.length} icon={UserGroupIcon} color="blue" />
        <StatCard title="Pending Review" value={(reportStats.submitted ?? 0) + (reportStats.underReview ?? 0)} icon={DocumentTextIcon} color="orange" />
        <StatCard title="Approved" value={reportStats.approved ?? 0} icon={CheckCircleIcon} color="green" />
        <StatCard title="Total Reports" value={reportStats.total ?? 0} icon={ClockIcon} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Assigned Scholars */}
        <Card title="Assigned Scholars" actions={
          <button onClick={() => navigate('/supervisor/scholars')} className="text-sm text-primary-600 hover:underline">View All</button>
        }>
          {students.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No scholars assigned</p>
          ) : (
            <div className="space-y-3">
              {students.slice(0, 5).map(s => (
                <div key={s._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm flex-shrink-0">
                    {s.userId?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{s.userId?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{s.researchTitle || 'No title set'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-primary-600">{s.progressPercent || 0}%</p>
                    <p className="text-xs text-slate-500">Sem {s.semester}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Reports to Review */}
        <Card title="Pending Review" actions={
          <button onClick={() => navigate('/supervisor/reports')} className="text-sm text-primary-600 hover:underline">View All</button>
        }>
          {recentReports.filter(r => ['submitted', 'under_review'].includes(r.status)).length === 0 ? (
            <p className="text-slate-400 text-center py-8">No reports pending review</p>
          ) : (
            <div className="space-y-3">
              {recentReports.filter(r => ['submitted', 'under_review'].includes(r.status)).map(r => (
                <div key={r._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{r.studentId?.name}</p>
                    <p className="text-xs text-slate-500">{r.createdAt ? format(new Date(r.createdAt), 'MMM d, yyyy') : '—'}</p>
                  </div>
                  <Badge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
