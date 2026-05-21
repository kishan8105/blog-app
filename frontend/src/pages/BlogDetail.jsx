// ============================================================
// src/pages/BlogDetail.jsx — SINGLE BLOG POST VIEW (Light Mode)
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiArrowLeft, FiEye, FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import { RiSparklingLine } from 'react-icons/ri';

const BlogDetail = () => {
  const { id }            = useParams();
  const navigate          = useNavigate();
  const { user, isAdmin } = useAuth();
  const [blog, setBlog]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        toast.error('Blog not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const authorId = blog?.author?._id || blog?.author;
  const canModify = user && (authorId === user._id || isAdmin);

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-2 border-nebula-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-stone-500">Loading post...</p>
      </div>
    </div>
  );

  if (!blog) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto animate-fade-in">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 text-sm mb-8 transition-colors group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-md">
            <img
              src={blog.coverImage} alt={blog.title}
              className="w-full h-64 md:h-80 object-cover"
              onError={(e) => e.target.parentElement.style.display = 'none'}
            />
          </div>
        )}

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-xs bg-nebula-500/15 text-nebula-600 px-3 py-1 rounded-full font-mono">
            {blog.category}
          </span>
          <span className="text-stone-400 text-xs flex items-center gap-1">
            <FiCalendar className="text-[11px]" /> {formatDate(blog.createdAt)}
          </span>
          <span className="text-stone-400 text-xs flex items-center gap-1">
            <FiEye className="text-[11px]" /> {blog.views} views
          </span>
          {blog.updatedAt !== blog.createdAt && (
            <span className="text-stone-400 text-xs">Updated {formatDate(blog.updatedAt)}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-5xl font-black text-stone-800 leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Author + Actions */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-rose-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-nebula-500/20 flex items-center justify-center">
              <FiUser className="text-nebula-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-700">{blog.authorName}</p>
              <p className="text-xs text-stone-400">Author</p>
            </div>
          </div>

          {canModify && (
            <div className="flex items-center gap-2">
              <Link to={`/edit/${blog._id}`} className="flex items-center gap-1.5 btn-ghost text-sm px-3 py-2">
                <FiEdit2 className="text-sm" /> Edit
              </Link>
              <button onClick={handleDelete} className="btn-danger flex items-center gap-1.5 text-sm">
                <FiTrash2 className="text-sm" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="blog-prose whitespace-pre-wrap mb-10">
          {blog.content}
        </div>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-8 border-t border-rose-200">
            <span className="text-stone-400 text-sm flex items-center gap-1 mr-2">
              <FiTag className="text-xs" /> Tags:
            </span>
            {blog.tags.map((tag) => (
              <span key={tag} className="text-sm bg-rose-50 hover:bg-rose-100 text-stone-500 px-3 py-1 rounded-full transition-colors cursor-default border border-rose-100">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 p-6 glass rounded-2xl text-center">
          <RiSparklingLine className="text-nebula-500 text-2xl mx-auto mb-3" />
          <p className="text-stone-600 mb-4">Enjoyed this post? Explore more stories from the cosmos.</p>
          <Link to="/" className="btn-ghost text-sm">← Back to All Posts</Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
