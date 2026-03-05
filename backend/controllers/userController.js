const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { generateCertificate } = require('../services/certificateService');
const cloudinary = require('../config/cloudinary');

// ─── Get Profile ───────────────────────────────────────────────────────────
const getProfile = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate('enrolledCourses', 'title thumbnail ratingsAverage');
    return sendSuccess(res, 200, 'Profile fetched.', { user });
});

// ─── Update Profile ────────────────────────────────────────────────────────
const updateProfile = catchAsync(async (req, res) => {
    const { name, mobile, specialization, experience, technicalSkills, bio } = req.body;

    const updateData = { name, mobile, specialization, experience, bio };
    if (technicalSkills) {
        updateData.technicalSkills = Array.isArray(technicalSkills)
            ? technicalSkills
            : technicalSkills.split(',').map((s) => s.trim());
    }

    if (req.file) {
        const user = await User.findById(req.user._id);
        if (user.photo?.public_id) {
            await cloudinary.uploader.destroy(user.photo.public_id);
        }
        updateData.photo = { url: req.file.path, public_id: req.file.filename };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
    return sendSuccess(res, 200, 'Profile updated.', { user });
});

// ─── Wishlist ──────────────────────────────────────────────────────────────
const getWishlist = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist', 'title thumbnail finalPrice ratingsAverage teacher');
    return sendSuccess(res, 200, 'Wishlist fetched.', { wishlist: user.wishlist });
});

const toggleWishlist = catchAsync(async (req, res) => {
    const { courseId } = req.body;
    const user = await User.findById(req.user._id);

    const isInWishlist = user.wishlist.includes(courseId);
    if (isInWishlist) {
        user.wishlist.pull(courseId);
        await user.save();
        return sendSuccess(res, 200, 'Removed from wishlist.');
    } else {
        user.wishlist.addToSet(courseId);
        await user.save();
        return sendSuccess(res, 200, 'Added to wishlist.');
    }
});

// ─── Get Enrolled Courses ──────────────────────────────────────────────────
const getEnrolledCourses = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'enrolledCourses',
        populate: { path: 'teacher', select: 'name' },
        select: 'title thumbnail duration ratingsAverage teacher',
    });

    const progresses = await Progress.find({ user: req.user._id });
    const progressMap = {};
    progresses.forEach((p) => { progressMap[p.course.toString()] = p; });

    const courses = user.enrolledCourses.map((c) => ({
        ...c.toObject(),
        progress: progressMap[c._id.toString()] || { progressPercent: 0, completed: false },
    }));

    return sendSuccess(res, 200, 'Enrolled courses fetched.', { courses });
});

// ─── Update Lesson Progress ────────────────────────────────────────────────
const updateProgress = catchAsync(async (req, res) => {
    const { courseId, lessonId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return sendError(res, 404, 'Course not found.');

    let progress = await Progress.findOne({ user: req.user._id, course: courseId });
    if (!progress) {
        progress = await Progress.create({ user: req.user._id, course: courseId });
    }

    if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
    }

    const totalLessons = course.courseVideos.length;
    progress.progressPercent = totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;
    progress.completed = progress.progressPercent >= 100;
    await progress.save();

    return sendSuccess(res, 200, 'Progress updated.', { progress });
});

// ─── Download Certificate (PDF) ────────────────────────────────────────────
const downloadCertificate = catchAsync(async (req, res) => {
    const { courseId } = req.params;

    const progress = await Progress.findOne({ user: req.user._id, course: courseId });
    if (!progress || !progress.completed) return sendError(res, 400, 'Course not yet completed.');

    const course = await Course.findById(courseId);
    if (!course) return sendError(res, 404, 'Course not found.');

    const pdfBuffer = await generateCertificate(req.user.name, course.title, progress.updatedAt);

    progress.certificateIssued = true;
    await progress.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${courseId}.pdf`);
    res.send(pdfBuffer);
});

module.exports = { getProfile, updateProfile, getWishlist, toggleWishlist, getEnrolledCourses, updateProgress, downloadCertificate };
