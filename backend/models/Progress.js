const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        completedLessons: [{ type: String }], // lesson IDs
        progressPercent: { type: Number, default: 0 },
        completed: { type: Boolean, default: false },
        certificateIssued: { type: Boolean, default: false },
    },
    { timestamps: true }
);

progressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
