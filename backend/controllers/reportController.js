const RACReport = require('../models/RACReport');
const Student = require('../models/Student');
const User = require('../models/User');
const Department = require('../models/Department');
const Notification = require('../models/Notification');
const { generateRACReportPDF } = require('../utils/generatePDF');
const { sendReportStatusEmail } = require('../utils/sendEmail');

exports.getAllReports = async (req, res, next) => {
  try {
    const { status, student, supervisor, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (student) query.studentId = student;
    if (supervisor) query.supervisorId = supervisor;
    if (req.user.role === 'student') query.studentId = req.user.id;
    if (req.user.role === 'supervisor') query.supervisorId = req.user.id;

    const [reports, total] = await Promise.all([
      RACReport.find(query)
        .populate('studentId', 'name email')
        .populate('supervisorId', 'name email')
        .skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt'),
      RACReport.countDocuments(query)
    ]);
    res.json({ success: true, count: reports.length, total, data: reports });
  } catch (err) { next(err); }
};

exports.getReportById = async (req, res, next) => {
  try {
    const report = await RACReport.findById(req.params.id)
      .populate('studentId', 'name email').populate('supervisorId', 'name email');
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (err) { next(err); }
};

exports.createReport = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    const reportData = {
      ...req.body,
      studentId: req.user.id,
      supervisorId: student?.supervisorId,
      semester: student?.semester
    };
    const report = await RACReport.create(reportData);
    res.status(201).json({ success: true, data: report });
  } catch (err) { next(err); }
};

exports.updateReport = async (req, res, next) => {
  try {
    const report = await RACReport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (err) { next(err); }
};

exports.reviewReport = async (req, res, next) => {
  try {
    const { remarks, recommendation, status, nextReviewDate } = req.body;
    const report = await RACReport.findByIdAndUpdate(
      req.params.id,
      { remarks, recommendation, status, nextReviewDate, supervisorId: req.user.id },
      { new: true }
    ).populate('studentId', 'name email');
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    // Notify student
    if (report.studentId) {
      await Notification.create({
        userId: report.studentId._id,
        title: 'RAC Report Update',
        message: `Your RAC report has been ${status.replace('_', ' ')}`,
        type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'
      });
      sendReportStatusEmail(report.studentId.email, report.studentId.name, status).catch(() => {});
    }
    res.json({ success: true, data: report });
  } catch (err) { next(err); }
};

exports.generatePDF = async (req, res, next) => {
  try {
    const report = await RACReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    const [student, supervisor] = await Promise.all([
      Student.findOne({ userId: report.studentId }),
      User.findById(report.supervisorId)
    ]);
    const studentUser = await User.findById(report.studentId);
    const department = student?.department ? await Department.findById(student.department) : null;

    const pdfBuffer = await generateRACReportPDF(
      report,
      { ...student?.toObject(), name: studentUser?.name },
      { name: supervisor?.name },
      department
    );

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="rac-report-${report._id}.pdf"` });
    res.send(pdfBuffer);
  } catch (err) { next(err); }
};

exports.getMyReports = async (req, res, next) => {
  try {
    const reports = await RACReport.find({ studentId: req.user.id })
      .populate('supervisorId', 'name email').sort('-createdAt');
    res.json({ success: true, count: reports.length, data: reports });
  } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const query = req.user.role === 'student' ? { studentId: req.user.id }
      : req.user.role === 'supervisor' ? { supervisorId: req.user.id } : {};

    const [total, submitted, underReview, approved, rejected, draft] = await Promise.all([
      RACReport.countDocuments(query),
      RACReport.countDocuments({ ...query, status: 'submitted' }),
      RACReport.countDocuments({ ...query, status: 'under_review' }),
      RACReport.countDocuments({ ...query, status: 'approved' }),
      RACReport.countDocuments({ ...query, status: 'rejected' }),
      RACReport.countDocuments({ ...query, status: 'draft' })
    ]);
    res.json({ success: true, data: { total, submitted, underReview, approved, rejected, draft } });
  } catch (err) { next(err); }
};
