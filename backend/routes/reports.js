const express = require('express');
const router = express.Router();
const { getAllReports, getReportById, createReport, updateReport, reviewReport, generatePDF, getMyReports, getDashboardStats } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/me/my-reports', authorize('student'), getMyReports);
router.get('/stats/dashboard', getDashboardStats);
router.get('/', getAllReports);
router.post('/', authorize('student'), createReport);
router.get('/:id', getReportById);
router.put('/:id', authorize('student', 'admin'), updateReport);
router.post('/:id/review', authorize('supervisor', 'admin'), reviewReport);
router.get('/:id/pdf', generatePDF);

module.exports = router;
