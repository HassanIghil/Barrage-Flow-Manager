import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Droplets, Bell, Settings, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MOCK_USER = { prenom: 'Omar', nom: 'El Fassi' };

const Sidebar = () => {
  const { isDark } = useTheme();
  const user = MOCK_USER;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Droplets,        label: 'Releases',  path: '/releases' },
    { icon: Bell,            label: 'Alerts',    path: '/alerts' },
    { icon: Settings,        label: 'Settings',  path: '/profile' },
  ];

  return (
    <aside style={{
      width: '208px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>

      {/* ── Logo ── */}
      <div style={{ padding: '28px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px',
          background: 'var(--accent)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isDark ? '0 0 16px var(--accent-glow)' : '0 2px 8px var(--accent-glow)',
          flexShrink: 0,
        }}>
          <Droplets color={isDark ? '#0B132B' : '#fff'} size={18} strokeWidth={2.5} />
        </div>
        <div style={{ lineHeight: 1 }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.02em', margin: 0 }}>
            Taroudant Aqua
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '4px 0 0' }}>
            Regional Control
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {menuItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 16px',
                borderRadius: '12px',
                background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                border: isActive
                  ? `1px solid ${isDark ? 'rgba(0,206,209,0.2)' : 'rgba(13,148,136,0.15)'}`
                  : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--sidebar-hover-bg)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon
                  size={18}
                  strokeWidth={2}
                  color={isActive ? 'var(--accent)' : 'var(--text-muted)'}
                />
                <span style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                }}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Add Infrastructure Button ── */}
      <div style={{ padding: '0 16px 12px' }}>
        <button style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: 'var(--accent)',
          color: isDark ? '#0B132B' : '#fff',
          fontWeight: 700,
          fontSize: '12px',
          border: 'none',
          borderRadius: '12px',
          padding: '12px',
          cursor: 'pointer',
          boxShadow: isDark
            ? '0 0 14px var(--accent-glow)'
            : '0 2px 8px var(--accent-glow)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Add Infrastructure
        </button>
      </div>

      {/* ── User Profile ── */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), #0891b2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 0 2px var(--bg-sidebar), 0 0 0 3px var(--border-subtle)`,
        }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '13px' }}>
            {user?.prenom?.[0]?.toUpperCase() ?? 'O'}
          </span>
        </div>
        <div style={{ overflow: 'hidden', lineHeight: 1.3 }}>
          <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, margin: 0, textTransform: 'capitalize' }}>
            {user?.prenom} {user?.nom}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '10px', margin: '2px 0 0' }}>
            Chief Hydrologist
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
