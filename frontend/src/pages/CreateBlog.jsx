// ============================================================
// src/pages/CreateBlog.jsx — CREATE NEW BLOG PAGE (Light Mode)
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiSend, FiImage, FiTag, FiX, FiLock, FiGlobe } from 'react-icons/fi';

const CATEGORIES = ['General', 'Life', 'Thoughts & Opinions', 'Poetry', 'Travel', 'Tech'];

const CreateBlog = () => {
  const navigate  = useNavigate();
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', category: 'General', coverImage: '', tags: [], isPrivate: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading]   = useState(false);
  const [preview, setPreview]   = useState(false);

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
    if (form.content.length < 20) return toast.error('Content is too short');
    setLoading(true);
    try {
      const { data } = await api.post('/blogs', form);
      toast.success('Blog published! ✨');
      navigate(`/blog/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-2">Write a New Post</h1>
          <p className="text-stone-500">Share your thoughts with the cosmos</p>
        </div>

        {/* Toggle Preview */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setPreview(false)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !preview ? 'bg-nebula-500 text-white shadow-md' : 'glass text-stone-500 hover:text-stone-800'
            }`}
          >Edit</button>
          <button
            onClick={() => setPreview(true)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              preview ? 'bg-nebula-500 text-white shadow-md' : 'glass text-stone-500 hover:text-stone-800'
            }`}
          >Preview</button>
        </div>

        {preview ? (
          /* PREVIEW MODE */
          <div className="glass p-8 rounded-2xl animate-fade-in shadow-sm">
            {form.coverImage && (
              <img src={form.coverImage} alt="Cover" className="w-full h-56 object-cover rounded-xl mb-6" onError={(e) => e.target.style.display='none'} />
            )}
            <span className="text-xs bg-nebula-500/15 text-nebula-600 px-2 py-1 rounded-full font-mono">{form.category}</span>
            <h1 className="font-display text-3xl font-bold text-stone-800 mt-4 mb-2">{form.title || 'Your Title Here'}</h1>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {form.tags.map(t => (
                <span key={t} className="text-xs bg-rose-50 text-stone-500 px-2 py-0.5 rounded-full border border-rose-100">#{t}</span>
              ))}
            </div>
            <div className="blog-prose whitespace-pre-wrap">{form.content || 'Your content will appear here...'}</div>
          </div>
        ) : (
          /* EDIT FORM */
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
            <div>
              <label className="form-label">Blog Title *</label>
              <input
                name="title" type="text" placeholder="An Unforgettable Title..."
                value={form.title} onChange={handleChange}
                className="input-field text-lg"
              />
            </div>

            <div>
              <label className="form-label">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label flex items-center gap-1.5"><FiImage /> Cover Image URL (optional)</label>
              <input
                name="coverImage" type="url" placeholder="https://example.com/image.jpg"
                value={form.coverImage} onChange={handleChange}
                className="input-field"
              />
              {form.coverImage && (
                <img src={form.coverImage} alt="preview" className="mt-2 h-32 w-full object-cover rounded-xl opacity-80" onError={(e) => e.target.style.display='none'} />
              )}
            </div>

            <div>
              <label className="form-label flex items-center gap-1.5"><FiTag /> Tags (press Enter to add, max 5)</label>
              <div className="input-field min-h-12 flex flex-wrap gap-2 items-center cursor-text" onClick={() => document.getElementById('tag-input').focus()}>
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 bg-nebula-500/15 text-nebula-600 text-xs px-2 py-1 rounded-full">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors"><FiX className="text-[10px]" /></button>
                  </span>
                ))}
                <input
                  id="tag-input" type="text" placeholder={form.tags.length < 5 ? 'Add tag...' : ''}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="bg-transparent outline-none text-sm text-stone-700 placeholder-stone-400 flex-1 min-w-24"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Excerpt (optional — short summary shown in cards)</label>
              <textarea
                name="excerpt" rows={2} placeholder="A brief summary of your post..."
                value={form.excerpt} onChange={handleChange}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="form-label">Content *</label>
              <textarea
                name="content" rows={16}
                placeholder={"Write your blog here...\n\nYou can use paragraphs, and line breaks to format your post."}
                value={form.content} onChange={handleChange}
                className="input-field resize-y font-body leading-relaxed"
              />
              <p className="text-xs text-stone-400 mt-1">{form.content.length} characters</p>
            </div>

            <div className="flex gap-4 pt-2">
              {/* Privacy Toggle */}
              <button
                type="button"
                onClick={() => setForm({ ...form, isPrivate: !form.isPrivate })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  form.isPrivate
                    ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {form.isPrivate ? <FiLock className="text-sm" /> : <FiGlobe className="text-sm" />}
                {form.isPrivate ? 'Private' : 'Public'}
              </button>

              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
                {loading ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Publishing...</>
                ) : (
                  <><FiSend /> Publish Post</>
                )}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;