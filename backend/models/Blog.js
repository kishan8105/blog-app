// ============================================================
// models/Blog.js — BLOG DATABASE SCHEMA
// Defines the shape of a Blog document in MongoDB.
// Each blog links back to its author via ObjectId reference.
// ============================================================

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [20, 'Content must be at least 20 characters'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],  // array of strings, e.g. ["tech", "react"]
      default: [],
    },
    category: {
      type: String,
      default: 'General',
    },
    author: {
      // References the User model — links blog to its creator
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,   // false = public (visible to everyone)
                        // true  = private (only admin can see it)
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto-managed
  }
);

// ── TEXT INDEX ───────────────────────────────────────────────
// Allows MongoDB full-text search on title and content fields
blogSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Blog', blogSchema);