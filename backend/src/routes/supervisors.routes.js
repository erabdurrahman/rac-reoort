const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/supervisors.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(authenticate);
router.get('/', ctrl.getAllSupervisors);
router.post('/', authorize('admin'), ctrl.createSupervisor);
router.get('/by-user/:userId', ctrl.getSupervisorByUserId);
router.get('/:id', ctrl.getSupervisorById);
router.put('/:id', authorize('admin', 'supervisor'), ctrl.updateSupervisor);
router.delete('/:id', authorize('admin'), ctrl.deleteSupervisor);

module.exports = router;
