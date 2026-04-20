const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, getMyProfile, updateProgress, uploadDocument } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.get('/me/profile', authorize('student'), getMyProfile);
router.put('/me/progress', authorize('student'), updateProgress);
router.post('/me/documents', authorize('student'), upload.single('file'), uploadDocument);
router.get('/', authorize('admin', 'supervisor'), getAllStudents);
router.post('/', authorize('admin'), createStudent);
router.get('/:id', authorize('admin', 'supervisor'), getStudentById);
router.put('/:id', authorize('admin'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

module.exports = router;
