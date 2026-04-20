const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const ensureUploadsDir = () => {
  const dir = path.join(process.cwd(), 'uploads', 'reports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

const generateRACReportPDF = async (reportData) => {
  return new Promise((resolve, reject) => {
    try {
      const dir = ensureUploadsDir();
      const filename = `RAC_Report_${reportData._id}_${Date.now()}.pdf`;
      const filepath = path.join(dir, filename);
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      const blue = '#1D4ED8';
      const darkBlue = '#1e3a8a';
      const lightGray = '#f8fafc';
      const gray = '#64748b';
      const pageWidth = doc.page.width - 100;

      // Header Background
      doc.rect(0, 0, doc.page.width, 120).fill(blue);

      // University Name
      doc.fillColor('white').fontSize(22).font('Helvetica-Bold')
        .text('RESEARCH ADVISORY COMMITTEE (RAC) REPORT', 50, 25, { align: 'center', width: pageWidth });
      doc.fontSize(13).font('Helvetica')
        .text('PhD Research Progress Evaluation', 50, 55, { align: 'center', width: pageWidth });
      doc.fontSize(11)
        .text(`Academic Year: ${new Date().getFullYear()} | Semester: ${reportData.semester}`, 50, 80, { align: 'center', width: pageWidth });

      doc.moveDown(3);
      doc.fillColor('#333');

      // Section helper
      const sectionHeader = (title, y) => {
        doc.rect(50, y || doc.y, pageWidth, 24).fill(darkBlue);
        doc.fillColor('white').fontSize(12).font('Helvetica-Bold')
          .text(title, 60, (y || doc.y) - 20, { width: pageWidth - 20 });
        doc.moveDown(0.3);
        doc.fillColor('#333');
      };

      const field = (label, value) => {
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#374151').text(label + ': ', { continued: true });
        doc.font('Helvetica').fillColor('#111827').text(value || 'N/A');
      };

      // Student Details
      const student = reportData.studentId || {};
      const user = student.userId || {};
      const supervisor = reportData.supervisorId || {};
      const supUser = supervisor.userId || {};
      const dept = student.department || {};

      doc.moveDown(0.5);
      sectionHeader('STUDENT INFORMATION');
      doc.moveDown(0.5);

      const col1X = 50;
      const col2X = 310;
      let currentY = doc.y;

      doc.fontSize(10);
      doc.font('Helvetica-Bold').fillColor('#374151').text('Scholar Name: ', col1X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(user.name || 'N/A');

      doc.font('Helvetica-Bold').fillColor('#374151').text('Scholar ID: ', col2X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(student.scholarId || 'N/A');

      currentY = doc.y + 5;
      doc.font('Helvetica-Bold').fillColor('#374151').text('Registration No: ', col1X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(student.registrationNo || 'N/A');

      doc.font('Helvetica-Bold').fillColor('#374151').text('Semester: ', col2X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(String(reportData.semester || 'N/A'));

      currentY = doc.y + 5;
      doc.font('Helvetica-Bold').fillColor('#374151').text('Department: ', col1X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(dept.name || 'N/A');

      doc.font('Helvetica-Bold').fillColor('#374151').text('Email: ', col2X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(user.email || 'N/A');

      currentY = doc.y + 5;
      doc.font('Helvetica-Bold').fillColor('#374151').text('Research Title: ', col1X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(student.researchTitle || 'N/A', col1X + 90, currentY, { width: pageWidth - 90 });

      doc.moveDown(1);

      // Supervisor Details
      sectionHeader('SUPERVISOR INFORMATION');
      doc.moveDown(0.5);
      currentY = doc.y;
      doc.font('Helvetica-Bold').fillColor('#374151').text('Supervisor Name: ', col1X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(supUser.name || 'N/A');
      doc.font('Helvetica-Bold').fillColor('#374151').text('Employee ID: ', col2X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(supervisor.employeeId || 'N/A');

      currentY = doc.y + 5;
      doc.font('Helvetica-Bold').fillColor('#374151').text('Designation: ', col1X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(supervisor.designation || 'N/A');
      doc.font('Helvetica-Bold').fillColor('#374151').text('Meeting Date: ', col2X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(reportData.meetingDate ? new Date(reportData.meetingDate).toLocaleDateString('en-IN') : 'N/A');

      doc.moveDown(1);

      // Progress Summary
      sectionHeader('RESEARCH PROGRESS SUMMARY');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fillColor('#111827')
        .text(reportData.progressSummary || 'No summary provided.', 50, doc.y, { width: pageWidth });

      doc.moveDown(1);

      // Work Done Last Semester
      if (reportData.workDoneLastSemester) {
        sectionHeader('WORK DONE IN LAST SEMESTER');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica').fillColor('#111827')
          .text(reportData.workDoneLastSemester, 50, doc.y, { width: pageWidth });
        doc.moveDown(1);
      }

      // Work Plan
      if (reportData.workPlanNextSemester) {
        sectionHeader('WORK PLAN FOR NEXT SEMESTER');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica').fillColor('#111827')
          .text(reportData.workPlanNextSemester, 50, doc.y, { width: pageWidth });
        doc.moveDown(1);
      }

      // Academic Status
      sectionHeader('ACADEMIC STATUS');
      doc.moveDown(0.5);
      currentY = doc.y;
      doc.font('Helvetica-Bold').fillColor('#374151').text('Coursework Status: ', col1X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(reportData.courseworkStatus || 'N/A');
      doc.font('Helvetica-Bold').fillColor('#374151').text('Publication Status: ', col2X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(reportData.publicationStatus || 'N/A');

      currentY = doc.y + 5;
      doc.font('Helvetica-Bold').fillColor('#374151').text('Overall Grade: ', col1X, currentY, { continued: true });
      doc.font('Helvetica').fillColor('#111827').text(reportData.overallGrade || 'N/A');

      doc.moveDown(1);

      // Committee Remarks
      sectionHeader('COMMITTEE REMARKS & RECOMMENDATION');
      doc.moveDown(0.5);

      if (reportData.remarks) {
        doc.font('Helvetica-Bold').fillColor('#374151').text('Remarks: ');
        doc.font('Helvetica').fillColor('#111827').text(reportData.remarks, { width: pageWidth });
        doc.moveDown(0.5);
      }

      if (reportData.supervisorComments) {
        doc.font('Helvetica-Bold').fillColor('#374151').text('Supervisor Comments: ');
        doc.font('Helvetica').fillColor('#111827').text(reportData.supervisorComments, { width: pageWidth });
        doc.moveDown(0.5);
      }

      // Recommendation Badge
      const recColors = {
        continue: '#16a34a',
        probation: '#d97706',
        terminate: '#dc2626',
        extend: '#7c3aed',
        pending: '#6b7280',
      };
      const recColor = recColors[reportData.recommendation] || '#6b7280';
      doc.font('Helvetica-Bold').fillColor('#374151').text('Recommendation: ', { continued: true });
      doc.fillColor(recColor).text((reportData.recommendation || 'PENDING').toUpperCase());

      doc.moveDown(2);

      // Check if near end of page before signatures
      if (doc.y > 650) doc.addPage();

      // Signature area
      sectionHeader('SIGNATURES');
      doc.moveDown(1);
      const sigY = doc.y;

      doc.fontSize(10).font('Helvetica').fillColor('#333');
      doc.text('_________________________', col1X, sigY);
      doc.text('Student Signature', col1X, sigY + 18);
      doc.text(user.name || '', col1X, sigY + 32, { fontSize: 9 });

      doc.text('_________________________', col2X, sigY);
      doc.text('Supervisor Signature', col2X, sigY + 18);
      doc.text(supUser.name || '', col2X, sigY + 32, { fontSize: 9 });

      doc.moveDown(3);
      const dateSignY = doc.y;
      doc.text('_________________________', col1X, dateSignY);
      doc.text('Date', col1X, dateSignY + 18);
      doc.text(new Date().toLocaleDateString('en-IN'), col1X, dateSignY + 32, { fontSize: 9 });

      doc.text('_________________________', col2X, dateSignY);
      doc.text('RAC Chairperson', col2X, dateSignY + 18);
      doc.text('Dean / HoD', col2X, dateSignY + 32, { fontSize: 9 });

      // Footer
      doc.moveDown(3);
      doc.rect(0, doc.page.height - 50, doc.page.width, 50).fill(blue);
      doc.fillColor('white').fontSize(9)
        .text(`Generated on: ${new Date().toLocaleString()} | Report ID: ${reportData._id} | Status: ${(reportData.status || '').toUpperCase()}`,
          50, doc.page.height - 35, { align: 'center', width: pageWidth });

      doc.end();

      stream.on('finish', () => {
        resolve({ filename, filepath, url: `/uploads/reports/${filename}` });
      });
      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateRACReportPDF };
