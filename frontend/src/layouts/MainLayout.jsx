import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, Bell, Globe, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV_TABS = {
  '/alerts':   ['Monitoring', 'Alerts', 'Infrastructure'],
  '/releases': ['Monitoring', 'Releases', 'Infrastructure'],
};

const MainLayout = () => {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const tabs = NAV_TABS[pathname];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-page)', overflow: 'hidden' }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── Topbar ── */}
        <header style={{
          height: '68px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-sidebar)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: '20px',
          flexShrink: 0,
        }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '20px', letterSpacing: '-0.03em' }}>
              Liquid Earth
            </span>
            {tabs ? (
              <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '8px' }}>
                {tabs.map(tab => {
                  const isActive = pathname.includes(tab.toLowerCase());
                  return (
                    <span key={tab} style={{
                      fontSize: '13px',
                      padding: '4px 12px',
                      cursor: 'pointer',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                      borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      paddingBottom: isActive ? '2px' : '4px',
                      transition: 'all 0.15s ease',
                    }}>
                      {tab}
                    </span>
                  );
                })}
              </nav>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                borderLeft: '1px solid var(--border-subtle)',
                paddingLeft: '16px', marginLeft: '4px',
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>System Status:</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Optimized
                </span>
              </div>
            )}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '320px', marginLeft: 'auto' }}>
            <Search
              size={14}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search basins or data sets..."
              style={{
                width: '100%',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px',
                padding: '8px 16px 8px 34px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>

          {/* Topbar Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* Bell */}
            <button style={iconBtnStyle(isDark)} className="topbar-icon-btn">
              <Bell size={16} color="var(--text-secondary)" />
              <span style={{
                position: 'absolute', top: '8px', right: '8px',
                width: '7px', height: '7px',
                borderRadius: '50%',
                background: '#ef4444',
                border: '1.5px solid var(--bg-sidebar)',
              }} />
            </button>

            {/* Globe */}
            <button style={iconBtnStyle(isDark)} className="topbar-icon-btn">
              <Globe size={16} color="var(--text-secondary)" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                ...iconBtnStyle(isDark),
                background: isDark
                  ? 'rgba(0, 206, 209, 0.12)'
                  : 'rgba(13, 148, 136, 0.08)',
                borderColor: isDark
                  ? 'rgba(0, 206, 209, 0.3)'
                  : 'rgba(13, 148, 136, 0.25)',
              }}
            >
              {isDark
                ? <Sun size={16} color="var(--accent)" />
                : <Moon size={16} color="var(--accent)" />
              }
            </button>

            {/* Avatar */}
            <button style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), #0891b2)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px var(--accent-glow)',
              transition: 'box-shadow 0.2s',
            }}>
              <User size={15} color={isDark ? '#0B132B' : '#fff'} strokeWidth={2.5} />
            </button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const iconBtnStyle = (isDark) => ({
  position: 'relative',
  width: '36px', height: '36px',
  borderRadius: '50%',
  background: 'transparent',
  border: '1px solid var(--border-medium)',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.15s ease',
});

export default MainLayout;
