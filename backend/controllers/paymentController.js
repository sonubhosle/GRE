const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { sendEnrollmentEmail, sendPaymentConfirmationEmail } = require('../services/emailService');

const razorpay = new Razorpay({
    key_id: "rzp_test_GR8VGnp5RV96I3",
    key_secret: "sNYYdi29SUE4PB7jGtZaP7gl"
});

// ─── Create Order ──────────────────────────────────────────────────────────
const createOrder = catchAsync(async (req, res) => {
    const { courseId, couponCode } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return sendError(res, 404, 'Course not found.');
    if (!course.isPublished || course.approvalStatus !== 'approved') return sendError(res, 400, 'Course not available.');

    // Prevent duplicate enrollment
    const alreadyEnrolled = course.enrolledStudents.includes(req.user._id);
    if (alreadyEnrolled) return sendError(res, 400, 'You are already enrolled in this course.');

    let amount = course.finalPrice || course.price;
    let discountAmount = 0;
    let couponApplied = null;

    // Apply coupon
    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (!coupon || !coupon.isValid()) return sendError(res, 400, 'Invalid or expired coupon.');
        discountAmount = (amount * coupon.discountPercentage) / 100;
        amount = amount - discountAmount;
        couponApplied = coupon.code;
    }

    const amountInPaise = Math.round(amount * 100);
    if (amountInPaise < 1) return sendError(res, 400, 'Payment amount too low.');

    const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: { courseId: courseId.toString(), userId: req.user._id.toString() },
    });

    // Store pending payment
    const payment = await Payment.create({
        user: req.user._id,
        course: courseId,
        amount: amount,
        razorpayOrderId: order.id,
        couponApplied,
        discountAmount,
        status: 'created',
    });

    return sendSuccess(res, 200, 'Order created.', {
        order,
        key: process.env.RAZORPAY_KEY_ID,
        payment: { id: payment._id, amount, original: course.finalPrice },
    });
});

// ─── Verify Payment ────────────────────────────────────────────────────────
const verifyPayment = catchAsync(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        await Payment.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: 'failed' });
        return sendError(res, 400, 'Payment verification failed. Invalid signature.');
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: 'paid' },
        { new: true }
    );

    // Enroll student
    const course = await Course.findById(courseId);
    if (!course.enrolledStudents.includes(req.user._id)) {
        course.enrolledStudents.push(req.user._id);
        await course.save();
    }

    // Update user enrolledCourses
    await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { enrolledCourses: courseId },
        $pull: { wishlist: courseId },
    });

    // Increment coupon usage
    if (payment.couponApplied) {
        await Coupon.findOneAndUpdate({ code: payment.couponApplied }, { $inc: { usedCount: 1 } });
    }

    // Create notification
    await Notification.create({
        user: req.user._id,
        message: `You have successfully enrolled in "${course.title}"`,
        type: 'enrollment',
        link: `/course/${courseId}`,
    });

    // Send emails
    try {
        await sendEnrollmentEmail(req.user, course);
        await sendPaymentConfirmationEmail(req.user, course, payment);
    } catch (e) { }

    return sendSuccess(res, 200, 'Payment verified. Enrollment successful.', { payment });
});

// ─── Get Payment History (student) ────────────────────────────────────────
const getMyPayments = catchAsync(async (req, res) => {
    const payments = await Payment.find({ user: req.user._id, status: 'paid' })
        .populate('course', 'title thumbnail')
        .sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Payment history fetched.', { payments });
});

// ─── Get All Payments (admin) ──────────────────────────────────────────────
const getAllPayments = catchAsync(async (req, res) => {
    const payments = await Payment.find({ status: 'paid' })
        .populate('user', 'name email')
        .populate('course', 'title')
        .sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'All payments fetched.', { payments });
});

module.exports = { createOrder, verifyPayment, getMyPayments, getAllPayments };
