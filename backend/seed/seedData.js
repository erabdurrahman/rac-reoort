require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const Supervisor = require('../models/Supervisor');
const Department = require('../models/Department');
const RACReport = require('../models/RACReport');
const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rac-report');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([User, Student, Supervisor, Department, RACReport, Meeting, Notification].map(M => M.deleteMany()));
    console.log('Cleared existing data');

    // Departments
    const [cs, ec, me] = await Department.create([
      { name: 'Computer Science & Engineering', code: 'CSE', description: 'Department of CSE' },
      { name: 'Electronics & Communication', code: 'ECE', description: 'Department of ECE' },
      { name: 'Mechanical Engineering', code: 'ME', description: 'Department of ME' }
    ]);
    console.log('Departments created');

    // Admin
    const admin = await User.create({ name: 'System Administrator', email: 'admin@university.edu', password: 'Admin@123', role: 'admin' });
    console.log('Admin created');

    // Supervisors
    const [sup1User, sup2User, sup3User] = await User.create([
      { name: 'Dr. Rajesh Kumar', email: 'supervisor1@university.edu', password: 'Super@123', role: 'supervisor', department: cs._id },
      { name: 'Dr. Priya Sharma', email: 'supervisor2@university.edu', password: 'Super@123', role: 'supervisor', department: ec._id },
      { name: 'Dr. Amit Singh', email: 'supervisor3@university.edu', password: 'Super@123', role: 'supervisor', department: me._id }
    ]);

    const [sup1, sup2, sup3] = await Supervisor.create([
      { userId: sup1User._id, employeeId: 'EMP001', designation: 'Professor', department: cs._id, specialization: 'Machine Learning' },
      { userId: sup2User._id, employeeId: 'EMP002', designation: 'Associate Professor', department: ec._id, specialization: 'VLSI Design' },
      { userId: sup3User._id, employeeId: 'EMP003', designation: 'Assistant Professor', department: me._id, specialization: 'Thermal Engineering' }
    ]);
    console.log('Supervisors created');

    // Students
    const studentData = [
      { name: 'Aisha Khan', email: 'student1@university.edu', dept: cs._id, supId: sup1User._id, scholarId: 'SCH001', regNo: 'PHD/CSE/2021/001', title: 'Deep Learning for Medical Image Analysis', progress: 65 },
      { name: 'Rahul Verma', email: 'student2@university.edu', dept: cs._id, supId: sup1User._id, scholarId: 'SCH002', regNo: 'PHD/CSE/2021/002', title: 'Blockchain-based IoT Security Framework', progress: 45 },
      { name: 'Sunita Patel', email: 'student3@university.edu', dept: ec._id, supId: sup2User._id, scholarId: 'SCH003', regNo: 'PHD/ECE/2022/001', title: 'Low-Power VLSI Circuit Design', progress: 30 },
      { name: 'Mohammed Ali', email: 'student4@university.edu', dept: ec._id, supId: sup2User._id, scholarId: 'SCH004', regNo: 'PHD/ECE/2022/002', title: '5G Signal Processing Algorithms', progress: 55 },
      { name: 'Neha Gupta', email: 'student5@university.edu', dept: me._id, supId: sup3User._id, scholarId: 'SCH005', regNo: 'PHD/ME/2021/001', title: 'Heat Transfer Enhancement in Nano-fluids', progress: 70 },
      { name: 'Arjun Reddy', email: 'student6@university.edu', dept: me._id, supId: sup3User._id, scholarId: 'SCH006', regNo: 'PHD/ME/2022/001', title: 'Additive Manufacturing of Composite Materials', progress: 40 }
    ];

    const studentUsers = await User.create(studentData.map(s => ({
      name: s.name, email: s.email, password: 'Student@123', role: 'student', department: s.dept
    })));

    const students = await Student.create(studentData.map((s, i) => ({
      userId: studentUsers[i]._id, scholarId: s.scholarId, registrationNo: s.regNo,
      department: s.dept, supervisorId: s.supId, researchTitle: s.title,
      semester: Math.floor(Math.random() * 6) + 1, progressPercent: s.progress,
      joiningDate: new Date(2021 + Math.floor(i / 2), 7, 1), thesisStatus: 'in_progress'
    })));
    console.log('Students created');

    // Update supervisor assigned students
    await Supervisor.findByIdAndUpdate(sup1._id, { assignedStudents: [studentUsers[0]._id, studentUsers[1]._id] });
    await Supervisor.findByIdAndUpdate(sup2._id, { assignedStudents: [studentUsers[2]._id, studentUsers[3]._id] });
    await Supervisor.findByIdAndUpdate(sup3._id, { assignedStudents: [studentUsers[4]._id, studentUsers[5]._id] });

    // RAC Reports
    const reports = await RACReport.create([
      {
        studentId: studentUsers[0]._id, supervisorId: sup1User._id, semester: 4,
        progressSummary: 'Completed literature review and developed initial CNN model for tumor detection.',
        courseworkStatus: 'All required courses completed with A grade.', publicationStatus: '1 journal paper submitted to IEEE.',
        workCompleted: 'Literature survey, dataset collection, model architecture design, initial training.',
        nextPlanOfWork: 'Improve model accuracy, conduct ablation study, prepare conference paper.',
        remarks: 'Good progress. Continue with experiments.', recommendation: 'satisfactory',
        status: 'approved', meetingDate: new Date('2024-01-15'), nextReviewDate: new Date('2024-07-15')
      },
      {
        studentId: studentUsers[1]._id, supervisorId: sup1User._id, semester: 3,
        progressSummary: 'Completed Ethereum smart contract development and security analysis.',
        courseworkStatus: 'Pending 1 elective course.', publicationStatus: 'No publications yet.',
        workCompleted: 'Smart contract prototype, vulnerability analysis, test environment setup.',
        nextPlanOfWork: 'Implement full IoT integration, performance benchmarking.',
        remarks: 'Needs to speed up. Publication expected next semester.', recommendation: 'needs_improvement',
        status: 'under_review', meetingDate: new Date('2024-02-20')
      },
      {
        studentId: studentUsers[4]._id, supervisorId: sup3User._id, semester: 5,
        progressSummary: 'Experimental results show 23% enhancement in heat transfer with Al2O3 nanofluids.',
        courseworkStatus: 'All courses completed.', publicationStatus: '2 papers published in SCI journals.',
        workCompleted: 'Experimental setup, data collection, statistical analysis, 2 publications.',
        nextPlanOfWork: 'Thesis writing, final experiments on TiO2 nanofluids.',
        remarks: 'Excellent progress. On track for timely submission.', recommendation: 'satisfactory',
        status: 'approved', meetingDate: new Date('2024-01-10'), nextReviewDate: new Date('2024-07-10')
      }
    ]);
    console.log('Reports created');

    // Meetings
    await Meeting.create([
      { title: 'RAC Meeting - Aisha Khan', studentId: studentUsers[0]._id, supervisorId: sup1User._id, scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), venue: 'Conference Room A', agenda: '6-month progress review', status: 'scheduled' },
      { title: 'RAC Meeting - Rahul Verma', studentId: studentUsers[1]._id, supervisorId: sup1User._id, scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), venue: 'Conference Room B', agenda: 'Research progress evaluation', status: 'scheduled' },
      { title: 'RAC Meeting - Sunita Patel', studentId: studentUsers[2]._id, supervisorId: sup2User._id, scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), venue: 'ECE Seminar Hall', agenda: 'Quarterly review', status: 'scheduled' }
    ]);
    console.log('Meetings created');

    // Notifications
    await Notification.create([
      { userId: studentUsers[0]._id, title: 'RAC Report Approved', message: 'Your semester 4 RAC report has been approved.', type: 'success', isRead: false },
      { userId: studentUsers[1]._id, title: 'Report Under Review', message: 'Your RAC report is currently being reviewed by your supervisor.', type: 'info', isRead: false },
      { userId: sup1User._id, title: 'New Report Submitted', message: 'Rahul Verma has submitted a new RAC report for review.', type: 'info', isRead: false },
      { userId: studentUsers[0]._id, title: 'Meeting Scheduled', message: 'Your RAC meeting has been scheduled for next week.', type: 'warning', isRead: false }
    ]);
    console.log('Notifications created');

    console.log('\n✅ Seed completed successfully!\n');
    console.log('Test credentials:');
    console.log('Admin:      admin@university.edu / Admin@123');
    console.log('Supervisor: supervisor1@university.edu / Super@123');
    console.log('Student:    student1@university.edu / Student@123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
