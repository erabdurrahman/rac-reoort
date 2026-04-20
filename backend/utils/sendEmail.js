const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"RAC Report System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

const sendPasswordResetEmail = async (email, resetUrl) => {
  await sendEmail({
    to: email,
    subject: 'Password Reset - RAC Report System',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#2563eb;">RAC Report System</h2>
      <p>You requested a password reset. Click the button below:</p>
      <a href="${resetUrl}" style="background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin:16px 0;">Reset Password</a>
      <p>This link expires in 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    </div>`
  });
};

const sendWelcomeEmail = async (name, email) => {
  await sendEmail({
    to: email,
    subject: 'Welcome to RAC Report System',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#2563eb;">Welcome, ${name}!</h2>
      <p>Your account has been created in the RAC Report System.</p>
      <p>You can now log in to access your dashboard.</p>
    </div>`
  });
};

const sendRACReminderEmail = async (studentEmail, studentName, meetingDate) => {
  await sendEmail({
    to: studentEmail,
    subject: 'RAC Meeting Reminder',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#2563eb;">RAC Meeting Reminder</h2>
      <p>Dear ${studentName},</p>
      <p>Your RAC meeting is scheduled on <strong>${new Date(meetingDate).toLocaleDateString()}</strong>.</p>
      <p>Please ensure your progress report is submitted before the meeting.</p>
    </div>`
  });
};

const sendReportStatusEmail = async (email, name, status) => {
  const statusMessages = {
    approved: 'Your RAC report has been approved. Congratulations!',
    rejected: 'Your RAC report has been rejected. Please check the remarks and resubmit.',
    revision_requested: 'Your RAC report requires revision. Please check the remarks.'
  };
  await sendEmail({
    to: email,
    subject: `RAC Report ${status.replace('_', ' ').toUpperCase()}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#2563eb;">RAC Report Update</h2>
      <p>Dear ${name},</p>
      <p>${statusMessages[status] || `Your report status has been updated to: ${status}`}</p>
    </div>`
  });
};

module.exports = { sendEmail, sendPasswordResetEmail, sendWelcomeEmail, sendRACReminderEmail, sendReportStatusEmail };
