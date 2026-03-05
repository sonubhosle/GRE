const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        mobile: { type: String, required: true },
        photo: {
            url: { type: String, default: '' },
            public_id: { type: String, default: '' },
        },
        role: {
            type: String,
            enum: ['USER', 'TEACHER', 'ADMIN'],
            default: 'USER',
        },
        // Teacher-specific fields
        specialization: { type: String },
        experience: { type: Number },
        technicalSkills: [{ type: String }],
        bio: { type: String },
        // Status (relevant for teachers)
        status: {
            type: String,
            enum: ['active', 'pending', 'blocked'],
            default: 'active',
        },
        // Student-specific
        enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
        // Password reset
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
