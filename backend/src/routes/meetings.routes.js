const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/meetings.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');

router.use(authenticate);
router.get('/upcoming', ctrl.getUpcomingMeetings);
router.get('/', ctrl.getAllMeetings);
router.post('/', authorize('admin', 'supervisor'), validate(schemas.createMeeting), ctrl.createMeeting);
router.get('/:id', ctrl.getMeetingById);
router.put('/:id', authorize('admin', 'supervisor'), ctrl.updateMeeting);
router.delete('/:id', authorize('admin'), ctrl.deleteMeeting);

module.exports = router;
