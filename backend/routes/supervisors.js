const express = require('express');
const router = express.Router();
const { getAllSupervisors, getSupervisorById, createSupervisor, updateSupervisor, deleteSupervisor, getMyProfile, getMyStudents } = require('../controllers/supervisorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/me/profile', authorize('supervisor'), getMyProfile);
router.get('/me/students', authorize('supervisor'), getMyStudents);
router.get('/', authorize('admin', 'student'), getAllSupervisors);
router.post('/', authorize('admin'), createSupervisor);
router.get('/:id', getAllSupervisors);
router.put('/:id', authorize('admin'), updateSupervisor);
router.delete('/:id', authorize('admin'), deleteSupervisor);

module.exports = router;
