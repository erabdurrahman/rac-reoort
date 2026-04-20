const Supervisor = require('../models/Supervisor');
const Student = require('../models/Student');

exports.getAllSupervisors = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [supervisors, total] = await Promise.all([
      Supervisor.find().populate('userId', 'name email isActive').populate('department', 'name code')
        .skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt'),
      Supervisor.countDocuments()
    ]);
    res.json({ success: true, count: supervisors.length, total, data: supervisors });
  } catch (err) { next(err); }
};

exports.getSupervisorById = async (req, res, next) => {
  try {
    const sup = await Supervisor.findById(req.params.id)
      .populate('userId', 'name email phone profilePicture isActive').populate('department', 'name code');
    if (!sup) return res.status(404).json({ success: false, message: 'Supervisor not found' });
    res.json({ success: true, data: sup });
  } catch (err) { next(err); }
};

exports.createSupervisor = async (req, res, next) => {
  try {
    const sup = await Supervisor.create(req.body);
    res.status(201).json({ success: true, data: sup });
  } catch (err) { next(err); }
};

exports.updateSupervisor = async (req, res, next) => {
  try {
    const sup = await Supervisor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sup) return res.status(404).json({ success: false, message: 'Supervisor not found' });
    res.json({ success: true, data: sup });
  } catch (err) { next(err); }
};

exports.deleteSupervisor = async (req, res, next) => {
  try {
    const sup = await Supervisor.findByIdAndDelete(req.params.id);
    if (!sup) return res.status(404).json({ success: false, message: 'Supervisor not found' });
    res.json({ success: true, message: 'Supervisor deleted' });
  } catch (err) { next(err); }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const sup = await Supervisor.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone profilePicture').populate('department', 'name code');
    if (!sup) return res.status(404).json({ success: false, message: 'Supervisor profile not found' });
    res.json({ success: true, data: sup });
  } catch (err) { next(err); }
};

exports.getMyStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ supervisorId: req.user.id })
      .populate('userId', 'name email isActive').populate('department', 'name code');
    res.json({ success: true, count: students.length, data: students });
  } catch (err) { next(err); }
};
