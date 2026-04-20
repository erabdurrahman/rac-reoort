import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { departmentService } from '../../services/student.service';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { PageLoader } from '../../components/ui/Spinner';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await departmentService.getAll();
      setDepartments(data.data.departments);
    } catch { toast.error('Failed to load departments'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditItem(null); reset({}); setShowModal(true); };
  const openEdit = (d) => { setEditItem(d); reset({ name: d.name, code: d.code, description: d.description }); setShowModal(true); };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editItem) {
        await departmentService.update(editItem._id, data);
        toast.success('Department updated');
      } else {
        await departmentService.create(data);
        toast.success('Department created');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="text-slate-500 text-sm mt-1">Manage university departments</p>
        </div>
        <Button icon={PlusIcon} onClick={openAdd}>Add Department</Button>
      </div>

      {loading ? <PageLoader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((d) => (
            <div key={d._id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <BuildingOfficeIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(d)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900">{d.name}</h3>
              {d.code && <span className="inline-block mt-1 text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{d.code}</span>}
              {d.description && <p className="text-sm text-slate-500 mt-2">{d.description}</p>}
            </div>
          ))}
          {departments.length === 0 && (
            <div className="col-span-3 text-center py-12 text-slate-500">No departments found</div>
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Department' : 'Add Department'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} loading={saving}>{editItem ? 'Save' : 'Create'}</Button>
          </div>
        }
      >
        <form className="space-y-4">
          <Input label="Department Name" required error={errors.name?.message} {...register('name', { required: 'Name required' })} placeholder="Computer Science" />
          <Input label="Code" {...register('code')} placeholder="CSE" />
          <Input label="Description" {...register('description')} placeholder="Short description" />
        </form>
      </Modal>
    </div>
  );
}
