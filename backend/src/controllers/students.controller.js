const Student = require('../models/Student');
const Supervisor = require('../models/Supervisor');
const { asyncHandler } = require('../utils/helpers');

exports.getAllStudents = asyncHandler(async (req, res) => {
  const { department, supervisorId, status, page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (supervisorId) filter.supervisorId = supervisorId;
  if (status) filter.status = status;
  const skip = (page - 1) * limit;
  let query = Student.find(filter)
    .populate('userId', 'name email')
    .populate('department', 'name code')
    .populate({ path: 'supervisorId', populate: { path: 'userId', select: 'name email' } })
    .skip(skip)
    .limit(parseInt(limit))
    .sort('-createdAt');

  const [students, total] = await Promise.all([query, Student.countDocuments(filter)]);

  let filteredStudents = students;
  if (search) {
    const s = search.toLowerCase();
    filteredStudents = students.filter((st) =>
      (st.userId?.name || '').toLowerCase().includes(s) ||
      (st.scholarId || '').toLowerCase().includes(s) ||
      (st.registrationNo || '').toLowerCase().includes(s)
    );
  }
  res.json({ success: true, data: { students: filteredStudents, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
});

exports.getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('userId', 'name email role')
    .populate('department', 'name code')
    .populate({ path: 'supervisorId', populate: { path: 'userId', select: 'name email' } });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
  res.json({ success: true, data: { student } });
});

exports.getStudentByUserId = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.params.userId })
    .populate('userId', 'name email role')
    .populate('department', 'name code')
    .populate({ path: 'supervisorId', populate: { path: 'userId', select: 'name email' } });
  if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });
  res.json({ success: true, data: { student } });
});

exports.createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);
  if (student.supervisorId) {
    await Supervisor.findByIdAndUpdate(student.supervisorId, { $addToSet: { assignedStudents: student._id } });
  }
  await student.populate([
    { path: 'userId', select: 'name email' },
    { path: 'department', select: 'name code' },
  ]);
  res.status(201).json({ success: true, message: 'Student created successfully', data: { student } });
});

exports.updateStudent = asyncHandler(async (req, res) => {
  const old = await Student.findById(req.params.id);
  if (!old) return res.status(404).json({ success: false, message: 'Student not found.' });

  if (req.body.supervisorId && String(req.body.supervisorId) !== String(old.supervisorId)) {
    if (old.supervisorId) {
      await Supervisor.findByIdAndUpdate(old.supervisorId, { $pull: { assignedStudents: old._id } });
    }
    await Supervisor.findByIdAndUpdate(req.body.supervisorId, { $addToSet: { assignedStudents: old._id } });
  }

  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('userId', 'name email')
    .populate('department', 'name code')
    .populate({ path: 'supervisorId', populate: { path: 'userId', select: 'name email' } });
  res.json({ success: true, message: 'Student updated successfully', data: { student } });
});

exports.deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
  if (student.supervisorId) {
    await Supervisor.findByIdAndUpdate(student.supervisorId, { $pull: { assignedStudents: student._id } });
  }
  res.json({ success: true, message: 'Student deleted successfully.' });
});
