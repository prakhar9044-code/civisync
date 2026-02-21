import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportIssue from './pages/ReportIssue';
import ReportDetail from './pages/ReportDetail';
import Analytics from './pages/Analytics';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-civic-500/30 border-t-civic-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Loading...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={user.role === 'citizen' ? '/dashboard' : '/admin'} replace />;
  return children;
}

function AppInner() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true; // default dark
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const showNav = user !== null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {showNav && <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)} />}
      <main>
        <Routes>
          <Route path="/login" element={!user ? <Auth /> : <Navigate to={user.role === 'citizen' ? '/dashboard' : '/admin'} replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['citizen']}>
              <CitizenDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['authority', 'admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute roles={['citizen']}>
              <ReportIssue />
            </ProtectedRoute>
          } />
          <Route path="/report/:id" element={
            <ProtectedRoute>
              <ReportDetail />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: darkMode ? '#0d1b2e' : '#fff',
            color: darkMode ? '#e8f1ff' : '#0a1628',
            border: `1px solid ${darkMode ? '#1a2d47' : '#e2e8f0'}`,
            borderRadius: '12px',
            fontFamily: 'Plus Jakarta Sans',
          },
          duration: 4000,
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AuthProvider>
  );
}
