import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon, UserGroupIcon, DocumentTextIcon, CalendarIcon,
  BuildingOfficeIcon, ClockIcon, CheckCircleIcon, XCircleIcon,
} from '@heroicons/react/24/outline';
import { StatCard } from '../../components/ui/Card';
import { StatusPieChart, ProgressLineChart, DeptBarChart } from '../../components/charts/DashboardCharts';
import { PageLoader } from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/Badge';
import { reportService } from '../../services/report.service';
import { studentService } from '../../services/student.service';
import { format } from 'date-fns';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reportsRes, studentsRes, supervisorsRes, meetingsRes] = await Promise.all([
          reportService.getStats(),
          reportService.getAll({ limit: 5 }),
          studentService.getAll({ limit: 1 }),
          api.get('/supervisors', { params: { limit: 1 } }),
          api.get('/meetings', { params: { limit: 1 } }),
        ]);
        setStats({
          ...statsRes.data.data,
          totalStudents: studentsRes.data.data.total,
          totalSupervisors: supervisorsRes.data.data.total,
        });
        setRecentReports(reportsRes.data.data.reports);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  const pieData = [
    { name: 'Approved', value: stats?.approved || 0 },
    { name: 'Pending', value: stats?.pending || 0 },
    { name: 'Under Review', value: stats?.underReview || 0 },
    { name: 'Rejected', value: stats?.rejected || 0 },
  ];

  const lineData = [
    { month: 'Aug', reports: 3 }, { month: 'Sep', reports: 5 }, { month: 'Oct', reports: 4 },
    { month: 'Nov', reports: 8 }, { month: 'Dec', reports: 6 }, { month: 'Jan', reports: 10 },
  ];

  const deptData = [
    { name: 'CSE', students: 4 },
    { name: 'EE', students: 2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of the RAC Report System</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Total Students', value: stats?.totalStudents || 0, icon: AcademicCapIcon, color: 'blue' },
          { title: 'Supervisors', value: stats?.totalSupervisors || 0, icon: UserGroupIcon, color: 'purple' },
          { title: 'Total Reports', value: stats?.total || 0, icon: DocumentTextIcon, color: 'green' },
          { title: 'Pending Review', value: stats?.pending || 0, icon: ClockIcon, color: 'yellow' },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Monthly Reports Submitted</h2>
          <ProgressLineChart data={lineData} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Report Status</h2>
          <StatusPieChart data={pieData} />
        </div>
      </div>

      {/* Department & Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Students by Department</h2>
          <DeptBarChart data={deptData} />
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent Reports</h2>
            <Link to="/admin/reports" className="text-sm text-primary-600 hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentReports.map((r) => (
              <div key={r._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-900">{r.studentId?.userId?.name || 'N/A'}</p>
                  <p className="text-xs text-slate-500">Semester {r.semester} • {r.studentId?.department?.name || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={r.status} />
                  <p className="text-xs text-slate-400 mt-1">{format(new Date(r.meetingDate), 'MMM d, yyyy')}</p>
                </div>
              </div>
            ))}
            {recentReports.length === 0 && (
              <p className="text-center text-slate-500 text-sm py-8">No reports yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Add Student', path: '/admin/students', icon: AcademicCapIcon, color: 'bg-blue-50 text-blue-600 border-blue-200' },
          { label: 'Add Supervisor', path: '/admin/supervisors', icon: UserGroupIcon, color: 'bg-purple-50 text-purple-600 border-purple-200' },
          { label: 'Schedule Meeting', path: '/admin/meetings', icon: CalendarIcon, color: 'bg-green-50 text-green-600 border-green-200' },
          { label: 'View Reports', path: '/admin/reports', icon: DocumentTextIcon, color: 'bg-amber-50 text-amber-600 border-amber-200' },
        ].map((a) => (
          <Link key={a.label} to={a.path}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${a.color} hover:shadow-md transition-all`}>
            <a.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
