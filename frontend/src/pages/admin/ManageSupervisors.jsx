import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { supervisorService, departmentService, userService } from '../../services/student.service';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input, { Select } from '../../components/ui/Input';
import { PageLoader } from '../../components/ui/Spinner';

export default function ManageSupervisors() {
  const [supervisors, setSupervisors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchData();
    departmentService.getAll().then(r => setDepartments(r.data.data.departments));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await supervisorService.getAll({ limit: 50 });
      setSupervisors(data.data.supervisors);
      setTotal(data.data.total);
    } catch { toast.error('Failed to load supervisors'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditItem(null); reset({}); setShowModal(true); };
  const openEdit = (s) => {
    setEditItem(s);
    reset({ employeeId: s.employeeId, designation: s.designation, department: s.department?._id, specialization: s.specialization, phone: s.phone, officeLocation: s.officeLocation });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editItem) {
        await supervisorService.update(editItem._id, data);
        toast.success('Supervisor updated');
      } else {
        const userRes = await userService.create({ name: data.name, email: data.email, password: data.password || 'Supervisor@123', role: 'supervisor', department: data.department });
        await supervisorService.create({ ...data, userId: userRes.data.data.user._id });
        toast.success('Supervisor added');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this supervisor?')) return;
    try {
      await supervisorService.delete(id);
      toast.success('Supervisor deleted');
      fetchData();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Supervisors</h1>
          <p className="text-slate-500 text-sm mt-1">{total} supervisors registered</p>
        </div>
        <Button icon={PlusIcon} onClick={openAdd}>Add Supervisor</Button>
      </div>

      {loading ? <PageLoader /> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Supervisor', 'Employee ID', 'Designation', 'Department', 'Scholars', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {supervisors.map((s) => (
                <motion.tr key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{s.userId?.name}</p>
                      <p className="text-xs text-slate-500">{s.userId?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{s.employeeId}</td>
                  <td className="px-4 py-3 text-slate-600">{s.designation}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{s.department?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-center text-slate-700">{s.assignedStudents?.length || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {supervisors.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500">No supervisors found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Supervisor' : 'Add Supervisor'} size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} loading={saving}>{editItem ? 'Save' : 'Add'}</Button>
          </div>
        }
      >
        <form className="grid grid-cols-2 gap-4">
          {!editItem && (
            <>
              <Input label="Full Name" required error={errors.name?.message} {...register('name', { required: true })} placeholder="Dr. Full Name" />
              <Input label="Email" type="email" required error={errors.email?.message} {...register('email', { required: true })} placeholder="supervisor@university.edu" />
            </>
          )}
          <Input label="Employee ID" required error={errors.employeeId?.message} {...register('employeeId', { required: true })} placeholder="EMP001" />
          <Input label="Designation" {...register('designation')} placeholder="Professor" />
          <Select label="Department" {...register('department')}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </Select>
          <Input label="Specialization" {...register('specialization')} placeholder="Machine Learning" />
          <Input label="Phone" {...register('phone')} placeholder="+91-9876543210" />
          <Input label="Office Location" {...register('officeLocation')} placeholder="Block A, Room 201" />
        </form>
      </Modal>
    </div>
  );
}
