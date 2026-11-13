const mongoose = require('mongoose');

// Cache the connection across serverless invocations.
// Without this, every cold-start would open a brand-new connection to MongoDB.
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('[Database] Using existing MongoDB connection.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Recommended settings for serverless environments
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    console.error('Please verify your MONGODB_URI environment variable.');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
