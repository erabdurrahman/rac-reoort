const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  next();
};

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'student', 'supervisor').default('student'),
    department: Joi.string().optional(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('admin', 'student', 'supervisor').optional(),
  }),
  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),
  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),
  createStudent: Joi.object({
    userId: Joi.string().required(),
    scholarId: Joi.string().required(),
    registrationNo: Joi.string().optional(),
    department: Joi.string().optional(),
    researchTitle: Joi.string().optional(),
    joiningDate: Joi.date().optional(),
    supervisorId: Joi.string().optional(),
    semester: Joi.number().min(1).max(20).optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
  }),
  createReport: Joi.object({
    studentId: Joi.string().required(),
    supervisorId: Joi.string().optional(),
    meetingDate: Joi.date().required(),
    semester: Joi.number().required(),
    progressSummary: Joi.string().min(10).required(),
    courseworkStatus: Joi.string().optional(),
    publicationStatus: Joi.string().optional(),
    researchObjectives: Joi.string().optional(),
    workDoneLastSemester: Joi.string().optional(),
    workPlanNextSemester: Joi.string().optional(),
    remarks: Joi.string().optional(),
    recommendation: Joi.string().valid('continue', 'probation', 'terminate', 'extend', 'pending').optional(),
    committeeMembers: Joi.array().items(Joi.object({ name: Joi.string(), designation: Joi.string() })).optional(),
    overallGrade: Joi.string().valid('Satisfactory', 'Unsatisfactory', 'Excellent', 'Good', '').optional(),
  }),
  createDepartment: Joi.object({
    name: Joi.string().required(),
    code: Joi.string().optional(),
    head: Joi.string().optional(),
    description: Joi.string().optional(),
  }),
  createMeeting: Joi.object({
    title: Joi.string().required(),
    studentId: Joi.string().required(),
    supervisorId: Joi.string().optional(),
    scheduledDate: Joi.date().required(),
    duration: Joi.number().optional(),
    venue: Joi.string().optional(),
    mode: Joi.string().valid('in-person', 'online', 'hybrid').optional(),
    meetingLink: Joi.string().uri().optional().allow(''),
    agenda: Joi.string().optional(),
    semester: Joi.number().optional(),
  }),
};

module.exports = { validate, schemas };
