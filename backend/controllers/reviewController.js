const Review = require('../models/Review');
const Course = require('../models/Course');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── Create Review ─────────────────────────────────────────────────────────
const createReview = catchAsync(async (req, res) => {
    const { courseId, rating, comment } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return sendError(res, 404, 'Course not found.');

    // Must be enrolled
    const isEnrolled = course.enrolledStudents.includes(req.user._id);
    if (!isEnrolled) return sendError(res, 403, 'You must be enrolled to review this course.');

    // One review per user
    const existingReview = await Review.findOne({ user: req.user._id, course: courseId });
    if (existingReview) return sendError(res, 409, 'You have already reviewed this course.');

    const review = await Review.create({ user: req.user._id, course: courseId, rating, comment });
    await review.populate('user', 'name photo');

    return sendSuccess(res, 201, 'Review submitted.', { review });
});

// ─── Get Reviews by Course ─────────────────────────────────────────────────
const getCourseReviews = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const total = await Review.countDocuments({ course: req.params.courseId });
    const reviews = await Review.find({ course: req.params.courseId })
        .populate('user', 'name photo')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Reviews fetched.', {
        reviews,
        pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
});

// ─── Delete Review ─────────────────────────────────────────────────────────
const deleteReview = catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) return sendError(res, 404, 'Review not found.');

    const isOwner = review.user.toString() === req.user._id.toString();
    if (req.user.role !== 'ADMIN' && !isOwner) return sendError(res, 403, 'Not authorized.');

    await review.remove();
    return sendSuccess(res, 200, 'Review deleted.');
});

// ─── Reply to Review (teacher) ─────────────────────────────────────────────
const replyToReview = catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.id).populate('course', 'teacher');
    if (!review) return sendError(res, 404, 'Review not found.');

    const isTeacher = review.course.teacher.toString() === req.user._id.toString();
    if (!isTeacher && req.user.role !== 'ADMIN') return sendError(res, 403, 'Not authorized.');

    review.teacherReply = { message: req.body.message, repliedAt: new Date() };
    await review.save();

    return sendSuccess(res, 200, 'Reply added.', { review });
});

module.exports = { createReview, getCourseReviews, deleteReview, replyToReview };
