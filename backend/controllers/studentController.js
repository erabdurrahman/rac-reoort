const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get all students
exports.getAllStudents = async (req, res, next) => {
  try {
    const { department, supervisor, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (department) query.department = department;
    if (supervisor) query.supervisorId = supervisor;

    let studentQuery = Student.find(query)
      .populate('userId', 'name email isActive')
      .populate('department', 'name code')
      .populate('supervisorId', 'name email')
      .skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt');

    const [students, total] = await Promise.all([studentQuery, Student.countDocuments(query)]);
    res.json({ success: true, count: students.length, total, data: students });
  } catch (err) { next(err); }
};

// @desc    Get student by ID
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email phone profilePicture isActive')
      .populate('department', 'name code')
      .populate('supervisorId', 'name email');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) { next(err); }
};

// @desc    Create student
exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (err) { next(err); }
};

// @desc    Update student
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) { next(err); }
};

// @desc    Delete student
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) { next(err); }
};

// @desc    Get my profile (student)
exports.getMyProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone profilePicture')
      .populate('department', 'name code')
      .populate('supervisorId', 'name email');
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    res.json({ success: true, data: student });
  } catch (err) { next(err); }
};

// @desc    Update research progress
exports.updateProgress = async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { progressPercent: req.body.progressPercent, researchTitle: req.body.researchTitle, thesisStatus: req.body.thesisStatus },
      { new: true }
    );
    res.json({ success: true, data: student });
  } catch (err) { next(err); }
};

// @desc    Upload document
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    const doc = { name: req.body.name || req.file.originalname, url: `/uploads/${req.file.filename}`, type: req.file.mimetype };
    student.documents.push(doc);
    await student.save();
    res.json({ success: true, data: student });
  } catch (err) { next(err); }
};
