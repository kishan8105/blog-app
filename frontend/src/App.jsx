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

// Logged-in nahi = /login pe bhejo
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-600">Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

// Already logged-in = / pe bhejo (login/register page mat dikhao)
const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-600">Loading...</div>;
  if (isLoggedIn) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <div className="min-h-screen">
      <ThreeBackground />
      <Navbar />
      <div className="page-content">
        <Routes>
          {/* Home ab protected hai — bina login ke nahi dikhega */}
          <Route path="/" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />

          {/* Login/Register sirf logged-out users ke liye */}
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Blog detail - protected */}
          <Route path="/blog/:id" element={
            <ProtectedRoute><BlogDetail /></ProtectedRoute>
          } />

          {/* Protected: logged-in users */}
          <Route path="/dashboard" element={
            <ProtectedRoute><UserDashboard /></ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute adminOnly={true}><CreateBlog /></ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute adminOnly={true}><EditBlog /></ProtectedRoute>
          } />

          {/* Protected: admin only */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;