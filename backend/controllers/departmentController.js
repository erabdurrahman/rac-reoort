const Department = require('../models/Department');
const User = require('../models/User');
const Student = require('../models/Student');

exports.getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate('head', 'name email').sort('name');
    res.json({ success: true, count: departments.length, data: departments });
  } catch (err) { next(err); }
};

exports.getDepartmentById = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id).populate('head', 'name email');
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, data: dept });
  } catch (err) { next(err); }
};

exports.createDepartment = async (req, res, next) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, data: dept });
  } catch (err) { next(err); }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, data: dept });
  } catch (err) { next(err); }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    res.json({ success: true, message: 'Department deleted' });
  } catch (err) { next(err); }
};

exports.getDepartmentStats = async (req, res, next) => {
  try {
    const departments = await Department.find();
    const stats = await Promise.all(departments.map(async (dept) => {
      const [studentCount, supervisorCount] = await Promise.all([
        Student.countDocuments({ department: dept._id }),
        User.countDocuments({ department: dept._id, role: 'supervisor' })
      ]);
      return { department: dept.name, code: dept.code, studentCount, supervisorCount };
    }));
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};
