const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if this is the admin email (your email)
    const isAdminEmail = email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
    const role = isAdminEmail ? "admin" : "user";

    console.log(`Signup for ${email}, role assigned: ${role}, Admin email: ${process.env.ADMIN_EMAIL}`);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ 
      message: "User registered successfully",
      role: user.role 
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(`Login for ${email}, role: ${user.role}`);

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { id_token } = req.body;
    
    if (!id_token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Email not found in Google token" });
    }

    // Check if this is the admin email (your email)
    const isAdminEmail = email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
    const role = isAdminEmail ? "admin" : "user";

    console.log(`Google login for ${email}, role assigned: ${role}, Admin email: ${process.env.ADMIN_EMAIL}`);

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google data
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: await bcrypt.hash(`google-${Date.now()}`, 10),
        role
      });
      console.log(`New user created via Google: ${email} as ${role}`);
    } else {
      console.log(`Existing user logged in via Google: ${email} as ${user.role}`);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ 
      message: "Google authentication failed", 
      error: error.message 
    });
  }
};