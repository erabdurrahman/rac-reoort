const mongoose = require('mongoose');

const supervisorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, unique: true, required: true },
  designation: { type: String, trim: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  specialization: { type: String, trim: true },
  phone: { type: String, trim: true },
  officeLocation: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Supervisor', supervisorSchema);
