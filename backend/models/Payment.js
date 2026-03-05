const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        status: {
            type: String,
            enum: ['created', 'paid', 'failed', 'refunded'],
            default: 'created',
        },
        paymentMethod: { type: String, default: 'razorpay' },
        couponApplied: { type: String },
        discountAmount: { type: Number, default: 0 },
        invoice: { type: String }, // invoice number
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
