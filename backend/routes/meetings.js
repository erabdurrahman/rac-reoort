const express = require('express');
const router = express.Router();
const { getAllMeetings, getMeetingById, createMeeting, updateMeeting, deleteMeeting, getUpcomingMeetings } = require('../controllers/meetingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/upcoming', getUpcomingMeetings);
router.get('/', getAllMeetings);
router.post('/', authorize('admin', 'supervisor'), createMeeting);
router.get('/:id', getMeetingById);
router.put('/:id', authorize('admin', 'supervisor'), updateMeeting);
router.delete('/:id', authorize('admin'), deleteMeeting);

module.exports = router;
