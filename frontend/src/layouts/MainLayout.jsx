import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import apiRequest from '../services/api';
import { Menu, Search, Bell, ChevronRight, X, AlertTriangle, Droplet, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const location = useLocation();
  const notifRef = useRef(null);

  const getPageTitle = (path) => {
    const titles = {
      '/': 'Tableau de Bord',
      '/demands': 'Demandes Irrigation',
      '/releases': 'Lâchers d\'Eau',
      '/users': 'Gestion Utilisateurs',
      '/profile': 'Profil Utilisateur',
    };
    return titles[path] || 'Application';
  };

  const [notifications, setNotifications] = useState([]);

  // Fix encoding issues without touching backend
  const fixEncoding = (str) => {
    if (!str) return '';
    try {
      // Handles UTF-8 strings misread as Latin1
      return decodeURIComponent(escape(str));
    } catch {
      return str;
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [alerts, history] = await Promise.all([
          apiRequest('/alerts'),
          apiRequest('/dashboard/history')
        ]);

        const handledList = JSON.parse(localStorage.getItem('handledAlerts')) || [];
        const activeAlerts = (alerts || []).filter(a => !handledList.includes(a.id));

        const mappedAlerts = activeAlerts.map(a => ({
          id: `a-${a.id}`,
          type: 'alert',
          label: a.title || 'Alerte',
          sub: fixEncoding(a.description),
          time: a.time ? a.time : 'R\u00e9cemment',
          icon: <AlertTriangle size={14} />,
          color: a.severity === 'critique' ? '#EF4444' : a.severity === 'warning' ? '#F59E0B' : '#06B6D4',
          date: new Date(a.time || new Date())
        }));

        const mappedReleases = (history || []).slice(0, 5).map((h, idx) => ({
          id: `r-${idx}`,
          type: 'release',
          label: 'Lâcher effectué',
          sub: fixEncoding(`${h.volume_m3}m³ - ${h.barrage}`),
          time: h.date_lacher,
          icon: <Droplet size={14} />,
          color: '#005E70',
          date: new Date(h.date_lacher)
        }));

        setNotifications([...mappedAlerts, ...mappedReleases].sort((a, b) => b.date - a.date).slice(0, 6));
      } catch (err) {
        console.error("Erreur notifications", err);
      }
    };
    fetchNotifications();
  }, []); // Only fetch once on mount to reduce latency and server load

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarCollapsed(true);
      else setIsSidebarCollapsed(false);
    };

    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  return (
    <>
      <style>{`
        .app-container {
          display: flex; height: 100vh; width: 100vw; overflow: hidden;
          background: #D4DCDE; font-family: var(--font-main); position: relative;
        }

        .app-container::before {
          content: ''; position: absolute; inset: 0; opacity: 0.5; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; z-index: 1; }

        .top-navbar {
          flex-shrink: 0; height: 72px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; background: rgba(255, 255, 255, 0.35); backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px); border-bottom: 1.5px solid rgba(255, 255, 255, 0.65);
          position: relative; z-index: 300;
        }

        .nav-left { display: flex; align-items: center; gap: 16px; }
        .breadcrumb-text { font-family: var(--font-headline); font-size: 16px; font-weight: 800; color: #1A3A42; letter-spacing: -0.01em; display: flex; align-items: center; gap: 8px; }
        .breadcrumb-sub { color: #8AACB2; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

        .nav-right { display: flex; align-items: center; gap: 12px; position: relative; }
        
        /* Desktop Search Box */
        .nav-search-box {
          position: relative; display: flex; align-items: center; background: rgba(255,255,255,0.45);
          border: 1.5px solid rgba(255,255,255,0.7); border-radius: 12px; padding: 0 16px; width: 220px; height: 40px; transition: all 0.2s cubic-bezier(0,0,0.2,1);
        }
        .nav-search-box:focus-within { width: 260px; background: rgba(255,255,255,0.8); border-color: rgba(0, 184, 160, 0.35); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .nav-search-box input { background: transparent; border: none; outline: none; font-size: 13px; font-weight: 500; color: #1A3A42; width: 100%; padding: 0 10px; }

        .nav-icon-btn {
          width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
          color: #4A6A72; background: transparent; border: none; cursor: pointer; transition: all 0.2s; position: relative;
        }
        .nav-icon-btn:hover, .nav-icon-btn.active { background: rgba(255,255,255,0.45); color: #005E70; }
        .notification-dot { position: absolute; top: 12px; right: 12px; width: 7px; height: 7px; background: #EF4444; border: 1.5px solid white; border-radius: 50%; }

        /* Mobile Expandable Search */
        .mobile-search-area {
            position: absolute; top: 68px; left: 0; right: 0;
            background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(34px);
            padding: 12px 20px; border-bottom: 1.5px solid rgba(255,255,255,1);
            display: none; animation: slide-down 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); z-index: 250;
        }
        .mobile-search-area.active { display: block; }
        @keyframes slide-down { from { transform: translateY(-15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .search-inner-mobile { 
            display: flex; align-items: center; background: #F0F4F5; 
            border-radius: 12px; padding: 0 16px; height: 44px;
        }
        .search-inner-mobile input { flex: 1; background: transparent; border: none; outline: none; padding: 0 12px; font-size: 14px; font-weight: 500; color: #1A3A42; }

        /* Notifications */
        .notif-panel {
          position: absolute; top: 58px; right: 0; width: 320px;
          background: rgba(255, 255, 255, 0.97); border: 1.5px solid rgba(255, 255, 255, 1);
          border-radius: 20px; backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
          box-shadow: 0 25px 80px rgba(0, 40, 50, 0.22); animation: notif-slide 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); z-index: 500; overflow: hidden;
        }
        .notif-header { padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.04); }
        .notif-title { font-family: var(--font-headline); font-size: 14px; font-weight: 800; color: #11181A; }
        .notif-list { 
            display: flex; flex-direction: column; height: 213px; overflow-y: auto; 
            scrollbar-width: thin; scrollbar-color: rgba(0, 184, 160, 0.2) transparent;
        }
        .notif-list::-webkit-scrollbar { width: 5px; }
        .notif-list::-webkit-scrollbar-thumb { background: rgba(0, 184, 160, 0.15); border-radius: 10px; }
        .notif-item { padding: 14px 20px; display: flex; gap: 14px; border-bottom: 1px solid rgba(0,0,0,0.03); cursor: pointer; }

        .mobile-menu-trigger { display: none; background: transparent; border: none; color: #005E70; cursor: pointer; padding: 8px; border-radius: 8px; }
        .nav-search-mobile-btn { display: none; }
        .page-wrapper { 
            flex: 1; 
            overflow-y: auto; 
            overflow-x: hidden; 
            position: relative; 
            height: 100%; 
            display: block; /* Libère le scroll naturel */
        }
        .sidebar-backdrop { display: none; position: fixed; inset: 0; background: rgba(7, 40, 48, 0.4); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 150; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }

        @media (max-width: 1024px) {
          .top-navbar { padding: 0 20px; height: 68px; }
          .nav-search-box { display: none; }
          .nav-search-mobile-btn { display: flex; }
          .mobile-menu-trigger { display: block; }
          .sidebar-backdrop.active { display: block; opacity: 1; pointer-events: auto; }
          .breadcrumb-text { font-size: 17px; }
          .breadcrumb-sub { display: none; }
          .notif-panel { width: calc(100vw - 32px); right: -8px; }
          .page-wrapper { padding: 0 0 60px !important; }
        }
      `}</style>

      <div className="app-container">
        <div className={`sidebar-backdrop ${!isSidebarCollapsed ? 'active' : ''}`} onClick={() => setIsSidebarCollapsed(true)} />
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

        <main className="main-content">
          <header className="top-navbar">
            <div className="nav-left">
              <button className="mobile-menu-trigger" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                <Menu size={24} />
              </button>
              <div className="breadcrumb-text">
                <span className="breadcrumb-sub">SYSTÈME</span>
                <ChevronRight size={14} color="#8AACB2" />
                <span>{getPageTitle(location.pathname)}</span>
              </div>
            </div>

            <div className="nav-right" ref={notifRef}>
              {/* DESKTOP SEARCH BOX: Visible on large screens */}
              <div className="nav-search-box">
                <Search size={16} color="#8AACB2" strokeWidth={2.5} />
                <input type="text" placeholder="Rechercher..." />
              </div>

              {/* MOBILE SEARCH ICON: Only visible on small screens */}
              <button
                className={`nav-icon-btn nav-search-mobile-btn ${isSearchOpenMobile ? 'active' : ''}`}
                onClick={() => {
                  setIsSearchOpenMobile(!isSearchOpenMobile);
                  setIsNotifOpen(false);
                }}
              >
                <Search size={22} strokeWidth={2.2} />
              </button>

              <button
                className={`nav-icon-btn ${isNotifOpen ? 'active' : ''}`}
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsSearchOpenMobile(false);
                }}
              >
                <Bell size={22} strokeWidth={2.2} />
                {notifications.length > 0 && <span className="notification-dot" />}
              </button>

              {/* NOTIFICATION PANEL */}
              {isNotifOpen && (
                <div className="notif-panel">
                  <div className="notif-header">
                    <span className="notif-title">Activités BTM</span>
                    <X size={16} onClick={() => setIsNotifOpen(false)} style={{ cursor: 'pointer', color: '#8AACB2' }} />
                  </div>
                  <div className="notif-list">
                    {notifications.map(n => (
                      <div key={n.id} className="notif-item">
                        <div style={{ background: n.color, width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                          {n.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#1A3A42' }}>{n.label}</div>
                          <div style={{ fontSize: 11, color: '#7A9BA0', marginTop: 2 }}>{n.sub}</div>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div style={{ padding: 20, textAlign: 'center', fontSize: 13, color: '#7A9BA0' }}>Aucune notification récente</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* MOBILE SEARCH PANEL: Only active on small screens */}
          <div className={`mobile-search-area ${isSearchOpenMobile ? 'active' : ''}`}>
            <div className="search-inner-mobile">
              <Search size={18} color="#8AACB2" />
              <input
                type="text"
                placeholder="Rechercher..."
                autoFocus={isSearchOpenMobile}
              />
              <X size={18} color="#8AACB2" onClick={() => setIsSearchOpenMobile(false)} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          <div className="page-wrapper" onClick={() => setIsSearchOpenMobile(false)}>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default MainLayout;
