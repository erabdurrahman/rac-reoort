const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scholarId: { type: String, unique: true, required: true },
  registrationNo: { type: String, trim: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  researchTitle: { type: String, trim: true },
  joiningDate: { type: Date },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' },
  semester: { type: Number, default: 1, min: 1, max: 20 },
  progressPercent: { type: Number, default: 0, min: 0, max: 100 },
  documents: [{ name: String, url: String, uploadedAt: { type: Date, default: Date.now } }],
  status: { type: String, enum: ['active', 'inactive', 'completed', 'dropped'], default: 'active' },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  courseworkCompleted: { type: Boolean, default: false },
  publications: [{ title: String, journal: String, year: Number, status: String }],
}, { timestamps: true });

studentSchema.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true });

module.exports = mongoose.model('Student', studentSchema);
