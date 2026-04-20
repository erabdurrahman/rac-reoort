const mongoose = require('mongoose');

const SupervisorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  designation: { type: String, default: 'Assistant Professor' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  specialization: { type: String, default: '' },
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Supervisor', SupervisorSchema);
