const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead, markAllAsRead, deleteNotification, createNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/me', getMyNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);
router.post('/', authorize('admin'), createNotification);

module.exports = router;
