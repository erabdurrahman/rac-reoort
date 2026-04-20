const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Department name is required'], trim: true },
  code: { type: String, trim: true, uppercase: true },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
