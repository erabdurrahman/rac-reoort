const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
  type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
  link: { type: String },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  relatedModel: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
