import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { supervisorAPI } from '../../services/api';

export default function ScholarsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supervisorAPI.getMyStudents().then(r => setStudents(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Scholars">
      <Card title={`Assigned Scholars (${students.length})`}>
        {loading ? <div className="animate-pulse space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded" />)}</div>
          : students.length === 0 ? <p className="text-slate-400 text-center py-10">No scholars assigned</p>
          : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(s => (
              <div key={s._id} className="p-5 border border-slate-200 rounded-xl hover:border-primary-300 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {s.userId?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{s.userId?.name}</p>
                    <p className="text-xs text-slate-500">{s.scholarId}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-3 line-clamp-2">{s.researchTitle || 'Research title not set'}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-medium text-primary-600">{s.progressPercent || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full">
                    <div className="h-1.5 bg-primary-500 rounded-full" style={{ width: `${s.progressPercent || 0}%` }} />
                  </div>
                </div>
                <div className="flex justify-between mt-3 text-xs text-slate-500">
                  <span>Sem {s.semester}</span>
                  <span>{s.department?.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
