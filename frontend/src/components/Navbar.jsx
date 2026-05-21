// ============================================================
// src/components/Navbar.jsx — TOP NAVIGATION BAR
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMenu, FiX, FiEdit3, FiLogOut, FiUser, FiShield, FiSun, FiMoon } from 'react-icons/fi';
import { RiSparklingLine } from 'react-icons/ri';

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Dark mode — persisted in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive(path) ? 'text-nebula-500' : 'text-stone-600 hover:text-stone-900'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 page-content">
      <div className="glass border-b border-rose-200/60 rounded-none shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <RiSparklingLine className="text-nebula-500 text-2xl group-hover:animate-spin transition-all" />
              <span className="font-display text-xl font-bold text-stone-800">
                KISHAN's<span className="text-nebula-500"> BLOG</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className={linkClass('/')}>Home</Link>
              {isLoggedIn && (
                <>
                  {isAdmin ? (
                    <Link to="/admin" className={linkClass('/admin')}>
                      <span className="flex items-center gap-1"><FiShield className="text-xs" /> Admin Panel</span>
                    </Link>
                  ) : (
                    <Link to="/dashboard" className={linkClass('/dashboard')}>
                      <span className="flex items-center gap-1"><FiUser className="text-xs" /> Dashboard</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link to="/create" className={linkClass('/create')}>
                      <span className="flex items-center gap-1"><FiEdit3 className="text-xs" /> Write</span>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Desktop Auth + Dark Mode Toggle */}
            <div className="hidden md:flex items-center gap-3">

              {/* Dark / Light Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
                className="w-9 h-9 flex items-center justify-center rounded-xl glass border border-rose-200/60 dark:border-stone-600/60 text-stone-600 dark:text-stone-300 hover:text-nebula-500 dark:hover:text-nebula-400 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                    <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-stardust-400' : 'bg-aurora-400'}`} />
                    <span className="text-sm text-stone-700">{user?.name}</span>
                    {isAdmin && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-mono">ADMIN</span>
                    )}
                  </div>
                  <button onClick={handleLogout} className="btn-ghost text-sm flex items-center gap-1.5 px-4 py-2">
                    <FiLogOut className="text-sm" /> Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost text-sm px-4 py-2">Login</Link>
                  <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
                </>
              )}
            </div>

            {/* Mobile: Dark Toggle + Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
                className="w-9 h-9 flex items-center justify-center rounded-xl glass border border-rose-200/60 dark:border-stone-600/60 text-stone-600 dark:text-stone-300 hover:text-nebula-500 transition-all duration-200"
              >
                {darkMode ? <FiSun size={15} /> : <FiMoon size={15} />}
              </button>
              <button className="text-stone-700 dark:text-stone-300 p-2" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass-strong border-t border-rose-200/50 px-4 pb-4 space-y-3 animate-slide-up">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-stone-600 hover:text-stone-900">Home</Link>
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-stone-600 hover:text-stone-900">Admin Panel</Link>
                ) : (
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-stone-600 hover:text-stone-900">Dashboard</Link>
                )}
                {isAdmin && (
                  <Link to="/create" onClick={() => setMenuOpen(false)} className="block py-2 text-stone-600 hover:text-stone-900">Write Blog</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left py-2 text-red-500 hover:text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-stone-600 hover:text-stone-900">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-stone-600 hover:text-stone-900">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;