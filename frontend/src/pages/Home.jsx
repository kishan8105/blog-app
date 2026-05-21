// ============================================================
// src/pages/Home.jsx — PUBLIC HOME PAGE (Light Mode)
// ============================================================

import { useState, useEffect } from 'react';
import api from '../api/axios';
import BlogCard from '../components/BlogCard';
import { FiSearch } from 'react-icons/fi';
import { RiSparklingLine } from 'react-icons/ri';

const CATEGORIES = ['All', 'Life', 'Thoughts & Opinions', 'Poetry', 'Travel', 'Tech', 'General'];

const Home = () => {
  const [blogs, setBlogs]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search)             params.search   = search;
        if (category !== 'All') params.category = category;
        const { data } = await api.get('/blogs', { params });
        setBlogs(data);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="min-h-screen">
      {/* ── HERO SECTION ──────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 text-sm text-nebula-500 shadow-sm">
            <RiSparklingLine className="animate-pulse" />
            <span>Welcome to Kishan's Blog</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-black text-stone-800 mb-6 leading-tight">
            Read Beyond 
            <span className="block bg-gradient-to-r from-nebula-500 via-rose-400 to-aurora-400 bg-clip-text text-transparent">
              The Universe
            </span>
          </h1>

          <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            “Step into a world where every article sparks curiosity and imagination.”
          </p>

          {/* CTA Button */}
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#blogs" className="btn-primary text-base px-8 py-3">
              Explore Blogs ↓
            </a>
          </div>
        </div>

        {/* Decorative glow orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-nebula-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-aurora-500/8 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ── BLOGS SECTION ─────────────────────────────────── */}
      <section id="blogs" className="max-w-7xl mx-auto px-4 pb-20">

        {/* Search + Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field pl-11"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  category === cat
                    ? 'bg-nebula-500 text-white shadow-md shadow-nebula-500/25'
                    : 'glass text-stone-600 hover:text-stone-800 hover:border-nebula-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-stone-800">
            {search ? `Results for "${search}"` : category !== 'All' ? category : 'Latest Posts'}
          </h2>
          <span className="text-sm text-stone-400">{blogs.length} articles</span>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass p-6 animate-pulse">
                <div className="h-4 bg-rose-100 rounded mb-3 w-1/3" />
                <div className="h-6 bg-rose-100 rounded mb-3" />
                <div className="h-4 bg-rose-100 rounded mb-2" />
                <div className="h-4 bg-rose-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl">
            <div className="text-6xl mb-4">🌌</div>
            <p className="text-stone-500 text-lg">No blogs found in this corner of the universe.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;