const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notifications.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', ctrl.getNotifications);
router.post('/', ctrl.createNotification);
router.put('/read-all', ctrl.markAllAsRead);
router.put('/:id/read', ctrl.markAsRead);
router.delete('/:id', ctrl.deleteNotification);

module.exports = router;
