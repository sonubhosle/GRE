const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
    });
};

const sendWelcomeEmail = async (user) => {
    await sendEmail({
        to: user.email,
        subject: '🎓 Welcome to EduPlatform!',
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f8fafc;border-radius:12px;">
        <h1 style="color:#6366f1;">Welcome, ${user.name}! 🎓</h1>
        <p style="color:#374151;">Your account has been successfully created on <strong>EduPlatform</strong>.</p>
        <p style="color:#374151;">Start exploring thousands of courses and level up your skills today!</p>
        <a href="${process.env.CLIENT_URL}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Explore Courses</a>
        <p style="color:#9ca3af;margin-top:24px;font-size:12px;">If you didn't create this account, please ignore this email.</p>
      </div>
    `,
    });
};

const sendEnrollmentEmail = async (user, course) => {
    await sendEmail({
        to: user.email,
        subject: `✅ Enrolled in ${course.title}`,
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f8fafc;border-radius:12px;">
        <h1 style="color:#6366f1;">Enrollment Confirmed! ✅</h1>
        <p style="color:#374151;">Hi <strong>${user.name}</strong>, you are now enrolled in:</p>
        <h2 style="color:#1e293b;">${course.title}</h2>
        <p style="color:#374151;">Start learning immediately from your dashboard.</p>
        <a href="${process.env.CLIENT_URL}/student/dashboard" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Go to My Courses</a>
      </div>
    `,
    });
};

const sendPaymentConfirmationEmail = async (user, course, payment) => {
    await sendEmail({
        to: user.email,
        subject: `💳 Payment Successful - ${course.title}`,
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f8fafc;border-radius:12px;">
        <h1 style="color:#16a34a;">Payment Successful! 💳</h1>
        <p style="color:#374151;">Hi <strong>${user.name}</strong>, your payment has been received.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr><td style="padding:8px;color:#6b7280;">Course</td><td style="padding:8px;font-weight:bold;">${course.title}</td></tr>
          <tr style="background:#f1f5f9;"><td style="padding:8px;color:#6b7280;">Amount</td><td style="padding:8px;font-weight:bold;">₹${payment.amount}</td></tr>
          <tr><td style="padding:8px;color:#6b7280;">Payment ID</td><td style="padding:8px;">${payment.razorpayPaymentId}</td></tr>
          <tr style="background:#f1f5f9;"><td style="padding:8px;color:#6b7280;">Date</td><td style="padding:8px;">${new Date().toLocaleDateString()}</td></tr>
        </table>
        <a href="${process.env.CLIENT_URL}/student/dashboard" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Start Learning</a>
      </div>
    `,
    });
};

const sendPasswordResetEmail = async (user, resetURL) => {
    await sendEmail({
        to: user.email,
        subject: '🔒 Password Reset Request',
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f8fafc;border-radius:12px;">
        <h1 style="color:#6366f1;">Password Reset 🔒</h1>
        <p style="color:#374151;">Hi <strong>${user.name}</strong>, you requested a password reset.</p>
        <p style="color:#374151;">Click the button below to reset your password. This link expires in <strong>10 minutes</strong>.</p>
        <a href="${resetURL}" style="display:inline-block;background:#ef4444;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Reset Password</a>
        <p style="color:#9ca3af;margin-top:24px;font-size:12px;">If you didn't request this, please ignore this email. Your password won't change.</p>
      </div>
    `,
    });
};

const sendTeacherApprovalEmail = async (user) => {
    await sendEmail({
        to: user.email,
        subject: '🎉 Teacher Account Approved!',
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f8fafc;border-radius:12px;">
        <h1 style="color:#6366f1;">You're Approved! 🎉</h1>
        <p style="color:#374151;">Hi <strong>${user.name}</strong>, your teacher account has been approved by the admin.</p>
        <p style="color:#374151;">You can now create and publish courses on EduPlatform.</p>
        <a href="${process.env.CLIENT_URL}/teacher/dashboard" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Go to Teacher Dashboard</a>
      </div>
    `,
    });
};

module.exports = {
    sendWelcomeEmail,
    sendEnrollmentEmail,
    sendPaymentConfirmationEmail,
    sendPasswordResetEmail,
    sendTeacherApprovalEmail,
};
