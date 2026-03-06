const mongoose = require('mongoose');
const Course = require('./models/Course');
const Category = require('./models/Category');
require('dotenv').config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const courseCount = await Course.countDocuments();
        console.log(`Total Courses: ${courseCount}`);

        const courses = await Course.find().populate('category');
        courses.forEach(c => {
            console.log(`Course: ${c.title}, Category: ${c.category ? c.category.name : 'NULL (ID: ' + c.category + ')'}, Status: ${c.approvalStatus}, Published: ${c.isPublished}`);
        });

        const catCount = await Category.countDocuments();
        console.log(`Total Categories: ${catCount}`);
        const cats = await Category.find();
        cats.forEach(cat => console.log(`Cat: ${cat.name} (_id: ${cat._id})`));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
};

checkData();
