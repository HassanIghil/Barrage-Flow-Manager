import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Demands from './pages/Demands';
import Releases from './pages/Releases';
import Users from './pages/Users';
import Alerts from './pages/Alerts';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

      {/* Pages Sécurisées (Routes Protégées avec Layout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/demands" element={<Demands />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/alerts" element={<Alerts />} />

          {/* Route Directeur uniquement */}
          <Route element={<ProtectedRoute allowedRoles={['directeur']} />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
      </Route>

      {/* Redirection automatique vers / si inconnu */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
