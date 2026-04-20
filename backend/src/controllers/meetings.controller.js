const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');
const Student = require('../models/Student');
const { asyncHandler } = require('../utils/helpers');

const populateMeeting = (query) =>
  query
    .populate({ path: 'studentId', populate: [{ path: 'userId', select: 'name email' }, { path: 'department', select: 'name' }] })
    .populate({ path: 'supervisorId', populate: { path: 'userId', select: 'name email' } })
    .populate('createdBy', 'name email');

exports.getAllMeetings = asyncHandler(async (req, res) => {
  const { studentId, supervisorId, status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (supervisorId) filter.supervisorId = supervisorId;
  if (status) filter.status = status;

  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user._id });
    if (student) filter.studentId = student._id;
  } else if (req.user.role === 'supervisor') {
    const sup = await require('../models/Supervisor').findOne({ userId: req.user._id });
    if (sup) filter.supervisorId = sup._id;
  }

  const skip = (page - 1) * limit;
  const [meetings, total] = await Promise.all([
    populateMeeting(Meeting.find(filter)).skip(skip).limit(parseInt(limit)).sort('scheduledDate'),
    Meeting.countDocuments(filter),
  ]);
  res.json({ success: true, data: { meetings, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
});

exports.getMeetingById = asyncHandler(async (req, res) => {
  const meeting = await populateMeeting(Meeting.findById(req.params.id));
  if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found.' });
  res.json({ success: true, data: { meeting } });
});

exports.createMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.create({ ...req.body, createdBy: req.user._id });
  const student = await Student.findById(meeting.studentId).populate('userId', '_id');
  if (student?.userId) {
    await Notification.create({
      userId: student.userId._id,
      title: 'RAC Meeting Scheduled',
      message: `A RAC meeting has been scheduled for ${new Date(meeting.scheduledDate).toLocaleDateString()}. Venue: ${meeting.venue || 'TBD'}`,
      type: 'info',
    });
  }
  const populated = await populateMeeting(Meeting.findById(meeting._id));
  res.status(201).json({ success: true, message: 'Meeting scheduled successfully', data: { meeting: populated } });
});

exports.updateMeeting = asyncHandler(async (req, res) => {
  const meeting = await populateMeeting(
    Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  );
  if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found.' });
  res.json({ success: true, message: 'Meeting updated successfully', data: { meeting } });
});

exports.deleteMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findByIdAndDelete(req.params.id);
  if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found.' });
  res.json({ success: true, message: 'Meeting deleted successfully.' });
});

exports.getUpcomingMeetings = asyncHandler(async (req, res) => {
  const filter = { scheduledDate: { $gte: new Date() }, status: 'scheduled' };
  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user._id });
    if (student) filter.studentId = student._id;
  }
  const meetings = await populateMeeting(Meeting.find(filter)).limit(5).sort('scheduledDate');
  res.json({ success: true, data: { meetings } });
});
