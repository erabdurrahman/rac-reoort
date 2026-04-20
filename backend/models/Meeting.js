const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledDate: { type: Date, required: true },
  venue: { type: String, default: '' },
  agenda: { type: String, default: '' },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'postponed'],
    default: 'scheduled'
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', MeetingSchema);
