const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser, toggleUserStatus, getDashboardStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/admin/dashboard-stats', authorize('admin'), getDashboardStats);
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.put('/:id/toggle-status', authorize('admin'), toggleUserStatus);

module.exports = router;
