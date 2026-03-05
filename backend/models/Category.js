const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        description: { type: String },
        icon: { type: String },
        slug: { type: String, unique: true },
    },
    { timestamps: true }
);

categorySchema.pre('save', function (next) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    next();
});

module.exports = mongoose.model('Category', categorySchema);
