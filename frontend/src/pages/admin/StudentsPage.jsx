import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { studentAPI, departmentAPI, userAPI } from '../../services/api';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getAll({ search });
      setStudents(res.data.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStudents();
    departmentAPI.getAll().then(r => setDepartments(r.data.data || [])).catch(() => {});
    userAPI.getAll({ role: 'supervisor' }).then(r => setSupervisors(r.data.data || [])).catch(() => {});
  }, [search]);

  const onSubmit = async (data) => {
    try {
      // Create user first, then student profile
      const userRes = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password || 'Student@123', role: 'student', department: data.department })
      });
      const userData = await userRes.json();
      if (!userData.success) { toast.error(userData.message); return; }
      await studentAPI.create({ userId: userData.data.id, scholarId: data.scholarId, registrationNo: data.registrationNo, department: data.department, supervisorId: data.supervisorId, researchTitle: data.researchTitle });
      toast.success('Student created!');
      setShowModal(false);
      reset();
      fetchStudents();
    } catch (err) { toast.error('Failed to create student'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try { await studentAPI.delete(id); toast.success('Deleted'); fetchStudents(); } catch { toast.error('Failed'); }
  };

  const columns = [
    { key: 'userId', label: 'Name', render: (v) => v?.name || '—' },
    { key: 'scholarId', label: 'Scholar ID' },
    { key: 'registrationNo', label: 'Reg. No.' },
    { key: 'department', label: 'Department', render: (v) => v?.name || '—' },
    { key: 'supervisorId', label: 'Supervisor', render: (v) => v?.name || '—' },
    { key: 'progressPercent', label: 'Progress', render: (v) => (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full w-16"><div className="h-1.5 bg-primary-500 rounded-full" style={{ width: `${v || 0}%` }} /></div>
        <span className="text-xs text-slate-500">{v || 0}%</span>
      </div>
    )},
    { key: '_id', label: 'Actions', render: (id) => (
      <button onClick={() => handleDelete(id)} className="text-xs text-red-500 hover:underline">Delete</button>
    )}
  ];

  return (
    <DashboardLayout title="Students Management">
      <Card
        title={`All Students (${students.length})`}
        actions={
          <div className="flex items-center gap-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-56" />
            </div>
            <Button onClick={() => setShowModal(true)}>
              <PlusIcon className="w-4 h-4" /> Add Student
            </Button>
          </div>
        }
      >
        <Table columns={columns} data={students} loading={loading} emptyMessage="No students found" />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Student">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input {...register('name', { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" {...register('email', { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Scholar ID</label>
              <input {...register('scholarId', { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Registration No.</label>
              <input {...register('registrationNo', { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select {...register('department')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select department</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Supervisor</label>
              <select {...register('supervisorId')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select supervisor</option>
                {supervisors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Research Title</label>
            <input {...register('researchTitle')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Create Student</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
