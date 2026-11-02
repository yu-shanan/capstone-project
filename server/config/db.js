const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas.
 *
 * Both MONGODB_URI (the name used in the course lab .env) and MONGO_URI are
 * accepted, so an existing .env keeps working unchanged.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not defined. Copy .env.example to .env and add your MongoDB Atlas connection string.'
    );
  }

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;
