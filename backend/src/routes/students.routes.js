const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/students.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(authenticate);
router.get('/', ctrl.getAllStudents);
router.post('/', authorize('admin'), ctrl.createStudent);
router.get('/by-user/:userId', ctrl.getStudentByUserId);
router.get('/:id', ctrl.getStudentById);
router.put('/:id', authorize('admin', 'supervisor'), ctrl.updateStudent);
router.delete('/:id', authorize('admin'), ctrl.deleteStudent);

module.exports = router;
