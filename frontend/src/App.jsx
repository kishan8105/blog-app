// ============================================================
// src/App.jsx — ROOT COMPONENT & ROUTER
// Sets up ALL page routes using React Router v6.
// Wraps everything in AuthProvider so auth state is global.
// Uses ProtectedRoute to guard pages that need login.
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogDetail from './pages/BlogDetail';

// ── ProtectedRoute ───────────────────────────────────────────
// Wraps pages that require login. If user is not logged in,
// redirects to /login. If adminOnly=true and user is not admin,
// redirects to /dashboard.
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-600">Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

// ── AppRoutes ────────────────────────────────────────────────
// Separated so it can access AuthProvider context via useAuth.
const AppRoutes = () => {
  return (
    <div className="min-h-screen">
      {/* Three.js animated starfield — fixed background */}
      <ThreeBackground />

      {/* Top navigation bar */}
      <Navbar />

      {/* Page routes — all rendered inside .page-content */}
      <div className="page-content">
        <Routes>
          {/* Public routes — anyone can visit */}
          <Route path="/"            element={<Home />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/blog/:id"    element={<BlogDetail />} />

          {/* Protected: logged-in users */}
          <Route path="/dashboard" element={
            <ProtectedRoute><UserDashboard /></ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute  adminOnly={true}><CreateBlog /></ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute adminOnly={true}> <CreateBlog/> <EditBlog /></ProtectedRoute>
          } />

          {/* Protected: admin only */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
          } />

          {/* Catch-all: redirect unknown URLs to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

// ── App ──────────────────────────────────────────────────────
// Top-level component. Wraps AppRoutes with AuthProvider.
const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
