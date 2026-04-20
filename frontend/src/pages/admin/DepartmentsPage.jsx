import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { departmentAPI } from '../../services/api';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetch = async () => {
    setLoading(true);
    try { const r = await departmentAPI.getAll(); setDepartments(r.data.data || []); } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const onSubmit = async (data) => {
    try {
      await departmentAPI.create(data);
      toast.success('Department created!');
      setShowModal(false);
      reset();
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete department?')) return;
    try { await departmentAPI.delete(id); toast.success('Deleted'); fetch(); } catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout title="Departments">
      <Card title={`Departments (${departments.length})`} actions={
        <Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4" /> Add Department</Button>
      }>
        {loading ? <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded" />)}</div> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map(d => (
              <div key={d._id} className="p-4 border border-slate-200 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary-50 text-primary-700">{d.code}</span>
                  <button onClick={() => handleDelete(d._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{d.name}</h3>
                {d.description && <p className="text-xs text-slate-500 mt-1">{d.description}</p>}
              </div>
            ))}
            {departments.length === 0 && <p className="text-slate-400 col-span-3 text-center py-8">No departments yet</p>}
          </div>
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Department">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
            <input {...register('name', { required: true })} placeholder="Computer Science & Engineering"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
            <input {...register('code', { required: true })} placeholder="CSE"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
