const mongoose = require('mongoose');

const racReportSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  meetingDate: { type: Date, required: true },
  semester: { type: Number, required: true },
  progressSummary: { type: String, required: true, trim: true },
  courseworkStatus: { type: String, trim: true },
  publicationStatus: { type: String, trim: true },
  researchObjectives: { type: String, trim: true },
  workDoneLastSemester: { type: String, trim: true },
  workPlanNextSemester: { type: String, trim: true },
  remarks: { type: String, trim: true },
  supervisorComments: { type: String, trim: true },
  recommendation: {
    type: String,
    enum: ['continue', 'probation', 'terminate', 'extend', 'pending'],
    default: 'pending',
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'under_review', 'approved', 'rejected'],
    default: 'draft',
  },
  pdfUrl: { type: String },
  pdfGeneratedAt: { type: Date },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  committeeMembers: [{ name: String, designation: String }],
  overallGrade: { type: String, enum: ['Satisfactory', 'Unsatisfactory', 'Excellent', 'Good', ''] },
}, { timestamps: true });

module.exports = mongoose.model('RACReport', racReportSchema);
