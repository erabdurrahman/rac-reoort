const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  scholarId: { type: String, required: true, unique: true },
  registrationNo: { type: String, required: true, unique: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  researchTitle: { type: String, default: '' },
  researchArea: { type: String, default: '' },
  joiningDate: { type: Date },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  semester: { type: Number, default: 1 },
  progressPercent: { type: Number, default: 0, min: 0, max: 100 },
  thesisStatus: {
    type: String,
    enum: ['not_started', 'in_progress', 'submitted', 'approved'],
    default: 'not_started'
  },
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
