const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'sbhosle1011@gmail.com' }); // From earlier context
        if (user) {
            console.log(`User: ${user.name}, Role: ${user.role}, Status: ${user.status}`);
        } else {
            console.log('User not found');
            const allUsers = await User.find();
            allUsers.forEach(u => console.log(`User: ${u.name}, Email: ${u.email}, Role: ${u.role}`));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
};

checkUser();
