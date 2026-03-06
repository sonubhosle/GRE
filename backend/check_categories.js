const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Clear existing categories to fix the slug:null issue from failed insertMany
        console.log('Clearing existing categories...');
        await Category.deleteMany({});

        const count = await Category.countDocuments();
        console.log(`Current Category count: ${count}`);
        const categories = await Category.find();
        console.log(JSON.stringify(categories, null, 2));

        if (count === 0) {
            console.log('Seeding categories...');
            const seedData = [
                { name: 'Web Development', description: 'Master modern web technologies like React, Node.js, and more.' },
                { name: 'Data Science', description: 'Analyze data and build machine learning models.' },
                { name: 'Graphic Design', description: 'Learn UI/UX, Photoshop, Figma, and creative arts.' },
                { name: 'Software Testing', description: 'QA, Automation testing, and manual testing techniques.' },
                { name: 'Marketing', description: 'Digital marketing, SEO, and social media growth.' },
                { name: 'Business Management', description: 'Leadership, entrepreneurship, and strategy.' },
                { name: 'Personal Development', description: 'Communication, soft skills, and productivity.' }
            ];
            for (const data of seedData) {
                await Category.create(data);
            }
            console.log('Categories seeded!');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
};

checkCategories();
