// ============================================================
// server.js — MAIN ENTRY POINT OF THE BACKEND
// This file starts the Express server, connects to MongoDB,
// and registers all API routes.
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// ── MIDDLEWARE ──────────────────────────────────────────────
// cors: allows the React frontend (port 5173) to talk to this
//       backend (port 5000) without browser blocking it.
app.use(cors({
  origin: 'https://blog-app-1-0g0o.onrender.com',
  credentials: true
}));

// express.json: lets Express read JSON bodies from requests
app.use(express.json());

// ── ROUTES ──────────────────────────────────────────────────
// Mount auth routes  → /api/auth/register, /api/auth/login
// Mount blog routes  → /api/blogs (CRUD)
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/blogs', require('./routes/blogs'));

// ── HEALTH CHECK ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 Blog API is running!' });
});

// ── DATABASE + SERVER START ──────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
