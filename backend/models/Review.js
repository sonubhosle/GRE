const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, trim: true },
        teacherReply: {
            message: { type: String },
            repliedAt: { type: Date },
        },
    },
    { timestamps: true }
);

// One review per user per course
reviewSchema.index({ user: 1, course: 1 }, { unique: true });

// Auto-update course rating stats
reviewSchema.statics.calcAverageRatings = async function (courseId) {
    const stats = await this.aggregate([
        { $match: { course: courseId } },
        {
            $group: {
                _id: '$course',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);
    const Course = require('./Course');
    if (stats.length > 0) {
        await Course.findByIdAndUpdate(courseId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating,
        });
    } else {
        await Course.findByIdAndUpdate(courseId, {
            ratingsQuantity: 0,
            ratingsAverage: 0,
        });
    }
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.course);
});

reviewSchema.post('remove', function () {
    this.constructor.calcAverageRatings(this.course);
});

module.exports = mongoose.model('Review', reviewSchema);
