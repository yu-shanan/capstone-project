/*
 * Create a demo admin account (optional).
 * Usage: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const ADMIN = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123456',
};

(async () => {
  try {
    await connectDB();
    const exists = await User.findOne({ email: ADMIN.email });
    if (exists) {
      console.log('Admin already exists:', ADMIN.email);
    } else {
      await User.create(ADMIN);
      console.log('Admin created:', ADMIN.email, 'password:', ADMIN.password);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
})();
