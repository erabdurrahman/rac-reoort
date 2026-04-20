const mongoose = require('mongoose');

const RACReportSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meetingDate: { type: Date },
  semester: { type: Number },
  progressSummary: { type: String, default: '' },
  courseworkStatus: { type: String, default: '' },
  publicationStatus: { type: String, default: '' },
  workCompleted: { type: String, default: '' },
  nextPlanOfWork: { type: String, default: '' },
  remarks: { type: String, default: '' },
  recommendation: {
    type: String,
    enum: ['satisfactory', 'needs_improvement', 'unsatisfactory'],
    default: 'satisfactory'
  },
  nextReviewDate: { type: Date },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'revision_requested'],
    default: 'draft'
  },
  pdfUrl: { type: String, default: '' },
  committee: [{
    name: String,
    designation: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('RACReport', RACReportSchema);
