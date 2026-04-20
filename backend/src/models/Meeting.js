const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  scheduledDate: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // minutes
  venue: { type: String, trim: true },
  mode: { type: String, enum: ['in-person', 'online', 'hybrid'], default: 'in-person' },
  meetingLink: { type: String },
  agenda: { type: String, trim: true },
  notes: { type: String, trim: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'], default: 'scheduled' },
  semester: { type: Number },
  reportGenerated: { type: Boolean, default: false },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'RACReport' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
