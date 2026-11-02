/*
 * Optional demo content for the portfolio.
 * Creates an admin account (if needed) plus a few projects and blog posts,
 * so the site does not look empty when you show it to someone.
 *
 * Usage: npm run seed:demo
 * Remove anything you do not want from /admin afterwards.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');

const ADMIN = {
  username: process.env.ADMIN_USERNAME || 'admin',
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'admin123456',
};

const PROJECTS = [
  {
    title: 'Capstone Portfolio & Blog',
    description:
      'Full-stack application: a React SPA on top of an Express REST API with MongoDB Atlas, JWT authentication, comments and a protected admin dashboard.',
    imageUrl:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=60',
    repoUrl: 'https://github.com/YuShanna',
    liveUrl: '',
  },
  {
    title: 'Library Management System',
    description:
      'Java + MySQL desktop application for borrowing, returning and searching books, with role-based access for librarians and readers.',
    imageUrl:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=60',
    repoUrl: 'https://github.com/YuShanna',
    liveUrl: '',
  },
  {
    title: 'Data Analysis Notebook',
    description:
      'Python notebook using pandas and matplotlib to explore public datasets, clean messy columns and visualise the findings.',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=60',
    repoUrl: '',
    liveUrl: '',
  },
];

const POSTS = [
  {
    title: 'How I built this portfolio: from Express to React',
    content:
      'This project started as a small Express exercise and grew into a complete full-stack application.\n\nThe API follows the MVC pattern: Mongoose models define and validate the data, controllers hold the logic, and thin routers wire URLs to controllers. Authentication uses bcrypt for password hashing and JSON Web Tokens for stateless sessions, with a protect middleware that verifies the token on every protected route.\n\nOn the client, React Router drives the pages, the Context API shares the authentication state, and a single axios instance attaches the JWT to every request. Building it end to end taught me how much a good data model and a consistent error format matter.',
  },
  {
    title: 'Designing a clean REST API: five rules that helped',
    content:
      'A predictable API is easier to test and easier to consume.\n\n1. One resource per route, nouns instead of verbs.\n2. Use HTTP status codes honestly: 201 for create, 400 for validation, 401 for missing or invalid tokens, 403 for authorization, 404 for unknown resources.\n3. Validate before writing to the database, and let the central error handler format every failure as { success: false, message }.\n4. Keep controllers small and move shared helpers into utils/.\n5. Never return password hashes - select: false plus an explicit projection prevents it.',
  },
];

(async () => {
  try {
    await connectDB();

    let admin = await User.findOne({ email: ADMIN.email });
    if (!admin) {
      admin = await User.create(ADMIN);
      console.log(`Admin created: ${ADMIN.email} / ${ADMIN.password}`);
    } else {
      console.log(`Reusing admin: ${ADMIN.email}`);
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(PROJECTS.map((p) => ({ ...p, user: admin._id })));
      console.log(`Created ${PROJECTS.length} demo projects`);
    } else {
      console.log(`Skipped projects (${projectCount} already exist)`);
    }

    const postCount = await BlogPost.countDocuments();
    if (postCount === 0) {
      await BlogPost.insertMany(POSTS.map((p) => ({ ...p, author: admin._id })));
      console.log(`Created ${POSTS.length} demo posts`);
    } else {
      console.log(`Skipped posts (${postCount} already exist)`);
    }

    await mongoose.disconnect();
    console.log('Done. Start the API and the client to see the content.');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
})();
