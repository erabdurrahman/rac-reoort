const User = require('../models/User');
const { generateToken, asyncHandler, createError, generateRandomToken } = require('../utils/helpers');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/emailService');
const crypto = require('crypto');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, department } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });
  const user = await User.create({ name, email, password, role, department });
  await sendWelcomeEmail(user).catch(() => {});
  const token = generateToken(user._id);
  res.status(201).json({ success: true, message: 'Registration successful', data: { user, token } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email }).select('+password').populate('department');
  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, message: 'Invalid credentials or account deactivated.' });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  if (role && user.role !== role) {
    return res.status(403).json({ success: false, message: `Access denied. This account is not a ${role}.` });
  }
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  const token = generateToken(user._id);
  res.json({ success: true, message: 'Login successful', data: { user, token } });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('department');
  res.json({ success: true, data: { user } });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: true, message: 'If this email exists, a reset link has been sent.' });
  const token = generateRandomToken();
  user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user, resetUrl).catch(() => {});
  res.json({ success: true, message: 'Password reset link sent to email.' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  const newToken = generateToken(user._id);
  res.json({ success: true, message: 'Password reset successful', data: { token: newToken } });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully.' });
});
