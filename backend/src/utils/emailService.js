const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"RAC Report System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error.message);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to RAC Report System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1D4ED8; color: white; padding: 20px; text-align: center;">
          <h1>Welcome to RAC Report System</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${user.name},</p>
          <p>Your account has been created successfully. You can now log in using your credentials.</p>
          <p><strong>Role:</strong> ${user.role}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p>Please contact your administrator if you face any issues.</p>
        </div>
        <div style="background: #f3f4f6; padding: 10px; text-align: center; font-size: 12px;">
          <p>RAC Report System &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
    `,
  });
};

const sendReportNotificationEmail = async (user, report) => {
  return sendEmail({
    to: user.email,
    subject: 'RAC Report Status Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1D4ED8; color: white; padding: 20px; text-align: center;">
          <h1>Report Status Update</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${user.name},</p>
          <p>Your RAC Report has been updated.</p>
          <p><strong>Status:</strong> ${report.status}</p>
          <p><strong>Semester:</strong> ${report.semester}</p>
          ${report.remarks ? `<p><strong>Remarks:</strong> ${report.remarks}</p>` : ''}
        </div>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  return sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1D4ED8; color: white; padding: 20px; text-align: center;">
          <h1>Password Reset</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${user.name},</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #1D4ED8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendWelcomeEmail, sendReportNotificationEmail, sendPasswordResetEmail };
