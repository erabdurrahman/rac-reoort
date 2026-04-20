const User = require('../models/User');
const Student = require('../models/Student');
const Supervisor = require('../models/Supervisor');
const RACReport = require('../models/RACReport');
const Meeting = require('../models/Meeting');

// @desc    Get all users (admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const total = await User.countDocuments(query);
    const users = await User.find(query).populate('department', 'name code')
      .skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt');
    res.json({ success: true, count: users.length, total, data: users });
  } catch (err) { next(err); }
};

// @desc    Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('department', 'name code');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// @desc    Update user
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// @desc    Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

// @desc    Toggle user active status
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, data: user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) { next(err); }
};

// @desc    Admin dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalStudents, totalSupervisors, pendingReports, approvedReports, upcomingMeetings, totalDepartments] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'supervisor' }),
      RACReport.countDocuments({ status: { $in: ['submitted', 'under_review'] } }),
      RACReport.countDocuments({ status: 'approved' }),
      Meeting.countDocuments({ status: 'scheduled', scheduledDate: { $gte: new Date() } }),
      require('../models/Department').countDocuments()
    ]);
    res.json({ success: true, data: { totalStudents, totalSupervisors, pendingReports, approvedReports, upcomingMeetings, totalDepartments } });
  } catch (err) { next(err); }
};
