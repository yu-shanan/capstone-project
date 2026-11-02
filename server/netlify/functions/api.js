// Netlify Functions entry for the Capstone API.
// Express is wrapped with serverless-http; the Mongo connection is cached
// between warm invocations.
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../../app');
const connectDB = require('../../config/db');

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

const wrapped = serverless(app);

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await ensureConnection();
  } catch (error) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Database connection failed' }),
    };
  }
  return wrapped(event, context);
};
