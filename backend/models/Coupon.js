const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        discountPercentage: { type: Number, required: true, min: 1, max: 100 },
        expiryDate: { type: Date, required: true },
        maxUsage: { type: Number, required: true },
        usedCount: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

couponSchema.methods.isValid = function () {
    return this.active && this.usedCount < this.maxUsage && new Date() < this.expiryDate;
};

module.exports = mongoose.model('Coupon', couponSchema);
