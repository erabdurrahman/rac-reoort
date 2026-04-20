import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { studentService, supervisorService, departmentService, userService } from '../../services/student.service';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input, { Select } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { PageLoader } from '../../components/ui/Spinner';
import { format } from 'date-fns';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [supervisors, setSupervisors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchData();
    supervisorService.getAll({ limit: 100 }).then(r => setSupervisors(r.data.data.supervisors));
    departmentService.getAll().then(r => setDepartments(r.data.data.departments));
  }, []);

  const fetchData = async (s = '') => {
    setLoading(true);
    try {
      const { data } = await studentService.getAll({ search: s, limit: 50 });
      setStudents(data.data.students);
      setTotal(data.data.total);
    } catch { toast.error('Failed to fetch students'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditItem(null); reset({}); setShowModal(true); };
  const openEdit = (s) => {
    setEditItem(s);
    reset({
      scholarId: s.scholarId, registrationNo: s.registrationNo,
      researchTitle: s.researchTitle, semester: s.semester,
      progressPercent: s.progressPercent, status: s.status,
      supervisorId: s.supervisorId?._id || '', department: s.department?._id || '',
      joiningDate: s.joiningDate ? format(new Date(s.joiningDate), 'yyyy-MM-dd') : '',
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editItem) {
        await studentService.update(editItem._id, formData);
        toast.success('Student updated');
      } else {
        // Create user first then student
        const userRes = await userService.create({
          name: formData.name, email: formData.email, password: formData.password || 'Student@123',
          role: 'student', department: formData.department,
        });
        await studentService.create({ ...formData, userId: userRes.data.data.user._id });
        toast.success('Student added');
      }
      setShowModal(false);
      fetchData(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    setDeletingId(id);
    try {
      await studentService.delete(id);
      toast.success('Student deleted');
      fetchData(search);
    } catch { toast.error('Delete failed'); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Students</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total PhD scholars</p>
        </div>
        <Button icon={PlusIcon} onClick={openAdd}>Add Student</Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text" placeholder="Search students..."
          className="input-field pl-9"
          value={search}
          onChange={(e) => { setSearch(e.target.value); fetchData(e.target.value); }}
        />
      </div>

      {loading ? <PageLoader /> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Scholar', 'Scholar ID', 'Department', 'Supervisor', 'Semester', 'Progress', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <motion.tr key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{s.userId?.name}</p>
                      <p className="text-xs text-slate-500">{s.userId?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{s.scholarId}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{s.department?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{s.supervisorId?.userId?.name || 'Unassigned'}</td>
                  <td className="px-4 py-3 text-slate-700 text-center">{s.semester}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5 min-w-16">
                        <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${s.progressPercent}%` }} />
                      </div>
                      <span className="text-xs text-slate-600 w-8">{s.progressPercent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s._id)} disabled={deletingId === s._id}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-500">No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Student' : 'Add New Student'} size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} loading={saving}>
              {editItem ? 'Save Changes' : 'Add Student'}
            </Button>
          </div>
        }
      >
        <form className="grid grid-cols-2 gap-4">
          {!editItem && (
            <>
              <Input label="Full Name" required error={errors.name?.message}
                {...register('name', { required: 'Name required' })} placeholder="Dr. John Doe" />
              <Input label="Email" type="email" required error={errors.email?.message}
                {...register('email', { required: 'Email required' })} placeholder="student@university.edu" />
            </>
          )}
          <Input label="Scholar ID" required error={errors.scholarId?.message}
            {...register('scholarId', { required: 'Scholar ID required' })} placeholder="PHD2024CS001" />
          <Input label="Registration No" {...register('registrationNo')} placeholder="REG2024001" />
          <Input label="Research Title" className="col-span-2"
            {...register('researchTitle')} placeholder="Title of PhD research" />
          <Select label="Department" {...register('department')}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </Select>
          <Select label="Supervisor" {...register('supervisorId')}>
            <option value="">Select Supervisor</option>
            {supervisors.map(s => <option key={s._id} value={s._id}>{s.userId?.name} - {s.designation}</option>)}
          </Select>
          <Input label="Joining Date" type="date" {...register('joiningDate')} />
          <Input label="Semester" type="number" min="1" max="20" {...register('semester')} />
          <Input label="Progress %" type="number" min="0" max="100" {...register('progressPercent')} />
          <Select label="Status" {...register('status')}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </Select>
        </form>
      </Modal>
    </div>
  );
}
