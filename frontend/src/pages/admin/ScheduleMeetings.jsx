import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { meetingService, studentService, supervisorService } from '../../services/student.service';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input, { Select, Textarea } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { PageLoader } from '../../components/ui/Spinner';
import { format } from 'date-fns';

export default function ScheduleMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchData();
    studentService.getAll({ limit: 100 }).then(r => setStudents(r.data.data.students));
    supervisorService.getAll({ limit: 100 }).then(r => setSupervisors(r.data.data.supervisors));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await meetingService.getAll({ limit: 50 });
      setMeetings(data.data.meetings);
    } catch { toast.error('Failed to load meetings'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditItem(null); reset({}); setShowModal(true); };
  const openEdit = (m) => {
    setEditItem(m);
    reset({
      title: m.title, studentId: m.studentId?._id, supervisorId: m.supervisorId?._id,
      scheduledDate: format(new Date(m.scheduledDate), "yyyy-MM-dd'T'HH:mm"),
      duration: m.duration, venue: m.venue, mode: m.mode, agenda: m.agenda, status: m.status, semester: m.semester,
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editItem) {
        await meetingService.update(editItem._id, data);
        toast.success('Meeting updated');
      } else {
        await meetingService.create(data);
        toast.success('Meeting scheduled');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this meeting?')) return;
    try {
      await meetingService.delete(id);
      toast.success('Meeting deleted');
      fetchData();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule Meetings</h1>
          <p className="text-slate-500 text-sm mt-1">{meetings.length} meetings scheduled</p>
        </div>
        <Button icon={PlusIcon} onClick={openAdd}>Schedule Meeting</Button>
      </div>

      {loading ? <PageLoader /> : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <motion.div key={m._id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
              <div className="flex-shrink-0 text-center bg-primary-50 rounded-xl p-3 min-w-14">
                <p className="text-xs text-primary-600 font-medium">{format(new Date(m.scheduledDate), 'MMM')}</p>
                <p className="text-2xl font-bold text-primary-700">{format(new Date(m.scheduledDate), 'd')}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">{m.title}</p>
                <p className="text-sm text-slate-600">{m.studentId?.userId?.name} &bull; {m.studentId?.department?.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {format(new Date(m.scheduledDate), 'h:mm a')} &bull; {m.venue || m.mode} &bull; {m.duration} min
                </p>
                {m.agenda && <p className="text-xs text-slate-500 mt-1 line-clamp-1">Agenda: {m.agenda}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={m.status} />
                <div className="flex gap-1">
                  <button onClick={() => openEdit(m)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(m._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {meetings.length === 0 && (
            <div className="text-center py-16 text-slate-500 bg-white rounded-xl border border-slate-200">No meetings scheduled</div>
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Meeting' : 'Schedule Meeting'} size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} loading={saving}>{editItem ? 'Save' : 'Schedule'}</Button>
          </div>
        }
      >
        <form className="grid grid-cols-2 gap-4">
          <Input label="Meeting Title" className="col-span-2" required error={errors.title?.message}
            {...register('title', { required: true })} placeholder="RAC Meeting - Semester 5" />
          <Select label="Student" required error={errors.studentId?.message} {...register('studentId', { required: true })}>
            <option value="">Select Student</option>
            {students.map(s => <option key={s._id} value={s._id}>{s.userId?.name} ({s.scholarId})</option>)}
          </Select>
          <Select label="Supervisor" {...register('supervisorId')}>
            <option value="">Select Supervisor</option>
            {supervisors.map(s => <option key={s._id} value={s._id}>{s.userId?.name}</option>)}
          </Select>
          <Input label="Date & Time" type="datetime-local" required error={errors.scheduledDate?.message}
            {...register('scheduledDate', { required: true })} />
          <Input label="Duration (minutes)" type="number" {...register('duration')} placeholder="60" />
          <Input label="Venue" {...register('venue')} placeholder="Conference Room A" />
          <Select label="Mode" {...register('mode')}>
            <option value="in-person">In-Person</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </Select>
          <Input label="Semester" type="number" min="1" max="20" {...register('semester')} />
          <Select label="Status" {...register('status')}>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Textarea label="Agenda" className="col-span-2" rows={3} {...register('agenda')} placeholder="Meeting agenda..." />
        </form>
      </Modal>
    </div>
  );
}
