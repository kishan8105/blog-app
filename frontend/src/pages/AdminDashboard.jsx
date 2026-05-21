// ============================================================
// src/pages/AdminDashboard.jsx — ADMIN DASHBOARD (Light Mode)
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiEye, FiPlus, FiUsers, FiBookOpen, FiSearch, FiShield } from 'react-icons/fi';
import { RiSparklingLine } from 'react-icons/ri';

const AdminDashboard = () => {
  const { user }              = useAuth();
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/blogs/all');
      setBlogs(data);
    } catch (err) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllBlogs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted');
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.authorName.toLowerCase().includes(search.toLowerCase())
  );

  const uniqueAuthors = [...new Set(blogs.map((b) => b.authorName))].length;
  const totalViews    = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <FiShield className="text-amber-500 text-2xl" />
              <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800">Admin Panel</h1>
            </div>
            <p className="text-stone-500 ml-9">
              Logged in as <span className="text-amber-600 font-medium">{user?.name}</span>
              <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-mono">ADMIN</span>
            </p>
          </div>
          <Link to="/create" className="btn-primary flex items-center gap-2 self-start">
            <FiPlus /> Write New Blog
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: <FiBookOpen className="text-xl text-nebula-500" />,    label: 'Total Posts',   value: blogs.length },
            { icon: <FiUsers    className="text-xl text-aurora-500" />,    label: 'Total Authors', value: uniqueAuthors },
            { icon: <FiEye      className="text-xl text-amber-500" />,     label: 'Total Views',   value: totalViews },
            { icon: <RiSparklingLine className="text-xl text-rose-400" />, label: 'Published',     value: blogs.filter(b => b.isPublished).length },
          ].map((s) => (
            <div key={s.label} className="glass p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 border border-rose-100">{s.icon}</div>
              <div>
                <p className="text-xl font-bold text-stone-800 font-display">{s.value}</p>
                <p className="text-xs text-stone-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text" placeholder="Search by title or author..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11 max-w-md"
          />
        </div>

        {/* Blog Table */}
        <div className="glass rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-rose-200">
            <h2 className="font-display text-lg text-stone-800">All Blog Posts</h2>
            <span className="text-sm text-stone-400">{filtered.length} results</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-stone-500">
              <div className="animate-spin w-8 h-8 border-2 border-nebula-500 border-t-transparent rounded-full mx-auto mb-3" />
              Loading all blogs...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">🌌</div>
              <p className="text-stone-400">No blogs found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-stone-500 uppercase tracking-wider border-b border-rose-100 bg-rose-50/50">
                    <th className="text-left px-6 py-3 font-medium">Title</th>
                    <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Author</th>
                    <th className="text-left px-6 py-3 font-medium hidden lg:table-cell">Category</th>
                    <th className="text-left px-6 py-3 font-medium hidden lg:table-cell">Date</th>
                    <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Views</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100">
                  {filtered.map((blog) => (
                    <tr key={blog._id} className="hover:bg-rose-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-stone-800 text-sm font-medium line-clamp-1 max-w-xs group-hover:text-nebula-500 transition-colors">
                          {blog.title}
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-stone-500 text-sm">{blog.authorName}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-xs bg-nebula-500/10 text-nebula-600 px-2 py-1 rounded-full">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-stone-400 text-xs">{formatDate(blog.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-stone-500 text-sm">{blog.views}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          blog.isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/blog/${blog._id}`}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-all"
                            title="View"
                          >
                            <FiEye className="text-sm" />
                          </Link>
                          <Link
                            to={`/edit/${blog._id}`}
                            className="p-1.5 rounded-lg hover:bg-nebula-500/10 text-stone-400 hover:text-nebula-500 transition-all"
                            title="Edit"
                          >
                            <FiEdit2 className="text-sm" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-stone-400 hover:text-red-500 transition-all"
                            title="Delete"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
