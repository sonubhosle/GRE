const mongoose = require('mongoose');

const courseVideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String },
    duration: { type: Number, default: 0 }, // in seconds
    order: { type: Number },
});

const studyMaterialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String },
    fileType: { type: String },
});

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        thumbnail: {
            url: { type: String, default: '' },
            public_id: { type: String, default: '' },
        },
        previewVideo: {
            url: { type: String, default: '' },
            public_id: { type: String, default: '' },
        },
        courseVideos: [courseVideoSchema],
        studyMaterials: [studyMaterialSchema],
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        duration: { type: Number, default: 0 }, // total hours
        price: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0, min: 0, max: 100 }, // percentage
        finalPrice: { type: Number },
        availableSeats: { type: Number, default: 100 },
        enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        ratingsAverage: { type: Number, default: 0, min: 0, max: 5, set: (v) => Math.round(v * 10) / 10 },
        ratingsQuantity: { type: Number, default: 0 },
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
        language: { type: String, default: 'English' },
        tags: [{ type: String }],
        approvalStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        isPublished: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Text index for search
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Compute finalPrice before save
courseSchema.pre('save', function (next) {
    this.finalPrice = this.price - (this.price * this.discount) / 100;
    next();
});

module.exports = mongoose.model('Course', courseSchema);
