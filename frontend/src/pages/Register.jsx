// ============================================================
// src/pages/Register.jsx — REGISTRATION PAGE (Light Mode)
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { RiSparklingLine } from 'react-icons/ri';

const Register = () => {
  const [form, setForm]          = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass]  = useState(false);
  const [loading, setLoading]    = useState(false);
  const { register, isLoggedIn } = useAuth();
  const navigate                 = useNavigate();

  if (isLoggedIn) { navigate('/'); return null; }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;
    if (!name || !email || !password || !confirmPassword) return toast.error('All fields are required');
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      register(data);
      toast.success(`Account created! Welcome, ${data.name} ✨`);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-strong p-8 rounded-2xl shadow-lg shadow-rose-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-nebula-500/15 mb-4">
              <RiSparklingLine className="text-3xl text-nebula-500" />
            </div>
            <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Join the Cosmos</h1>
            <p className="text-stone-500 text-sm">Create your account and start writing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} className="input-field pl-11" />
              </div>
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className="input-field pl-11" />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPass ? 'text' : 'password'} name="password"
                  placeholder="Min. 6 characters" value={form.password} onChange={handleChange}
                  className="input-field pl-11 pr-11"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} className="input-field pl-11" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account ✨'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-nebula-500 hover:text-nebula-600 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
