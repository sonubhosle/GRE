const crypto = require('crypto');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { generateToken, clearToken } = require('../utils/generateToken');
const { sendWelcomeEmail, sendPasswordResetEmail, sendTeacherApprovalEmail } = require('../services/emailService');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// ─── Register ─────────────────────────────────────────────────────────────────
const register = catchAsync(async (req, res) => {
    const {
        name, email, password, mobile, role,
        specialization, experience, technicalSkills,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return sendError(res, 409, 'Email already registered.');

    const allowedRoles = ['USER', 'TEACHER'];
    const userRole = allowedRoles.includes(role) ? role : 'USER';

    const userData = {
        name, email, password, mobile,
        role: userRole,
        status: userRole === 'TEACHER' ? 'pending' : 'active',
    };

    if (req.file) {
        userData.photo = { url: req.file.path, public_id: req.file.filename };
    }

    if (userRole === 'TEACHER') {
        userData.specialization = specialization;
        userData.experience = experience;
        userData.technicalSkills = Array.isArray(technicalSkills)
            ? technicalSkills
            : technicalSkills?.split(',').map((s) => s.trim()) || [];
    }

    const user = await User.create(userData);

    try { await sendWelcomeEmail(user); } catch (e) { /* non-blocking */ }

    generateToken(user._id, res);
    user.password = undefined;

    return sendSuccess(res, 201, 'Account created successfully.', { user });
});

// ─── Login ────────────────────────────────────────────────────────────────────
const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return sendError(res, 400, 'Email and password are required.');

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        return sendError(res, 401, 'Invalid email or password.');
    }

    if (user.status === 'blocked') return sendError(res, 403, 'Your account has been blocked. Contact support.');

    generateToken(user._id, res);
    user.password = undefined;

    return sendSuccess(res, 200, 'Login successful.', { user });
});

// ─── Logout ───────────────────────────────────────────────────────────────────
const logout = catchAsync(async (req, res) => {
    clearToken(res);
    return sendSuccess(res, 200, 'Logged out successfully.');
});

// ─── Get Current User ─────────────────────────────────────────────────────────
const getMe = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    return sendSuccess(res, 200, 'User fetched.', { user });
});

// ─── Forgot Password ──────────────────────────────────────────────────────────
const forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendError(res, 404, 'No user found with that email.');

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    try {
        await sendPasswordResetEmail(user, resetURL);
        return sendSuccess(res, 200, 'Password reset email sent.');
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return sendError(res, 500, 'Email could not be sent. Try again later.');
    }
});

// ─── Reset Password ──────────────────────────────────────────────────────────
const resetPassword = catchAsync(async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return sendError(res, 400, 'Token is invalid or has expired.');

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    generateToken(user._id, res);
    return sendSuccess(res, 200, 'Password reset successful. You are now logged in.');
});

module.exports = { register, login, logout, getMe, forgotPassword, resetPassword };
