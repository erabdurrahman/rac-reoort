const RACReport = require('../models/RACReport');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const { generateRACReportPDF } = require('../utils/pdfGenerator');
const { asyncHandler } = require('../utils/helpers');

const populateReport = (query) =>
  query
    .populate({ path: 'studentId', populate: [{ path: 'userId', select: 'name email' }, { path: 'department', select: 'name code' }] })
    .populate({ path: 'supervisorId', populate: { path: 'userId', select: 'name email' } })
    .populate('reviewedBy', 'name email');

exports.getAllReports = asyncHandler(async (req, res) => {
  const { studentId, supervisorId, status, semester, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (supervisorId) filter.supervisorId = supervisorId;
  if (status) filter.status = status;
  if (semester) filter.semester = semester;

  // Role-based filtering
  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user._id });
    if (student) filter.studentId = student._id;
  } else if (req.user.role === 'supervisor') {
    const { Supervisor } = require('../models/Supervisor') || {};
    const sup = await require('../models/Supervisor').findOne({ userId: req.user._id });
    if (sup) filter.supervisorId = sup._id;
  }

  const skip = (page - 1) * limit;
  const [reports, total] = await Promise.all([
    populateReport(RACReport.find(filter)).skip(skip).limit(parseInt(limit)).sort('-createdAt'),
    RACReport.countDocuments(filter),
  ]);
  res.json({ success: true, data: { reports, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
});

exports.getReportById = asyncHandler(async (req, res) => {
  const report = await populateReport(RACReport.findById(req.params.id));
  if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
  res.json({ success: true, data: { report } });
});

exports.createReport = asyncHandler(async (req, res) => {
  const report = await RACReport.create(req.body);
  await Student.findByIdAndUpdate(report.studentId, { progressPercent: req.body.progressPercent || undefined });
  await populateReport(RACReport.findById(report._id)).then(async (populated) => {
    const student = await Student.findById(report.studentId).populate('userId', '_id');
    if (student?.userId) {
      await Notification.create({
        userId: student.userId._id,
        title: 'New RAC Report Created',
        message: `Your RAC report for Semester ${report.semester} has been submitted.`,
        type: 'info',
      });
    }
  });
  const populated = await populateReport(RACReport.findById(report._id));
  res.status(201).json({ success: true, message: 'Report created successfully', data: { report: populated } });
});

exports.updateReport = asyncHandler(async (req, res) => {
  const report = await populateReport(
    RACReport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  );
  if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
  res.json({ success: true, message: 'Report updated successfully', data: { report } });
});

exports.deleteReport = asyncHandler(async (req, res) => {
  const report = await RACReport.findByIdAndDelete(req.params.id);
  if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
  res.json({ success: true, message: 'Report deleted successfully.' });
});

exports.generatePDF = asyncHandler(async (req, res) => {
  const report = await populateReport(RACReport.findById(req.params.id));
  if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

  const result = await generateRACReportPDF(report);
  report.pdfUrl = result.url;
  report.pdfGeneratedAt = new Date();
  await report.save();

  res.json({ success: true, message: 'PDF generated successfully', data: { pdfUrl: result.url, filename: result.filename } });
});

exports.approveReport = asyncHandler(async (req, res) => {
  const { status, remarks, recommendation, overallGrade } = req.body;
  const report = await RACReport.findByIdAndUpdate(
    req.params.id,
    { status, remarks, recommendation, overallGrade, reviewedBy: req.user._id, reviewedAt: new Date() },
    { new: true }
  );
  if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
  const student = await Student.findById(report.studentId).populate('userId', '_id name');
  if (student?.userId) {
    await Notification.create({
      userId: student.userId._id,
      title: `RAC Report ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your RAC report for Semester ${report.semester} has been ${status}.${remarks ? ` Remarks: ${remarks}` : ''}`,
      type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info',
    });
  }
  res.json({ success: true, message: 'Report status updated', data: { report } });
});

exports.getStats = asyncHandler(async (req, res) => {
  const [total, pending, approved, rejected, underReview] = await Promise.all([
    RACReport.countDocuments(),
    RACReport.countDocuments({ status: 'pending' }),
    RACReport.countDocuments({ status: 'approved' }),
    RACReport.countDocuments({ status: 'rejected' }),
    RACReport.countDocuments({ status: 'under_review' }),
  ]);
  res.json({ success: true, data: { total, pending, approved, rejected, underReview } });
});
