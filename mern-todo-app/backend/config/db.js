// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('MONGODB_URI is not defined in .env file');
      console.log('Current environment variables:', {
        PORT: process.env.PORT,
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not Set',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL
      });
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB with URI:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Please make sure:');
    console.log('1. MongoDB is installed and running on your machine');
    console.log('2. The .env file has correct MONGODB_URI');
    console.log('3. You have network access to MongoDB');
    process.exit(1);
  }
};

module.exports = connectDB;