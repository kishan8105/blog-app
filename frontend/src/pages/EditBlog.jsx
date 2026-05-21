// ============================================================
// src/pages/EditBlog.jsx — EDIT EXISTING BLOG PAGE (Light Mode)
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiSave, FiX, FiTag, FiImage, FiLock, FiGlobe } from 'react-icons/fi';

const CATEGORIES = ['General', 'Life', 'Thoughts & Opinions', 'Poetry', 'Travel', 'Tech'];

const EditBlog = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [form, setForm]         = useState({ title: '', content: '', excerpt: '', category: 'General', coverImage: '', tags: [], isPrivate: false, isPublished: true });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`);
        setForm({
          title:      data.title,
          content:    data.content,
          excerpt:    data.excerpt || '',
          category:   data.category,
          coverImage: data.coverImage || '',
          tags:       data.tags || [],
          isPublished: data.isPublished !== false,
          isPrivate:   data.isPrivate || false,
        });
      } catch (err) {
        toast.error('Blog not found');
        navigate('/dashboard');
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(',', '');
      if (!form.tags.includes(newTag) && form.tags.length < 5) {
        setForm({ ...form, tags: [...form.tags, newTag] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())   return toast.error('Title is required');
    if (!form.content.trim()) return toast.error('Content is required');
    setLoading(true);
    try {
      await api.put(`/blogs/${id}`, form);
      toast.success('Blog updated successfully! ✨');
      navigate(`/blog/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-nebula-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-2">Edit Blog Post</h1>
          <p className="text-stone-500">Update your post and republish</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
          <div>
            <label className="form-label">Blog Title *</label>
            <input name="title" type="text" value={form.title} onChange={handleChange} className="input-field text-lg" />
          </div>

          <div>
            <label className="form-label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label flex items-center gap-1.5"><FiImage /> Cover Image URL</label>
            <input name="coverImage" type="url" value={form.coverImage} onChange={handleChange} className="input-field" placeholder="https://..." />
            {form.coverImage && (
              <img src={form.coverImage} alt="preview" className="mt-2 h-32 w-full object-cover rounded-xl opacity-80" onError={(e) => e.target.style.display='none'} />
            )}
          </div>

          <div>
            <label className="form-label flex items-center gap-1.5"><FiTag /> Tags</label>
            <div className="input-field min-h-12 flex flex-wrap gap-2 items-center cursor-text">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-nebula-500/15 text-nebula-600 text-xs px-2 py-1 rounded-full">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><FiX className="text-[10px]" /></button>
                </span>
              ))}
              <input
                type="text" placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="bg-transparent outline-none text-sm text-stone-700 placeholder-stone-400 flex-1 min-w-24"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Excerpt</label>
            <textarea name="excerpt" rows={2} value={form.excerpt} onChange={handleChange} className="input-field resize-none" placeholder="Short summary..." />
          </div>

          <div>
            <label className="form-label">Content *</label>
            <textarea name="content" rows={16} value={form.content} onChange={handleChange} className="input-field resize-y font-body leading-relaxed" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Published toggle */}
            <div className="flex items-center gap-3 p-4 glass rounded-xl border border-rose-200 flex-1">
              <input
                type="checkbox" id="published" checked={form.isPublished !== false}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="w-4 h-4 accent-nebula-500"
              />
              <label htmlFor="published" className="text-sm text-stone-600 cursor-pointer">
                Published (uncheck to save as draft)
              </label>
            </div>

            {/* Privacy toggle */}
            <button
              type="button"
              onClick={() => setForm({ ...form, isPrivate: !form.isPrivate })}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
                form.isPrivate
                  ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {form.isPrivate ? <FiLock /> : <FiGlobe />}
              {form.isPrivate ? 'Private — only you can see this' : 'Public — visible to everyone'}
            </button>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Saving...</>
              ) : (
                <><FiSave /> Save Changes</>
              )}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-2">
              <FiX /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;