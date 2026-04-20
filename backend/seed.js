require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./src/models/User');
const Department = require('./src/models/Department');
const Student = require('./src/models/Student');
const Supervisor = require('./src/models/Supervisor');
const RACReport = require('./src/models/RACReport');
const Notification = require('./src/models/Notification');
const Meeting = require('./src/models/Meeting');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rac_report_db';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Student.deleteMany({}),
    Supervisor.deleteMany({}),
    RACReport.deleteMany({}),
    Notification.deleteMany({}),
    Meeting.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Departments
  const [csDept, eeDept] = await Department.insertMany([
    { name: 'Computer Science & Engineering', code: 'CSE', description: 'Department of Computer Science and Engineering' },
    { name: 'Electronics Engineering', code: 'EE', description: 'Department of Electronics and Electrical Engineering' },
  ]);
  console.log('✅ Departments created');

  // Admin user
  const adminUser = await User.create({
    name: 'System Administrator',
    email: 'admin@university.edu',
    password: 'Admin@123',
    role: 'admin',
    department: csDept._id,
  });
  console.log('✅ Admin user created: admin@university.edu / Admin@123');

  // Supervisor users
  const [supUser1, supUser2, supUser3] = await Promise.all([
    User.create({ name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@university.edu', password: 'Supervisor@123', role: 'supervisor', department: csDept._id }),
    User.create({ name: 'Dr. Priya Sharma', email: 'priya.sharma@university.edu', password: 'Supervisor@123', role: 'supervisor', department: csDept._id }),
    User.create({ name: 'Dr. Amit Singh', email: 'amit.singh@university.edu', password: 'Supervisor@123', role: 'supervisor', department: eeDept._id }),
  ]);
  console.log('✅ Supervisor users created');

  // Supervisor profiles
  const [sup1, sup2, sup3] = await Promise.all([
    Supervisor.create({ userId: supUser1._id, employeeId: 'EMP001', designation: 'Professor', department: csDept._id, specialization: 'Machine Learning & AI', phone: '+91-9876543210', officeLocation: 'Block A, Room 201' }),
    Supervisor.create({ userId: supUser2._id, employeeId: 'EMP002', designation: 'Associate Professor', department: csDept._id, specialization: 'Data Science & Analytics', phone: '+91-9876543211', officeLocation: 'Block A, Room 205' }),
    Supervisor.create({ userId: supUser3._id, employeeId: 'EMP003', designation: 'Assistant Professor', department: eeDept._id, specialization: 'VLSI Design & Signal Processing', phone: '+91-9876543212', officeLocation: 'Block B, Room 102' }),
  ]);
  console.log('✅ Supervisor profiles created');

  // Student users
  const studentUsersData = [
    { name: 'Arjun Mehta', email: 'arjun.mehta@student.edu', password: 'Student@123', role: 'student', department: csDept._id },
    { name: 'Kavita Patel', email: 'kavita.patel@student.edu', password: 'Student@123', role: 'student', department: csDept._id },
    { name: 'Suresh Yadav', email: 'suresh.yadav@student.edu', password: 'Student@123', role: 'student', department: csDept._id },
    { name: 'Anita Verma', email: 'anita.verma@student.edu', password: 'Student@123', role: 'student', department: eeDept._id },
    { name: 'Rohit Gupta', email: 'rohit.gupta@student.edu', password: 'Student@123', role: 'student', department: eeDept._id },
    { name: 'Meera Nair', email: 'meera.nair@student.edu', password: 'Student@123', role: 'student', department: csDept._id },
  ];
  const studentUsers = await User.insertMany(studentUsersData);
  console.log('✅ Student users created');

  // Student profiles
  const studentProfiles = await Student.insertMany([
    {
      userId: studentUsers[0]._id, scholarId: 'PHD2021CS001', registrationNo: 'REG2021001',
      department: csDept._id, researchTitle: 'Deep Learning Approaches for Natural Language Processing',
      joiningDate: new Date('2021-08-01'), supervisorId: sup1._id, semester: 5, progressPercent: 65,
      status: 'active', phone: '+91-9000001111',
      publications: [{ title: 'BERT-based Text Classification', journal: 'IEEE TNNLS', year: 2023, status: 'Published' }],
    },
    {
      userId: studentUsers[1]._id, scholarId: 'PHD2021CS002', registrationNo: 'REG2021002',
      department: csDept._id, researchTitle: 'Federated Learning for Privacy-Preserving Healthcare Analytics',
      joiningDate: new Date('2021-08-01'), supervisorId: sup1._id, semester: 5, progressPercent: 55,
      status: 'active', phone: '+91-9000002222',
    },
    {
      userId: studentUsers[2]._id, scholarId: 'PHD2022CS003', registrationNo: 'REG2022003',
      department: csDept._id, researchTitle: 'Graph Neural Networks for Social Network Analysis',
      joiningDate: new Date('2022-01-15'), supervisorId: sup2._id, semester: 3, progressPercent: 40,
      status: 'active', phone: '+91-9000003333',
    },
    {
      userId: studentUsers[3]._id, scholarId: 'PHD2021EE004', registrationNo: 'REG2021004',
      department: eeDept._id, researchTitle: 'Low Power VLSI Design for IoT Applications',
      joiningDate: new Date('2021-08-01'), supervisorId: sup3._id, semester: 5, progressPercent: 70,
      status: 'active', phone: '+91-9000004444',
      publications: [{ title: 'Energy-Efficient CMOS Circuit Design', journal: 'IEEE TCAS', year: 2023, status: 'Under Review' }],
    },
    {
      userId: studentUsers[4]._id, scholarId: 'PHD2022EE005', registrationNo: 'REG2022005',
      department: eeDept._id, researchTitle: 'Signal Processing Techniques for 5G Communications',
      joiningDate: new Date('2022-01-15'), supervisorId: sup3._id, semester: 3, progressPercent: 35,
      status: 'active', phone: '+91-9000005555',
    },
    {
      userId: studentUsers[5]._id, scholarId: 'PHD2023CS006', registrationNo: 'REG2023006',
      department: csDept._id, researchTitle: 'Explainable AI for Medical Diagnosis',
      joiningDate: new Date('2023-08-01'), supervisorId: sup2._id, semester: 1, progressPercent: 15,
      status: 'active', phone: '+91-9000006666',
    },
  ]);
  console.log('✅ Student profiles created');

  // Update supervisors with assigned students
  await Promise.all([
    Supervisor.findByIdAndUpdate(sup1._id, { assignedStudents: [studentProfiles[0]._id, studentProfiles[1]._id] }),
    Supervisor.findByIdAndUpdate(sup2._id, { assignedStudents: [studentProfiles[2]._id, studentProfiles[5]._id] }),
    Supervisor.findByIdAndUpdate(sup3._id, { assignedStudents: [studentProfiles[3]._id, studentProfiles[4]._id] }),
  ]);
  console.log('✅ Supervisor-student assignments updated');

  // RAC Reports
  const reports = await RACReport.insertMany([
    {
      studentId: studentProfiles[0]._id, supervisorId: sup1._id, semester: 4,
      meetingDate: new Date('2023-03-15'),
      progressSummary: 'The student has made significant progress in developing NLP models using transformer architectures. Literature review is complete and initial experiments have been conducted.',
      courseworkStatus: 'Completed all required coursework with CGPA 8.5',
      publicationStatus: '1 paper published in IEEE TNNLS, 1 paper under review',
      workDoneLastSemester: 'Completed implementation of BERT-based text classification model. Achieved 94% accuracy on benchmark datasets.',
      workPlanNextSemester: 'Plan to extend the model for multi-lingual NLP tasks and submit 2 more papers.',
      remarks: 'Student is performing well. Continue with planned timeline.',
      recommendation: 'continue', status: 'approved', overallGrade: 'Excellent',
      supervisorComments: 'The student demonstrates strong research aptitude and technical skills.',
    },
    {
      studentId: studentProfiles[1]._id, supervisorId: sup1._id, semester: 4,
      meetingDate: new Date('2023-03-16'),
      progressSummary: 'Progress has been moderate. The student is working on federated learning protocols for healthcare data.',
      courseworkStatus: 'Completed 80% of required coursework',
      publicationStatus: '1 paper under preparation',
      workDoneLastSemester: 'Implemented basic federated learning framework. Tested on MNIST dataset.',
      workPlanNextSemester: 'Apply framework to real healthcare datasets, complete remaining coursework.',
      remarks: 'Student needs to accelerate research pace. Focus on getting first publication.',
      recommendation: 'continue', status: 'under_review', overallGrade: 'Good',
    },
    {
      studentId: studentProfiles[3]._id, supervisorId: sup3._id, semester: 4,
      meetingDate: new Date('2023-04-10'),
      progressSummary: 'Student has designed and simulated several low-power VLSI circuits for IoT sensor nodes.',
      courseworkStatus: 'All coursework completed with CGPA 9.0',
      publicationStatus: '1 paper under review at IEEE TCAS',
      workDoneLastSemester: 'Designed 3 novel CMOS circuits with 40% power reduction compared to existing designs.',
      workPlanNextSemester: 'Fabrication of prototype circuits and comprehensive testing.',
      remarks: 'Excellent progress. Student is ahead of schedule.',
      recommendation: 'continue', status: 'approved', overallGrade: 'Excellent',
      supervisorComments: 'One of the best PhD students in the department.',
    },
    {
      studentId: studentProfiles[2]._id, supervisorId: sup2._id, semester: 2,
      meetingDate: new Date('2023-06-20'),
      progressSummary: 'Student has completed literature review and is setting up experimental infrastructure for GNN research.',
      courseworkStatus: '60% coursework completed',
      publicationStatus: 'No publications yet, 1 paper in preparation',
      workDoneLastSemester: 'Completed comprehensive literature survey covering 80+ papers on GNNs.',
      workPlanNextSemester: 'Implement baseline GNN models and begin experiments on social network datasets.',
      remarks: 'Student needs to start experimental work soon.',
      recommendation: 'continue', status: 'pending', overallGrade: 'Satisfactory',
    },
  ]);
  console.log('✅ RAC Reports created');

  // Meetings
  await Meeting.insertMany([
    {
      title: 'RAC Meeting - Arjun Mehta Semester 5',
      studentId: studentProfiles[0]._id, supervisorId: sup1._id,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      duration: 60, venue: 'Department Conference Room, Block A', mode: 'in-person',
      agenda: 'Review Semester 5 progress, publication plans, and thesis outline',
      status: 'scheduled', semester: 5, createdBy: adminUser._id,
    },
    {
      title: 'RAC Meeting - Anita Verma Semester 5',
      studentId: studentProfiles[3]._id, supervisorId: sup3._id,
      scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      duration: 90, venue: 'EE Department Seminar Hall', mode: 'in-person',
      agenda: 'Fabrication results review and patent filing discussion',
      status: 'scheduled', semester: 5, createdBy: adminUser._id,
    },
  ]);
  console.log('✅ Meetings created');

  // Notifications
  await Notification.insertMany([
    {
      userId: studentUsers[0]._id, title: 'RAC Meeting Scheduled',
      message: 'Your RAC Meeting for Semester 5 has been scheduled for next week. Please prepare your progress report.',
      type: 'info',
    },
    {
      userId: studentUsers[0]._id, title: 'Report Approved',
      message: 'Your RAC Report for Semester 4 has been approved with grade: Excellent. Congratulations!',
      type: 'success', isRead: true,
    },
    {
      userId: studentUsers[1]._id, title: 'Report Under Review',
      message: 'Your Semester 4 RAC report is currently under review by the committee.',
      type: 'info',
    },
    {
      userId: studentUsers[3]._id, title: 'Report Approved',
      message: 'Your RAC Report for Semester 4 has been approved with grade: Excellent!',
      type: 'success',
    },
    {
      userId: supUser1._id, title: 'New Report Submitted',
      message: 'Student Kavita Patel has submitted RAC report for Semester 4. Please review.',
      type: 'warning',
    },
    {
      userId: adminUser._id, title: 'System Ready',
      message: 'RAC Report System is fully initialized with seed data. Welcome!',
      type: 'success',
    },
  ]);
  console.log('✅ Notifications created');

  console.log('\n🎉 Seed data created successfully!\n');
  console.log('═══════════════════════════════════════');
  console.log('Admin Login:');
  console.log('  Email: admin@university.edu');
  console.log('  Password: Admin@123');
  console.log('\nSupervisor Logins:');
  console.log('  Email: rajesh.kumar@university.edu / Supervisor@123');
  console.log('  Email: priya.sharma@university.edu / Supervisor@123');
  console.log('  Email: amit.singh@university.edu / Supervisor@123');
  console.log('\nStudent Logins:');
  console.log('  Email: arjun.mehta@student.edu / Student@123');
  console.log('  Email: kavita.patel@student.edu / Student@123');
  console.log('  Email: anita.verma@student.edu / Student@123');
  console.log('═══════════════════════════════════════\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
