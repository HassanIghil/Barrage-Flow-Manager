import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Demands from './pages/Demands';
import { useAuth } from './context/AuthContext';

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
          <Route path="/releases" element={<div className="text-white font-bold text-4xl">Releases System Coming Soon...</div>} />
          <Route path="/alerts" element={<div className="text-white font-bold text-4xl">Alerts Monitoring Coming Soon...</div>} />

          {/* Route Directeur uniquement */}
          <Route element={<ProtectedRoute allowedRoles={['directeur']} />}>
            <Route path="/users" element={<div className="text-white font-bold text-3xl">Gestion des Agents & Coops</div>} />
          </Route>
        </Route>
      </Route>

      {/* Redirection automatique vers / si inconnu */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
