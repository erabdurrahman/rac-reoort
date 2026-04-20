import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { supervisorAPI } from '../../services/api';

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supervisorAPI.getAll().then(r => setSupervisors(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'userId', label: 'Name', render: v => v?.name || '—' },
    { key: 'userId', label: 'Email', render: v => v?.email || '—' },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'designation', label: 'Designation' },
    { key: 'department', label: 'Department', render: v => v?.name || '—' },
    { key: 'assignedStudents', label: 'Students', render: v => v?.length || 0 },
    { key: 'userId', label: 'Status', render: v => <Badge status={v?.isActive ? 'active' : 'inactive'} /> }
  ];

  return (
    <DashboardLayout title="Supervisors Management">
      <Card title={`All Supervisors (${supervisors.length})`}>
        <Table columns={columns} data={supervisors} loading={loading} emptyMessage="No supervisors found" />
      </Card>
    </DashboardLayout>
  );
}
