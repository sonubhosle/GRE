const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const User = require('../models/User');
const Progress = require('../models/Progress');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── Teacher Dashboard Stats ───────────────────────────────────────────────
const getDashboard = catchAsync(async (req, res) => {
    const courses = await Course.find({ teacher: req.user._id });
    const courseIds = courses.map((c) => c._id);

    const payments = await Payment.find({ course: { $in: courseIds }, status: 'paid' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Total unique enrolled students
    const enrolledSet = new Set();
    courses.forEach((c) => c.enrolledStudents.forEach((s) => enrolledSet.add(s.toString())));

    // Average rating
    const avgRating = courses.length > 0
        ? (courses.reduce((sum, c) => sum + c.ratingsAverage, 0) / courses.length).toFixed(1)
        : 0;

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Payment.aggregate([
        { $match: { course: { $in: courseIds }, status: 'paid', createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                revenue: { $sum: '$amount' },
                enrollments: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Enrollment per course
    const courseStats = courses.map((c) => ({
        _id: c._id,
        title: c.title,
        enrollments: c.enrolledStudents.length,
        revenue: payments.filter((p) => p.course.toString() === c._id.toString()).reduce((s, p) => s + p.amount, 0),
        rating: c.ratingsAverage,
    }));

    return sendSuccess(res, 200, 'Dashboard fetched.', {
        totalCourses: courses.length,
        totalStudents: enrolledSet.size,
        totalRevenue,
        avgRating,
        monthlyRevenue,
        courseStats,
    });
});

module.exports = { getDashboard };
