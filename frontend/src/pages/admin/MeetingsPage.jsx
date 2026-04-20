import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { meetingAPI, userAPI } from '../../services/api';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const fetchMeetings = async () => {
    setLoading(true);
    try { const r = await meetingAPI.getAll(); setMeetings(r.data.data || []); } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchMeetings();
    userAPI.getAll({ role: 'student' }).then(r => setStudents(r.data.data || [])).catch(() => {});
    userAPI.getAll({ role: 'supervisor' }).then(r => setSupervisors(r.data.data || [])).catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    try {
      await meetingAPI.create(data);
      toast.success('Meeting scheduled!');
      setShowModal(false);
      reset();
      fetchMeetings();
    } catch { toast.error('Failed to schedule meeting'); }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'studentId', label: 'Student', render: v => v?.name || '—' },
    { key: 'supervisorId', label: 'Supervisor', render: v => v?.name || '—' },
    { key: 'scheduledDate', label: 'Date', render: v => v ? format(new Date(v), 'MMM d, yyyy') : '—' },
    { key: 'venue', label: 'Venue' },
    { key: 'status', label: 'Status', render: v => <Badge status={v} /> }
  ];

  return (
    <DashboardLayout title="Meetings">
      <Card title={`All Meetings (${meetings.length})`} actions={
        <Button onClick={() => setShowModal(true)}><PlusIcon className="w-4 h-4" /> Schedule Meeting</Button>
      }>
        <Table columns={columns} data={meetings} loading={loading} emptyMessage="No meetings found" />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Meeting">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input {...register('title', { required: true })} placeholder="RAC Meeting - Student Name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
              <select {...register('studentId')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select student</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Supervisor</label>
              <select {...register('supervisorId')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select supervisor</option>
                {supervisors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
              <input type="datetime-local" {...register('scheduledDate', { required: true })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Venue</label>
              <input {...register('venue')} placeholder="Conference Room A"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Agenda</label>
            <textarea {...register('agenda')} rows={3} placeholder="Meeting agenda..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Schedule</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
