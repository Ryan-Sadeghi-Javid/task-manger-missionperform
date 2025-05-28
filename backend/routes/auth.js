// backend/routes/auth.js

// Import necessary modules
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Create an Express router instance
const router = express.Router();

// Utility function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route   POST /auth/register
// @desc    Register a new user and return a JWT token
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create a new user (password is hashed in the model pre-save hook)
    const newUser = await User.create({ username, password });

    // Generate JWT for the newly registered user
    const token = generateToken(newUser._id);

    // Return the user and token to the client
    res.status(201).json({
      user: { id: newUser._id, username: newUser.username },
      token,
    });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /auth/login
// @desc    Authenticate user and return a JWT token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // Check if user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token for the authenticated user
    const token = generateToken(user._id);

    // Return the user and token
    res.json({ user: { id: user._id, username: user.username }, token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Export the router to be used in server.js
module.exports = router;