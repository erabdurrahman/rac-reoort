const Supervisor = require('../models/Supervisor');
const { asyncHandler } = require('../utils/helpers');

exports.getAllSupervisors = asyncHandler(async (req, res) => {
  const { department, page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (department) filter.department = department;
  const skip = (page - 1) * limit;
  const [supervisors, total] = await Promise.all([
    Supervisor.find(filter)
      .populate('userId', 'name email')
      .populate('department', 'name code')
      .populate({ path: 'assignedStudents', populate: { path: 'userId', select: 'name email' } })
      .skip(skip).limit(parseInt(limit)).sort('-createdAt'),
    Supervisor.countDocuments(filter),
  ]);
  res.json({ success: true, data: { supervisors, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
});

exports.getSupervisorById = asyncHandler(async (req, res) => {
  const supervisor = await Supervisor.findById(req.params.id)
    .populate('userId', 'name email role')
    .populate('department', 'name code')
    .populate({ path: 'assignedStudents', populate: [{ path: 'userId', select: 'name email' }, { path: 'department', select: 'name' }] });
  if (!supervisor) return res.status(404).json({ success: false, message: 'Supervisor not found.' });
  res.json({ success: true, data: { supervisor } });
});

exports.getSupervisorByUserId = asyncHandler(async (req, res) => {
  const supervisor = await Supervisor.findOne({ userId: req.params.userId })
    .populate('userId', 'name email role')
    .populate('department', 'name code')
    .populate({ path: 'assignedStudents', populate: { path: 'userId', select: 'name email' } });
  if (!supervisor) return res.status(404).json({ success: false, message: 'Supervisor profile not found.' });
  res.json({ success: true, data: { supervisor } });
});

exports.createSupervisor = asyncHandler(async (req, res) => {
  const supervisor = await Supervisor.create(req.body);
  await supervisor.populate('userId', 'name email');
  res.status(201).json({ success: true, message: 'Supervisor created successfully', data: { supervisor } });
});

exports.updateSupervisor = asyncHandler(async (req, res) => {
  const supervisor = await Supervisor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('userId', 'name email')
    .populate('department', 'name code');
  if (!supervisor) return res.status(404).json({ success: false, message: 'Supervisor not found.' });
  res.json({ success: true, message: 'Supervisor updated successfully', data: { supervisor } });
});

exports.deleteSupervisor = asyncHandler(async (req, res) => {
  const supervisor = await Supervisor.findByIdAndDelete(req.params.id);
  if (!supervisor) return res.status(404).json({ success: false, message: 'Supervisor not found.' });
  res.json({ success: true, message: 'Supervisor deleted successfully.' });
});
