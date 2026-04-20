const User = require('../models/User');
const { asyncHandler } = require('../utils/helpers');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).populate('department').skip(skip).limit(parseInt(limit)).sort('-createdAt'),
    User.countDocuments(filter),
  ]);
  res.json({ success: true, data: { users, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('department');
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, data: { user } });
});

exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });
  const user = await User.create({ name, email, password, role, department });
  res.status(201).json({ success: true, message: 'User created successfully', data: { user } });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, department, isActive } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, department, isActive },
    { new: true, runValidators: true }
  ).populate('department');
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, message: 'User updated successfully', data: { user } });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, message: 'User deleted successfully.' });
});
