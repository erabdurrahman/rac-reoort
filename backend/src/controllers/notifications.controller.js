const Notification = require('../models/Notification');
const { asyncHandler } = require('../utils/helpers');

exports.getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isRead } = req.query;
  const filter = { userId: req.user._id };
  if (isRead !== undefined) filter.isRead = isRead === 'true';
  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).skip(skip).limit(parseInt(limit)).sort('-createdAt'),
    Notification.countDocuments(filter),
    Notification.countDocuments({ userId: req.user._id, isRead: false }),
  ]);
  res.json({ success: true, data: { notifications, total, unreadCount, page: parseInt(page), pages: Math.ceil(total / limit) } });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
  res.json({ success: true, message: 'Notification marked as read', data: { notification } });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All notifications marked as read.' });
});

exports.createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create({ ...req.body });
  res.status(201).json({ success: true, data: { notification } });
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
  res.json({ success: true, message: 'Notification deleted.' });
});
