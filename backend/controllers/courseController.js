const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const Progress = require('../models/Progress');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const cloudinary = require('../config/cloudinary');

// ─── Get All Courses (search, filter, paginate) ────────────────────────────
const getAllCourses = catchAsync(async (req, res) => {
    const { search, category, minPrice, maxPrice, rating, level, page = 1, limit = 12 } = req.query;

    const query = { approvalStatus: 'approved', isPublished: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (level) query.level = level;
    if (minPrice || maxPrice) {
        query.finalPrice = {};
        if (minPrice) query.finalPrice.$gte = Number(minPrice);
        if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
    }
    if (rating) query.ratingsAverage = { $gte: Number(rating) };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
        .populate('teacher', 'name photo')
        .populate('category', 'name icon')
        .skip(skip)
        .limit(Number(limit))
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

    return sendSuccess(res, 200, 'Courses fetched.', {
        courses,
        pagination: { total, page: Number(page), pages: Math.ceil(total / limit), limit: Number(limit) },
    });
});

// ─── Get Single Course ─────────────────────────────────────────────────────
const getCourse = catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id)
        .populate('teacher', 'name photo specialization experience bio')
        .populate('category', 'name icon');
    if (!course) return sendError(res, 404, 'Course not found.');
    return sendSuccess(res, 200, 'Course fetched.', { course });
});

// ─── Create Course ──────────────────────────────────────────────────────────
const createCourse = catchAsync(async (req, res) => {
    const { title, description, category, duration, price, discount, availableSeats, level, language, tags } = req.body;

    const cat = await Category.findById(category);
    if (!cat) return sendError(res, 404, 'Category not found.');

    const courseData = {
        title, description, category, duration, price,
        discount: discount || 0,
        availableSeats: availableSeats || 100,
        level: level || 'Beginner',
        language: language || 'English',
        tags: Array.isArray(tags) ? tags : tags?.split(',').map((t) => t.trim()) || [],
        teacher: req.user._id,
        approvalStatus: req.user.role === 'ADMIN' ? 'approved' : 'pending',
        isPublished: req.user.role === 'ADMIN' ? true : false,
    };

    if (req.files) {
        if (req.files.thumbnail) {
            courseData.thumbnail = {
                url: req.files.thumbnail[0].path,
                public_id: req.files.thumbnail[0].filename,
            };
        }
        if (req.files.previewVideo) {
            courseData.previewVideo = {
                url: req.files.previewVideo[0].path,
                public_id: req.files.previewVideo[0].filename,
            };
        }
    }

    const course = await Course.create(courseData);
    return sendSuccess(res, 201, 'Course created successfully.', { course });
});

// ─── Update Course ─────────────────────────────────────────────────────────
const updateCourse = catchAsync(async (req, res) => {
    let course = await Course.findById(req.params.id);
    if (!course) return sendError(res, 404, 'Course not found.');

    const isOwner = course.teacher.toString() === req.user._id.toString();
    if (req.user.role !== 'ADMIN' && !isOwner) return sendError(res, 403, 'Not authorized to update this course.');

    if (req.files?.thumbnail) {
        if (course.thumbnail?.public_id) await cloudinary.uploader.destroy(course.thumbnail.public_id);
        req.body.thumbnail = { url: req.files.thumbnail[0].path, public_id: req.files.thumbnail[0].filename };
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return sendSuccess(res, 200, 'Course updated.', { course });
});

// ─── Delete Course ─────────────────────────────────────────────────────────
const deleteCourse = catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return sendError(res, 404, 'Course not found.');

    const isOwner = course.teacher.toString() === req.user._id.toString();
    if (req.user.role !== 'ADMIN' && !isOwner) return sendError(res, 403, 'Not authorized.');

    await Course.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 200, 'Course deleted.');
});

// ─── Add Video Lesson ──────────────────────────────────────────────────────
const addLesson = catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return sendError(res, 404, 'Course not found.');

    const isOwner = course.teacher.toString() === req.user._id.toString();
    if (req.user.role !== 'ADMIN' && !isOwner) return sendError(res, 403, 'Not authorized.');

    if (!req.file) return sendError(res, 400, 'No video file uploaded.');

    course.courseVideos.push({
        title: req.body.title || 'Lesson',
        url: req.file.path,
        public_id: req.file.filename,
        order: course.courseVideos.length + 1,
    });

    await course.save();
    return sendSuccess(res, 200, 'Lesson added.', { course });
});

// ─── Add Study Material ────────────────────────────────────────────────────
const addMaterial = catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return sendError(res, 404, 'Course not found.');

    if (!req.file) return sendError(res, 400, 'No file uploaded.');

    course.studyMaterials.push({
        title: req.body.title || 'Material',
        url: req.file.path,
        public_id: req.file.filename,
        fileType: req.file.mimetype,
    });

    await course.save();
    return sendSuccess(res, 200, 'Material added.', { course });
});

// ─── Get My Courses (teacher) ───────────────────────────────────────────────
const getMyCourses = catchAsync(async (req, res) => {
    const courses = await Course.find({ teacher: req.user._id })
        .populate('category', 'name')
        .sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'courses fetched.', { courses });
});

// ─── Approve/Publish Course (admin) ────────────────────────────────────────
const approveCourse = catchAsync(async (req, res) => {
    const course = await Course.findByIdAndUpdate(
        req.params.id,
        { approvalStatus: 'approved', isPublished: true },
        { new: true }
    );
    if (!course) return sendError(res, 404, 'Course not found.');
    return sendSuccess(res, 200, 'Course approved and published.', { course });
});

module.exports = { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse, addLesson, addMaterial, getMyCourses, approveCourse };
