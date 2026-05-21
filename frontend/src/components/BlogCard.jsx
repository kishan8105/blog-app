// ============================================================
// src/components/BlogCard.jsx — BLOG PREVIEW CARD (Light Mode)
// ============================================================

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEdit2, FiTrash2, FiEye, FiClock, FiUser, FiTag, FiLock } from 'react-icons/fi';

const BlogCard = ({ blog, onDelete, showActions = false }) => {
  const { user, isAdmin } = useAuth();

  // blog.author can be either a populated object { _id, name } or a raw ObjectId string
  // depending on which endpoint fetched it — normalize to a plain string for safe comparison
  const authorId = blog.author?._id?.toString() || blog.author?.toString() || '';
  const userId   = user?._id?.toString() || '';

  const canEdit   = showActions && (authorId === userId || isAdmin);
  const canDelete = canEdit;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const truncate = (text, maxLen = 120) =>
    text?.length > maxLen ? text.substring(0, maxLen) + '...' : text;

  const categoryColors = {
    Life: 'bg-blue-100 text-blue-700',
    Thoughts:    'bg-green-100 text-green-700',
    Poetry:        'bg-pink-100 text-pink-700',
    Travel:     'bg-orange-100 text-orange-700',
    Tech:       'bg-yellow-100 text-yellow-700',
    General:    'bg-rose-100 text-rose-700',
  };
  const catClass = categoryColors[blog.category] || categoryColors.General;

  return (
    <div className="glass card-hover p-6 flex flex-col gap-4 group">

      {/* Top Row: Category + Privacy badge + Date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono px-2.5 py-1 rounded-full ${catClass}`}>
            {blog.category || 'General'}
          </span>
          {blog.isPrivate && (
            <span className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              <FiLock className="text-[10px]" /> Private
            </span>
          )}
        </div>
        <span className="text-xs text-stone-400 flex items-center gap-1">
          <FiClock className="text-xs" />
          {formatDate(blog.createdAt)}
        </span>
      </div>

      {/* Title */}
      <Link to={`/blog/${blog._id}`}>
        <h3 className="font-display text-xl font-bold text-stone-800 group-hover:text-nebula-500 transition-colors line-clamp-2 leading-snug">
          {blog.title}
        </h3>
      </Link>

      {/* Excerpt */}
      <p className="text-stone-500 text-sm leading-relaxed flex-1">
        {truncate(blog.excerpt || blog.content)}
      </p>

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {blog.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs flex items-center gap-1 text-stone-400 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              <FiTag className="text-[10px]" />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Row: Author + Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-rose-100">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-nebula-500/20 flex items-center justify-center">
            <FiUser className="text-xs text-nebula-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-stone-600">{blog.authorName}</p>
            <p className="text-[10px] text-stone-400 flex items-center gap-1">
              <FiEye className="text-[10px]" /> {blog.views || 0} views
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Link
            to={`/blog/${blog._id}`}
            className="text-xs text-nebula-500 hover:text-nebula-600 flex items-center gap-1 transition-colors font-medium"
          >
            <FiEye className="text-xs" /> Read
          </Link>

          {canEdit && (
            <Link
              to={`/edit/${blog._id}`}
              className="p-1.5 rounded-lg bg-rose-50 hover:bg-nebula-500/10 text-stone-400 hover:text-nebula-500 transition-all border border-rose-100"
              title="Edit"
            >
              <FiEdit2 className="text-sm" />
            </Link>
          )}

          {canDelete && (
            <button
              onClick={() => onDelete && onDelete(blog._id)}
              className="p-1.5 rounded-lg bg-rose-50 hover:bg-red-100 text-stone-400 hover:text-red-500 transition-all border border-rose-100"
              title="Delete"
            >
              <FiTrash2 className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;