const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getPublicStats = catchAsync(async (req, res) => {
    const [totalCourses, totalStudents, totalTeachers, totalCertificates] = await Promise.all([
        Course.countDocuments({ approvalStatus: 'approved' }),
        User.countDocuments({ role: 'USER' }),
        User.countDocuments({ role: 'TEACHER', status: 'active' }),
        Progress.countDocuments({ certificateIssued: true })
    ]);

    // If certificates are low, we can base it on completed progress
    const actualCertificates = totalCertificates || await Progress.countDocuments({ completed: true });

    return sendSuccess(res, 200, 'Public stats fetched.', {
        courses: totalCourses,
        students: totalStudents,
        teachers: totalTeachers,
        certificates: actualCertificates
    });
});

module.exports = { getPublicStats };
