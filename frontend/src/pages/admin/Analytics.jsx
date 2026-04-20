import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/report.service';
import { studentService } from '../../services/student.service';
import { ReportsBarChart, StatusPieChart, DeptBarChart, ProgressLineChart } from '../../components/charts/DashboardCharts';
import { StatCard } from '../../components/ui/Card';
import { PageLoader } from '../../components/ui/Spinner';
import { DocumentTextIcon, AcademicCapIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportService.getStats(),
      studentService.getAll({ limit: 1 }),
    ]).then(([statsRes, studRes]) => {
      setStats({ ...statsRes.data.data, totalStudents: studRes.data.data.total });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const pieData = [
    { name: 'Approved', value: stats?.approved || 0 },
    { name: 'Pending', value: stats?.pending || 0 },
    { name: 'Under Review', value: stats?.underReview || 0 },
    { name: 'Rejected', value: stats?.rejected || 0 },
  ];

  const monthlyData = [
    { month: 'Aug', reports: 3 }, { month: 'Sep', reports: 5 }, { month: 'Oct', reports: 7 },
    { month: 'Nov', reports: 4 }, { month: 'Dec', reports: 9 }, { month: 'Jan', reports: 12 },
  ];

  const deptData = [
    { name: 'CSE', students: 4 }, { name: 'EE', students: 2 },
  ];

  const semesterData = [
    { name: 'Sem 1', count: 1 }, { name: 'Sem 2', count: 1 }, { name: 'Sem 3', count: 2 },
    { name: 'Sem 4', count: 0 }, { name: 'Sem 5', count: 2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">System-wide statistics and insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Reports" value={stats?.total || 0} icon={DocumentTextIcon} color="blue" />
        <StatCard title="Approved" value={stats?.approved || 0} icon={CheckCircleIcon} color="green" />
        <StatCard title="Pending Review" value={stats?.pending || 0} icon={ClockIcon} color="yellow" />
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={AcademicCapIcon} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Monthly Report Submissions</h2>
          <ProgressLineChart data={monthlyData} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Reports by Status</h2>
          <StatusPieChart data={pieData} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Students by Department</h2>
          <DeptBarChart data={deptData} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Reports by Semester</h2>
          <ReportsBarChart data={semesterData} />
        </div>
      </div>

      {/* Summary table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Status Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats?.total || 0, color: 'text-slate-900 bg-slate-50' },
            { label: 'Draft', value: (stats?.total || 0) - (stats?.pending || 0) - (stats?.approved || 0) - (stats?.rejected || 0) - (stats?.underReview || 0), color: 'text-slate-600 bg-slate-50' },
            { label: 'Pending', value: stats?.pending || 0, color: 'text-yellow-700 bg-yellow-50' },
            { label: 'Under Review', value: stats?.underReview || 0, color: 'text-blue-700 bg-blue-50' },
            { label: 'Approved', value: stats?.approved || 0, color: 'text-green-700 bg-green-50' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
              <p className="text-2xl font-bold">{Math.max(0, s.value)}</p>
              <p className="text-xs font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
