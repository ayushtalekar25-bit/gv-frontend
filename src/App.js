import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import SplashScreen from './components/SplashScreen';

const LandingPage    = lazy(() => import('./pages/LandingPage'));
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const QuizPage       = lazy(() => import('./pages/QuizPage'));

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111',
              color: '#fff',
              border: '1px solid #2a2a2a',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#f0b429', secondary: '#000' } },
            error:   { iconTheme: { primary: '#e53e3e', secondary: '#fff' } },
          }}
        />

        {/* Splash screen — shown once on first load */}
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/"         element={<GuestRoute><LandingPage /></GuestRoute>} />
            <Route path="/login"    element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/admin/*"     element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
            <Route path="/quiz"        element={<PrivateRoute><QuizPage /></PrivateRoute>} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
