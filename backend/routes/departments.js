const express = require('express');
const router = express.Router();
const { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment, getDepartmentStats } = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/stats', getDepartmentStats);
router.get('/', getAllDepartments);
router.post('/', authorize('admin'), createDepartment);
router.get('/:id', getDepartmentById);
router.put('/:id', authorize('admin'), updateDepartment);
router.delete('/:id', authorize('admin'), deleteDepartment);

module.exports = router;
