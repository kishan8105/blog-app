// ============================================================
// routes/auth.js — AUTHENTICATION ROUTES
// Handles: POST /api/auth/register  and  POST /api/auth/login
// Also:    GET  /api/auth/me  (get current logged-in user)
// ============================================================

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// ── Helper: generate a JWT token ────────────────────────────
// The token contains the user's ID and expires in 7 days.
// The frontend stores this token and sends it with every request.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ── POST /api/auth/register ──────────────────────────────────
// Creates a new user account.
// Body: { name, email, password, role? }
router.post('/register', async (req, res) => {
  try {
const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create the user (password gets hashed by the pre-save hook in User.js)
 const user = await User.create({
  name,
  email,
  password,
  role: 'user',
});
    // Respond with user info + token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────
// Logs in an existing user.
// Body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password using the method defined in User.js
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Success — return user data + JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────
// Returns the currently logged-in user's profile.
// Requires: Authorization: Bearer <token>
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
