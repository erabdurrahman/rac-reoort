const Meeting = require('../models/Meeting');

exports.getAllMeetings = async (req, res, next) => {
  try {
    const query = req.user.role === 'student' ? { studentId: req.user.id }
      : req.user.role === 'supervisor' ? { supervisorId: req.user.id } : {};
    const meetings = await Meeting.find(query)
      .populate('studentId', 'name email').populate('supervisorId', 'name email').sort('-scheduledDate');
    res.json({ success: true, count: meetings.length, data: meetings });
  } catch (err) { next(err); }
};

exports.getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('studentId', 'name email').populate('supervisorId', 'name email');
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.json({ success: true, data: meeting });
  } catch (err) { next(err); }
};

exports.createMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.create(req.body);
    res.status(201).json({ success: true, data: meeting });
  } catch (err) { next(err); }
};

exports.updateMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.json({ success: true, data: meeting });
  } catch (err) { next(err); }
};

exports.deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.json({ success: true, message: 'Meeting deleted' });
  } catch (err) { next(err); }
};

exports.getUpcomingMeetings = async (req, res, next) => {
  try {
    const query = { status: 'scheduled', scheduledDate: { $gte: new Date() } };
    if (req.user.role === 'student') query.studentId = req.user.id;
    if (req.user.role === 'supervisor') query.supervisorId = req.user.id;
    const meetings = await Meeting.find(query)
      .populate('studentId', 'name email').populate('supervisorId', 'name email').sort('scheduledDate').limit(10);
    res.json({ success: true, data: meetings });
  } catch (err) { next(err); }
};
