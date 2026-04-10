import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#C8D8D9]" style={{ fontFamily: "var(--font-main)" }}>
        <style>{`
          .ls-spinner {
            width: 64px; height: 64px; border: 4px solid rgba(0, 184, 160, 0.1); border-top-color: #00B8A0; border-radius: 50%;
            animation: ls-spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite; margin-bottom: 24px;
          }
          @keyframes ls-spin { to { transform: rotate(360deg); } }
          .ls-text { font-family: var(--font-headline); font-size: 18px; font-weight: 800; color: #1A3A42; letter-spacing: -0.01em; }
        `}</style>
        <div className="ls-spinner" />
        <div className="ls-text">Vérification de session</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
