// ============================================================
// routes/blogs.js — BLOG CRUD ROUTES
// GET    /api/blogs           → all published blogs (public)
// GET    /api/blogs/my        → current user's blogs (auth)
// GET    /api/blogs/all       → all blogs (admin only)
// GET    /api/blogs/:id       → single blog (public)
// POST   /api/blogs           → create blog (auth)
// PUT    /api/blogs/:id       → update blog (owner or admin)
// DELETE /api/blogs/:id       → delete blog (owner or admin)
// ============================================================

const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/authMiddleware');
// ── GET /api/blogs ───────────────────────────────────────────
// Public: returns all published, non-private blogs.
// Supports ?search=keyword and ?category=Tech query params.
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    // Always exclude private blogs from the public feed
    let filter = { isPublished: true, isPrivate: { $ne: true } };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .populate('author', 'name email');

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/blogs/my ────────────────────────────────────────
// Protected: returns blogs written by the logged-in user only.
router.get('/my', protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/blogs/all ───────────────────────────────────────
// Admin only: returns ALL blogs (published and unpublished).
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate('author', 'name email');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/blogs/:id ───────────────────────────────────────
// Public: returns a single blog by ID. Also increments view count.
// Private blogs return 403 for anyone who isn't an admin.
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // If the blog is private, only allow admins through
    if (blog.isPrivate) {
      const authHeader = req.headers.authorization;
      let isAdmin = false;
      if (authHeader && authHeader.startsWith('Bearer')) {
        try {
          const jwt     = require('jsonwebtoken');
          const User    = require('../models/User');
          const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
          const user    = await User.findById(decoded.id).select('-password');
          isAdmin = user?.role === 'admin';
        } catch { /* invalid token — treat as guest */ }
      }
      if (!isAdmin) {
        return res.status(403).json({ message: 'This blog is private' });
      }
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── POST /api/blogs ──────────────────────────────────────────
// Protected: create a new blog post.
// Body: { title, content, excerpt, tags, category, coverImage }
router.post('/', protect, adminOnly, async (req, res)  => {
  try {
    const { title, content, excerpt, tags, category, coverImage, isPrivate } = req.body;

    const blog = await Blog.create({
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      tags: tags || [],
      category: category || 'General',
      coverImage: coverImage || '',
      isPrivate: isPrivate || false,
      author: req.user._id,
      authorName: req.user.name,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── PUT /api/blogs/:id ───────────────────────────────────────
// Protected: update a blog. Only the author OR an admin can update.
router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Authorization check
    const isOwner = blog.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to edit this blog' });
    }

    const { title, content, excerpt, tags, category, coverImage, isPublished, isPrivate } = req.body;

    blog.title       = title       ?? blog.title;
    blog.content     = content     ?? blog.content;
    blog.excerpt     = excerpt     ?? blog.excerpt;
    blog.tags        = tags        ?? blog.tags;
    blog.category    = category    ?? blog.category;
    blog.coverImage  = coverImage  ?? blog.coverImage;
    blog.isPublished = isPublished ?? blog.isPublished;
    blog.isPrivate   = isPrivate   ?? blog.isPrivate;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── DELETE /api/blogs/:id ────────────────────────────────────
// Protected: delete a blog. Only the author OR an admin can delete.
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const isOwner = blog.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;