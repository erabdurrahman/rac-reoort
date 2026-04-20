const PDFDocument = require('pdfkit');

const generateRACReportPDF = (report, student, supervisor, department) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];
      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fontSize(18).font('Helvetica-Bold').text('RESEARCH ADVISORY COMMITTEE (RAC) REPORT', { align: 'center' });
      doc.fontSize(13).font('Helvetica').text('PhD Research Progress Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);

      // Student Details
      doc.fontSize(12).font('Helvetica-Bold').text('STUDENT DETAILS', { underline: true });
      doc.moveDown(0.3);
      const details = [
        ['Scholar Name', student?.name || 'N/A'],
        ['Scholar ID', student?.scholarId || 'N/A'],
        ['Registration No.', student?.registrationNo || 'N/A'],
        ['Department', department?.name || 'N/A'],
        ['Research Title', student?.researchTitle || 'N/A'],
        ['Supervisor', supervisor?.name || 'N/A'],
        ['Semester', String(student?.semester || 1)],
        ['Meeting Date', report.meetingDate ? new Date(report.meetingDate).toLocaleDateString() : 'N/A']
      ];
      details.forEach(([label, value]) => {
        doc.fontSize(10).font('Helvetica-Bold').text(`${label}: `, { continued: true }).font('Helvetica').text(value);
      });
      doc.moveDown(0.5);

      // Progress Summary
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.3);
      doc.fontSize(12).font('Helvetica-Bold').text('RESEARCH PROGRESS SUMMARY', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').text(report.progressSummary || 'No summary provided.');
      doc.moveDown(0.5);

      // Work Completed
      doc.fontSize(12).font('Helvetica-Bold').text('WORK COMPLETED');
      doc.moveDown(0.2);
      doc.fontSize(10).font('Helvetica').text(report.workCompleted || 'Not specified.');
      doc.moveDown(0.5);

      // Coursework Status
      doc.fontSize(12).font('Helvetica-Bold').text('COURSEWORK STATUS');
      doc.moveDown(0.2);
      doc.fontSize(10).font('Helvetica').text(report.courseworkStatus || 'Not specified.');
      doc.moveDown(0.5);

      // Publication Status
      doc.fontSize(12).font('Helvetica-Bold').text('PUBLICATION STATUS');
      doc.moveDown(0.2);
      doc.fontSize(10).font('Helvetica').text(report.publicationStatus || 'None.');
      doc.moveDown(0.5);

      // Next Plan
      doc.fontSize(12).font('Helvetica-Bold').text('NEXT PLAN OF WORK');
      doc.moveDown(0.2);
      doc.fontSize(10).font('Helvetica').text(report.nextPlanOfWork || 'Not specified.');
      doc.moveDown(0.5);

      // Committee Remarks
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.3);
      doc.fontSize(12).font('Helvetica-Bold').text('COMMITTEE REMARKS & RECOMMENDATION', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica-Bold').text('Remarks: ', { continued: true }).font('Helvetica').text(report.remarks || 'No remarks.');
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica-Bold').text('Recommendation: ', { continued: true }).font('Helvetica').text(
        (report.recommendation || 'satisfactory').replace('_', ' ').toUpperCase()
      );
      if (report.nextReviewDate) {
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica-Bold').text('Next Review Date: ', { continued: true })
          .font('Helvetica').text(new Date(report.nextReviewDate).toLocaleDateString());
      }
      doc.moveDown(1);

      // Signatures
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica-Bold').text('SIGNATURES', { underline: true });
      doc.moveDown(1);

      const sigY = doc.y;
      doc.fontSize(10).font('Helvetica').text('_______________________', 50, sigY);
      doc.text('Student Signature', 50, sigY + 15);
      doc.text('_______________________', 300, sigY);
      doc.text('Supervisor Signature', 300, sigY + 15);
      doc.moveDown(2);

      // Footer
      doc.fontSize(9).font('Helvetica').fillColor('gray')
        .text(`Generated on ${new Date().toLocaleDateString()} | RAC Report System`, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateRACReportPDF };
