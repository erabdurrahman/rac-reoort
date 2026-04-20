const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reports.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');

router.use(authenticate);
router.get('/stats', authorize('admin'), ctrl.getStats);
router.get('/', ctrl.getAllReports);
router.post('/', validate(schemas.createReport), ctrl.createReport);
router.get('/:id', ctrl.getReportById);
router.put('/:id', ctrl.updateReport);
router.delete('/:id', authorize('admin'), ctrl.deleteReport);
router.post('/:id/generate-pdf', ctrl.generatePDF);
router.put('/:id/approve', authorize('admin', 'supervisor'), ctrl.approveReport);

module.exports = router;
