// Vercel Serverless entry for the Capstone API.
// The Express app is reused as-is; only the database connection is cached
// between invocations, because serverless containers are frozen rather than
// kept alive.
const mongoose = require('mongoose');
const app = require('../app');
const connectDB = require('../config/db');

async function ensureConnection() {
  if (mongoose.connection.readyState === 1) return;

  if (!global.__mongoPromise) {
    global.__mongoPromise = connectDB().catch((error) => {
      global.__mongoPromise = null;
      throw error;
    });
  }
  await global.__mongoPromise;
}

module.exports = async function handler(req, res) {
  try {
    await ensureConnection();
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
    });
    return;
  }
  return app(req, res);
};
