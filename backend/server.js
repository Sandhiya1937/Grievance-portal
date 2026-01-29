// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables FIRST
console.log('Loading environment variables...');
dotenv.config();

// Debug: Check if .env is loaded
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'NOT SET!');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not Set');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

// Check required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'GOOGLE_CLIENT_ID'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file');
  process.exit(1);
}

const connectDB = require("./config/db");

const app = express();

// Enable CORS with specific options
app.use(cors({
  origin: "http://localhost:3000", // Your React app URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working",
    env: {
      port: process.env.PORT,
      mongodb_uri_set: !!process.env.MONGODB_URI,
      admin_email: process.env.ADMIN_EMAIL
    }
  });
});

// Connect to MongoDB
console.log('Connecting to MongoDB...');
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);