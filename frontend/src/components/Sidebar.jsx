import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Droplets, Waves, Users, Settings, User, LogOut, Droplet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Responsive Sidebar:
 * - Desktop (> 1024px): Fixed width (240px), no collapsing.
 * - Mobile (< 1024px): Drawer pattern (Hidden 0px -> Visible 240px via MainLayout toggle).
 */
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de Bord',       path: '/' },
    { icon: Droplets,        label: 'Demandes Irrigation',  path: '/demands' },
    { icon: Waves,           label: 'Actions de Lâcher',     path: '/releases' },
    { icon: Users,           label: 'Agents & Coops',        path: '/users', roles: ['directeur'] },
    { icon: Settings,        label: 'Profil & Accès',        path: '/profile' },
  ];

  return (
    <>
      <style>{`
        .sidebar-root {
          width: 240px;
          height: 100vh;
          background: linear-gradient(160deg, #1A4F5C 0%, #0D3540 55%, #072830 100%);
          border-right: 1.5px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          z-index: 200;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 0;
        }

        .sidebar-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .sidebar-logo-area {
          padding: 24px 28px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .logo-box {
          width: 40px;
          height: 40px;
          background: #00C8AE;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0, 200, 174, 0.4);
          flex-shrink: 0;
        }

        .logo-text-main {
          font-family: 'Syne', sans-serif;
          color: white;
          font-weight: 800;
          font-size: 16px;
          line-height: 1.1;
        }

        .logo-text-sub {
          font-size: 9px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-weight: 700;
          margin-top: 2px;
        }

        .nav-menu {
          flex: 1;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: 14px;
          text-decoration: none;
          color: rgba(255,255,255,0.6);
          transition: all 0.2s ease;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .nav-item:hover { color: white; background: rgba(255,255,255,0.06); }
        .nav-item.active {
          color: #00C8AE;
          background: rgba(0, 200, 174, 0.1);
          border: 1px solid rgba(0, 200, 174, 0.2);
        }

        .nav-item-text {
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
        }

        .sidebar-user-area {
          padding: 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0,0,0,0.1);
        }

        .sidebar-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00C8AE, #005E70);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: 2px solid rgba(255,255,255,0.2);
          flex-shrink: 0;
        }

        .user-info-text { overflow: hidden; flex: 1; }

        .sidebar-user-name {
          color: white;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-user-role {
          color: #00C8AE;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 2px;
        }

        .logout-btn {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(239, 68, 68, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .logout-btn:hover { background: rgba(239, 68, 68, 0.25); color: #FCA5A5; }

        /* Mobile specific overrides */
        @media (max-width: 1024px) {
          .sidebar-root {
            position: fixed;
            left: 0;
            top: 0;
            transform: translateX(${isCollapsed ? '-100%' : '0'});
            box-shadow: 20px 0 60px rgba(0,0,0,0.3);
          }
        }
      `}</style>

      <aside className="sidebar-root">
        <div className="sidebar-content">
          <div className="sidebar-logo-area">
            <div className="logo-box">
              <Droplets color="white" size={20} strokeWidth={2.5} />
            </div>
            <div className="logo-text-area">
              <div className="logo-text-main">AquaFlow</div>
              <div className="logo-text-sub">Barrage Y. Tachfine</div>
            </div>
          </div>

          <nav className="nav-menu">
            {menuItems.filter(item => !item.roles || item.roles.includes(user?.role)).map(({ icon: Icon, label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => { if (window.innerWidth < 1024) setIsCollapsed(true); }}
              >
                <Icon size={20} strokeWidth={2.5} />
                <span className="nav-item-text">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-user-area">
            <div className="sidebar-user-avatar">
              <User size={18} strokeWidth={2.5} />
            </div>
            <div className="user-info-text">
              <div className="sidebar-user-name">{user?.prenom} {user?.nom}</div>
              <div className="sidebar-user-role">{user?.role || 'Directeur'}</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Déconnexion">
              <LogOut size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
