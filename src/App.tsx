import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreateUser from './pages/AdminCreateUser';
import UserDashboard from './pages/UserDashboard';
import { useState } from 'react';

function DashboardRouter() {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  const [view, setView] = useState<'dashboard' | 'createUser'>('dashboard');

  if (!currentUser) return <Navigate to="/" replace />;

  if (currentUser.role === 'admin') {
    return view === 'dashboard'
      ? <AdminDashboard onCreateUser={() => setView('createUser')} />
      : <AdminCreateUser onBack={() => setView('dashboard')} />;
  }

  return <UserDashboard />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
