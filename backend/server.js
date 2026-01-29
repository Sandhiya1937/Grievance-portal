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

// ========== FIXED CORS CONFIGURATION ==========
const allowedOrigins = [
  'http://localhost:3000',  // Local development
  'https://grievance-portal-1-po7a.onrender.com',  // Your deployed frontend
  'https://grievance-portal-frontend.onrender.com'  // Common pattern
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.error('CORS blocked:', origin);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
// ========== END FIXED CORS ==========

app.use(express.json());

// ========== ADD THESE ROUTES FOR TESTING ==========
// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Grievance Portal Backend API",
    version: "1.0.0",
    status: "running",
    deployed: true,
    endpoints: {
      auth: "/api/auth",
      complaints: "/api/complaints",
      admin: "/api/admin",
      health: "/health"
    }
  });
});

// Health check endpoint (for Render monitoring)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "grievance-portal-backend",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    node: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working",
    env: {
      port: process.env.PORT,
      mongodb_uri_set: !!process.env.MONGODB_URI,
      admin_email: process.env.ADMIN_EMAIL,
      node_env: process.env.NODE_ENV || 'development'
    },
    cors: {
      allowed_origins: allowedOrigins
    }
  });
});

// Test auth endpoint
app.get("/api/auth/test", (req, res) => {
  res.json({
    message: "Auth routes are working",
    endpoints: {
      signup: "POST /api/auth/signup",
      login: "POST /api/auth/login",
      google: "POST /api/auth/google"
    }
  });
});
// ========== END ADDED ROUTES ==========

// Connect to MongoDB
console.log('Connecting to MongoDB...');
connectDB();

// Import and use routes
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

// 404 Handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
    available_routes: [
      "/",
      "/health",
      "/api/test",
      "/api/auth/test",
      "/api/auth/signup (POST)",
      "/api/auth/login (POST)",
      "/api/auth/google (POST)",
      "/api/complaints (GET, POST)",
      "/api/admin/complaints (GET)"
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` API Test: http://localhost:${PORT}/api/test`);
  console.log(` Allowed origins:`, allowedOrigins);
});