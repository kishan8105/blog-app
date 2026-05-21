// ============================================================
// src/context/AuthContext.jsx — GLOBAL AUTHENTICATION STATE
// React Context shares auth state (user, token, login/logout)
// across ALL components without prop drilling.
// Wrap the whole app with <AuthProvider> to make it available.
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Create the context object
const AuthContext = createContext(null);

// ── AuthProvider ─────────────────────────────────────────────
// Wraps the entire app. Provides auth state to all children.
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // checking localStorage on first load

  // On app start: restore user from localStorage (so page
  // refresh doesn't log the user out)
  useEffect(() => {
    const storedUser  = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ── login ───────────────────────────────────────────────────
  // Called after successful POST /api/auth/login
  // Saves token + user to localStorage and updates state.
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // ── register ────────────────────────────────────────────────
  // Called after successful POST /api/auth/register
  const register = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // ── logout ──────────────────────────────────────────────────
  // Clears everything from localStorage and state.
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Convenience booleans used throughout the app
  const isAdmin      = user?.role === 'admin';
  const isLoggedIn   = !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── useAuth hook ─────────────────────────────────────────────
// Custom hook — import and call useAuth() in any component
// to access the auth state and functions.
// Example: const { user, logout, isAdmin } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
