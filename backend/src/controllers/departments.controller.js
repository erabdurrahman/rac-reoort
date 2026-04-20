const Department = require('../models/Department');
const { asyncHandler } = require('../utils/helpers');

exports.getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find({ isActive: true }).populate('head', 'name email');
  res.json({ success: true, data: { departments } });
});

exports.getDepartmentById = asyncHandler(async (req, res) => {
  const dept = await Department.findById(req.params.id).populate('head', 'name email');
  if (!dept) return res.status(404).json({ success: false, message: 'Department not found.' });
  res.json({ success: true, data: { department: dept } });
});

exports.createDepartment = asyncHandler(async (req, res) => {
  const dept = await Department.create(req.body);
  res.status(201).json({ success: true, message: 'Department created successfully', data: { department: dept } });
});

exports.updateDepartment = asyncHandler(async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('head', 'name email');
  if (!dept) return res.status(404).json({ success: false, message: 'Department not found.' });
  res.json({ success: true, message: 'Department updated successfully', data: { department: dept } });
});

exports.deleteDepartment = asyncHandler(async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!dept) return res.status(404).json({ success: false, message: 'Department not found.' });
  res.json({ success: true, message: 'Department deactivated successfully.' });
});
