const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { sendTeacherApprovalEmail } = require('../services/emailService');
const Notification = require('../models/Notification');

// ─── Get All Users ─────────────────────────────────────────────────────────
const getAllUsers = catchAsync(async (req, res) => {
    const { role, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Users fetched.', {
        users,
        pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
});

// ─── Block/Unblock User ────────────────────────────────────────────────────
const toggleBlockUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found.');
    if (user.role === 'ADMIN') return sendError(res, 400, 'Cannot block an admin.');

    user.status = user.status === 'blocked' ? 'active' : 'blocked';
    await user.save();

    return sendSuccess(res, 200, `User ${user.status === 'blocked' ? 'blocked' : 'unblocked'}.`, { user });
});

// ─── Approve Teacher ───────────────────────────────────────────────────────
const approveTeacher = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'TEACHER') return sendError(res, 404, 'Teacher not found.');
    if (user.status === 'active') return sendError(res, 400, 'Teacher already approved.');

    user.status = 'active';
    await user.save();

    await Notification.create({
        user: user._id,
        message: 'Your teacher account has been approved! You can now create courses.',
        type: 'system',
    });

    try { await sendTeacherApprovalEmail(user); } catch (e) { }

    return sendSuccess(res, 200, 'Teacher approved.', { user });
});

// ─── Delete User ───────────────────────────────────────────────────────────
const deleteUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found.');
    if (user.role === 'ADMIN') return sendError(res, 400, 'Cannot delete an admin.');

    await User.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 200, 'User deleted.');
});

// ─── Platform Stats ────────────────────────────────────────────────────────
const getStats = catchAsync(async (req, res) => {
    const [totalUsers, totalTeachers, totalCourses, payments] = await Promise.all([
        User.countDocuments({ role: 'USER' }),
        User.countDocuments({ role: 'TEACHER' }),
        Course.countDocuments({ approvalStatus: 'approved' }),
        Payment.find({ status: 'paid' }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.aggregate([
        { $match: { status: 'paid', createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                revenue: { $sum: '$amount' },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // User growth (last 6 months)
    const userGrowth = await User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return sendSuccess(res, 200, 'Stats fetched.', {
        totalUsers, totalTeachers, totalCourses, totalRevenue,
        monthlyRevenue, userGrowth,
    });
});

// ─── Get All Courses (admin) ───────────────────────────────────────────────
const getAdminCourses = catchAsync(async (req, res) => {
    const { approvalStatus, page = 1, limit = 20 } = req.query;
    const filter = approvalStatus ? { approvalStatus } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
        .populate('teacher', 'name email')
        .populate('category', 'name')
        .skip(skip).limit(Number(limit))
        .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Courses fetched.', { courses, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
});

module.exports = { getAllUsers, toggleBlockUser, approveTeacher, deleteUser, getStats, getAdminCourses };
