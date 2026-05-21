// ============================================================
// src/api/axios.js — AXIOS HTTP CLIENT CONFIGURATION
// Creates a pre-configured axios instance that:
//   1. Points to the backend base URL automatically
//   2. Attaches the JWT token to every request header
// Import this instead of plain axios everywhere in the app.
// ============================================================

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // backend URL
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor ──────────────────────────────────────
// Before every request, check localStorage for a token and
// attach it to the Authorization header automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor ─────────────────────────────────────
// If the server returns 401 (Unauthorized), clear stored
// user data and redirect to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
