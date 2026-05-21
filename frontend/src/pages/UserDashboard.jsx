// ============================================================
// src/pages/UserDashboard.jsx — USER DASHBOARD
// Users can read all admin-published blogs (read-only).
// Admins see full CRUD controls.
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import toast from 'react-hot-toast';
import { FiBookOpen, FiEye, FiPlus } from 'react-icons/fi';
import { RiSparklingLine } from 'react-icons/ri';

const UserDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [blogs, setBlogs]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // Admins see only their own posts; regular users see ALL published blogs
      const endpoint = isAdmin ? '/blogs/my' : '/blogs';
      const { data } = await api.get(endpoint);
      setBlogs(data);
    } catch (err) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted');
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (err) {
      toast.error('Failed to delete blog');
    }
  };

  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <RiSparklingLine className="text-nebula-500 text-2xl" />
              <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800">My Dashboard</h1>
            </div>
            <p className="text-stone-500 ml-9">
              Welcome back, <span className="text-nebula-500 font-medium">{user?.name}</span>
            </p>
          </div>
          {isAdmin && (
            <Link to="/create" className="btn-primary flex items-center gap-2 self-start md:self-center">
              <FiPlus /> New Blog Post
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            { icon: <FiBookOpen className="text-2xl text-nebula-500" />, label: isAdmin ? 'My Blogs' : 'Available Blogs', value: blogs.length },
            { icon: <FiEye className="text-2xl text-aurora-500" />,     label: 'Total Views', value: totalViews },
          ].map((stat) => (
            <div key={stat.label} className="glass p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 border border-rose-100">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-800 font-display">{stat.value}</p>
                <p className="text-sm text-stone-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Blog List Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-stone-800">
            {isAdmin ? 'Your Posts' : 'Blog Posts'}
          </h2>
          <span className="text-sm text-stone-400">{blogs.length} posts</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass p-6 animate-pulse h-48">
                <div className="h-4 bg-rose-100 rounded mb-3 w-1/3" />
                <div className="h-6 bg-rose-100 rounded mb-3" />
                <div className="h-4 bg-rose-100 rounded" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <>
            {isAdmin ? (
              <div className="text-center py-20 glass rounded-2xl">
                <div className="text-6xl mb-4">✍️</div>
                <p className="text-stone-500 text-lg mb-2">You haven't written anything yet.</p>
                <p className="text-stone-400 text-sm mb-6">The universe is waiting for your words.</p>
                <Link to="/create" className="btn-primary inline-flex items-center gap-2">
                  <FiPlus /> Write Your First Blog
                </Link>
              </div>
            ) : (
              <div className="text-center py-20 glass rounded-2xl">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-stone-500 text-lg mb-2">No blogs published yet.</p>
                <p className="text-stone-400 text-sm">Check back soon — great content is on its way.</p>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {blogs.map((blog) => (
              // showActions=true only for admins — users get read-only cards
              <BlogCard key={blog._id} blog={blog} showActions={isAdmin} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;