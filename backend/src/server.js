require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server only in non-serverless environments (local dev)
// Vercel uses the exported `app` directly — it doesn't call listen()
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 CampusHub Server running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}/api`);
    console.log(`🌍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });
}

// Export for Vercel serverless
module.exports = app;
