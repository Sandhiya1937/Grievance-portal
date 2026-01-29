const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ========== FIXED CORS ==========
app.use(cors({
  origin: ["http://localhost:3000", "https://grievance-portal-1-po7a.onrender.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// ========== END FIX ==========

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ 
    message: "Grievance Portal API",
    status: "running",
    origin: req.headers.origin || "unknown"
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date(),
    origin: req.headers.origin || "unknown",
    allowedOrigins: ["http://localhost:3000", "https://grievance-portal-1-po7a.onrender.com"]
  });
});

app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working",
    origin: req.headers.origin || "unknown"
  });
});

// Import routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`🌐 Allowed origins: localhost:3000, grievance-portal-1-po7a.onrender.com`);
});