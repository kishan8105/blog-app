// ============================================================
// models/User.js — USER DATABASE SCHEMA
// Defines the shape of a User document in MongoDB.
// Mongoose uses this to validate and save user data.
// ============================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,          // no two users can share an email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],  // only these two values allowed
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // auto-adds createdAt and updatedAt fields
  }
);

// ── PRE-SAVE HOOK ────────────────────────────────────────────
// Before saving a user, hash the password if it was changed.
// bcrypt converts "mypassword" → "$2a$10$xyz..." (unreadable hash)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── INSTANCE METHOD ──────────────────────────────────────────
// comparePassword: used during login to check if the entered
// password matches the stored hash.
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
