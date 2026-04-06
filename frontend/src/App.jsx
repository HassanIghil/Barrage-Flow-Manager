import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';

// ⚠️  AUTH BYPASSED FOR DESIGN TESTING — re-enable ProtectedRoute when done

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/releases" element={
          <div className="flex-1 flex items-center justify-center bg-[#0B132B]">
            <div className="text-center">
              <p className="text-[#00CED1] font-black text-6xl mb-4">💧</p>
              <p className="text-white font-bold text-2xl">Releases Coming Soon</p>
              <p className="text-slate-400 text-sm mt-2">Water release management module is under development.</p>
            </div>
          </div>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
