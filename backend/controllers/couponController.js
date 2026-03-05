const Coupon = require('../models/Coupon');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const createCoupon = catchAsync(async (req, res) => {
    const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
    return sendSuccess(res, 201, 'Coupon created.', { coupon });
});

const getAllCoupons = catchAsync(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Coupons fetched.', { coupons });
});

const updateCoupon = catchAsync(async (req, res) => {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return sendError(res, 404, 'Coupon not found.');
    return sendSuccess(res, 200, 'Coupon updated.', { coupon });
});

const deleteCoupon = catchAsync(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return sendError(res, 404, 'Coupon not found.');
    return sendSuccess(res, 200, 'Coupon deleted.');
});

const applyCoupon = catchAsync(async (req, res) => {
    const { code, coursePrice } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon || !coupon.isValid()) return sendError(res, 400, 'Invalid or expired coupon.');

    const discountAmount = (coursePrice * coupon.discountPercentage) / 100;
    const finalPrice = coursePrice - discountAmount;

    return sendSuccess(res, 200, 'Coupon applied.', {
        coupon: { code: coupon.code, discountPercentage: coupon.discountPercentage },
        discountAmount,
        finalPrice,
    });
});

module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, applyCoupon };
