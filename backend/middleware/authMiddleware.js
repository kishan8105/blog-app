// ============================================================
// middleware/authMiddleware.js — JWT AUTHENTICATION GUARD
// This file exports two middleware functions:
//   protect   → blocks requests without a valid JWT token
//   adminOnly → blocks requests from non-admin users
// Both are used as middleware in route definitions.
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── protect ──────────────────────────────────────────────────
// Reads the Authorization header, verifies the JWT token,
// and attaches the logged-in user to req.user.
// If token is missing or invalid → responds with 401 Unauthorized.
const protect = async (req, res, next) => {
  let token;

  // Tokens are sent as:  Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // extract token

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (without password) to the request object
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      next(); // ✅ token valid → continue to the route handler
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ── adminOnly ────────────────────────────────────────────────
// Must be used AFTER protect middleware.
// Checks if req.user.role === 'admin', otherwise blocks access.
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // ✅ user is admin → continue
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

module.exports = { protect, adminOnly };
