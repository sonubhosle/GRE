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
        populate: [
            { path: 'teacher', select: 'name photo' },
            { path: 'category', select: 'name' }
        ],
        select: 'title thumbnail duration ratingsAverage teacher level category courseVideos',
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
    const { courseId: bodyCourseId, lessonId, videoId } = req.body;
    const courseId = req.params.id || bodyCourseId;
    const idToMark = lessonId || videoId;

    if (!courseId) return sendError(res, 400, 'Course ID is required.');
    if (!idToMark) return sendError(res, 400, 'Lesson/Video ID is required.');

    const course = await Course.findById(courseId);
    if (!course) return sendError(res, 404, 'Course not found.');

    let progress = await Progress.findOne({ user: req.user._id, course: courseId });
    if (!progress) {
        progress = await Progress.create({ user: req.user._id, course: courseId });
    }

    if (!progress.completedLessons.includes(idToMark)) {
        progress.completedLessons.push(idToMark);
    }

    const totalLessons = course.courseVideos.length;
    progress.progressPercent = totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;
    progress.completed = progress.progressPercent >= 100;

    await progress.save();

    return sendSuccess(res, 200, 'Progress updated.', {
        progress: {
            ...progress.toObject(),
            completedVideos: progress.completedLessons // Frontend expectation
        }
    });
});

// ─── Get Progress ──────────────────────────────────────────────────────────
const getProgress = catchAsync(async (req, res) => {
    const { courseId } = req.params;

    let progress = await Progress.findOne({ user: req.user._id, course: courseId });
    if (!progress) {
        // Return blank progress if user is enrolled or is ADMIN/Owner but no progress record yet
        const user = await User.findById(req.user._id);
        const course = await Course.findById(courseId);

        const isEnrolled = user.enrolledCourses.includes(courseId);
        const isAdmin = user.role === 'ADMIN';
        const isOwner = course && course.teacher.toString() === user._id.toString();

        if (!isEnrolled && !isAdmin && !isOwner) {
            return sendError(res, 403, 'You are not enrolled in this course.');
        }

        progress = {
            progressPercent: 0,
            completedLessons: [],
            completed: false
        };
    }

    return sendSuccess(res, 200, 'Progress fetched.', {
        progress: {
            ...(progress.toObject ? progress.toObject() : progress),
            completedVideos: progress.completedLessons || []
        }
    });
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

const cancelEnrollment = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user.enrolledCourses.includes(courseId)) {
        return sendError(res, 400, 'You are not enrolled in this course.');
    }

    user.enrolledCourses.pull(courseId);
    await user.save();

    // Optionally cleanup progress or keep it? Usually cleanup if "cancel"
    await Progress.findOneAndDelete({ user: req.user._id, course: courseId });

    return sendSuccess(res, 200, 'Enrollment cancelled successfully.');
});

module.exports = { getProfile, updateProfile, getWishlist, toggleWishlist, getEnrolledCourses, updateProgress, getProgress, downloadCertificate, cancelEnrollment };
