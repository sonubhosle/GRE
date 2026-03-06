const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const approveAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await Course.updateMany(
            {},
            { $set: { approvalStatus: 'approved', isPublished: true } }
        );
        console.log(`Updated ${result.modifiedCount} courses to approved/published.`);
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
};

approveAll();
