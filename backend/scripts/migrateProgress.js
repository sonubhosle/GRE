const mongoose = require('mongoose');
require('dotenv').config();

const Progress = require('../models/Progress');
const User = require('../models/User');
const Course = require('../models/Course');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({ enrolledCourses: { $exists: true, $not: { $size: 0 } } });
        console.log(`Found ${users.length} users with enrollments`);

        let createdCount = 0;
        for (const user of users) {
            for (const courseId of user.enrolledCourses) {
                const existing = await Progress.findOne({ user: user._id, course: courseId });
                if (!existing) {
                    await Progress.create({ user: user._id, course: courseId });
                    createdCount++;
                }
            }
        }

        console.log(`Migration complete. Created ${createdCount} progress records.`);
        process.exit(0);
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    }
};

migrate();
