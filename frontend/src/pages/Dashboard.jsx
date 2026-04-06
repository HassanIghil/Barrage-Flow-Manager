import React, { useState } from 'react';
import {
  BarChart2, Droplets, CloudRain, Users, AlertTriangle,
  MapPin, ArrowUpRight, Thermometer
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* ── Bar Chart ────────────────────────────────────────── */
const FluidChart = ({ isDark }) => {
  const bars = [62, 74, 68, 80, 71, 95, 88, 76, 58, 82];
  const max = Math.max(...bars);
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', width: '100%' }}>
      {bars.map((v, i) => {
        const isTop = i === 5;
        const isHov = hovered === i;
        const pct = (v / max) * 100;

        const barBg = isDark
          ? (isTop || isHov
            ? 'linear-gradient(180deg, #00CED1 0%, #0891b2 100%)'
            : 'linear-gradient(180deg, rgba(0,206,209,0.55) 0%, rgba(8,145,178,0.25) 100%)')
          : (isTop || isHov
            ? 'linear-gradient(180deg, #0d9488 0%, #0891b2 100%)'
            : 'linear-gradient(180deg, rgba(13,148,136,0.45) 0%, rgba(8,145,178,0.2) 100%)');

        return (
          <div
            key={i}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative', height: '100%', justifyContent: 'flex-end' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* tooltip */}
            {isHov && (
              <div style={{
                position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--accent)', color: isDark ? '#0B132B' : '#fff',
                fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px',
                whiteSpace: 'nowrap', zIndex: 10,
              }}>
                {v} m³/s
              </div>
            )}
            {isTop && (
              <div style={{
                position: 'absolute',
                bottom: `${pct}%`,
                left: '50%', transform: 'translateX(-50%) translateY(50%)',
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#fff', border: `2px solid ${isDark ? '#00CED1' : '#0d9488'}`,
                boxShadow: `0 0 8px ${isDark ? 'rgba(0,206,209,0.6)' : 'rgba(13,148,136,0.5)'}`,
                zIndex: 1,
              }} />
            )}
            <div style={{
              width: '100%',
              height: `${pct}%`,
              background: barBg,
              borderRadius: '6px 6px 4px 4px',
              boxShadow: isTop ? `0 0 14px ${isDark ? 'rgba(0,206,209,0.4)' : 'rgba(13,148,136,0.3)'}` : 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }} />
          </div>
        );
      })}
    </div>
  );
};

/* ── Catchment Map ────────────────────────────────────── */
const CatchmentMap = ({ isDark }) => (
  <div style={{
    position: 'relative', width: '100%', height: '100%',
    borderRadius: '16px', overflow: 'hidden',
    background: isDark
      ? 'linear-gradient(135deg, #0a1628, #0d2137, #061220)'
      : 'linear-gradient(135deg, #cbd5e1, #94a3b8, #b0c4d8)',
  }}>
    {/* Terrain */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: isDark ? 0.2 : 0.35 }} viewBox="0 0 300 220">
      <defs>
        <filter id="terrain2">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="6" seed="4" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="300" height="220" filter="url(#terrain2)" fill={isDark ? '#1a4a6b' : '#64748b'} />
    </svg>

    {/* Contour lines */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: isDark ? 0.12 : 0.2 }} viewBox="0 0 300 220">
      {[30, 55, 80, 105, 130, 155, 180].map((y, i) => (
        <path key={i} d={`M0,${y} Q75,${y - 8 + i * 3} 150,${y + 5} Q225,${y + 12 - i * 2} 300,${y - 3}`}
          stroke={isDark ? '#00CED1' : '#0d9488'} strokeWidth="0.5" fill="none" />
      ))}
    </svg>

    {/* River */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }} viewBox="0 0 300 220">
      <path d="M20,60 Q80,90 100,110 Q130,135 160,145 Q200,158 260,170"
        stroke={isDark ? '#00CED1' : '#0d9488'} strokeWidth="1.5" fill="none" strokeDasharray="4,3" />
    </svg>

    {/* Sensors */}
    <div style={{ position: 'absolute', top: '28%', left: '52%' }}>
      <div style={{
        width: '12px', height: '12px', borderRadius: '50%',
        background: isDark ? '#00CED1' : '#0d9488',
        boxShadow: `0 0 12px ${isDark ? 'rgba(0,206,209,0.8)' : 'rgba(13,148,136,0.7)'}`,
        animation: 'pulse 2s infinite',
      }} />
    </div>
    <div style={{ position: 'absolute', top: '55%', left: '72%' }}>
      <div style={{
        width: '10px', height: '10px', borderRadius: '50%',
        background: isDark ? '#64748b' : '#94a3b8',
        boxShadow: '0 0 8px rgba(100,116,139,0.5)',
      }} />
    </div>

    {/* Bottom bar */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: isDark
        ? 'linear-gradient(to top, rgba(11,19,43,0.9), transparent)'
        : 'linear-gradient(to top, rgba(241,245,249,0.9), transparent)',
      padding: '10px 14px 12px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '18px', height: '18px', borderRadius: '50%',
                background: isDark ? 'linear-gradient(135deg, #475569, #334155)' : 'linear-gradient(135deg, #94a3b8, #64748b)',
                border: `1.5px solid var(--bg-surface)`,
                marginLeft: i > 0 ? '-6px' : 0,
              }} />
            ))}
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>+12 rangers online</span>
        </div>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Active</span>
      </div>
      <p style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '4px 0 0' }}>
        Live Basin Feed
      </p>
    </div>
  </div>
);

/* ── Stat Card ────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, unit, sub, subColor, iconColor, progress, isDark }) => (
  <div style={{
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '18px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: 'var(--card-shadow)',
    transition: 'all 0.2s ease',
    cursor: 'default',
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
        {label}
      </span>
      <Icon size={16} color={iconColor} strokeWidth={1.8} style={{ opacity: 0.8 }} />
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
      <span style={{ fontSize: '30px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{value}</span>
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{unit}</span>
    </div>
    {progress !== undefined && (
      <div style={{ width: '100%', height: '3px', background: isDark ? '#2a3a5c' : '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${iconColor}66, ${iconColor})`,
          borderRadius: '99px',
          transition: 'width 0.7s ease',
        }} />
      </div>
    )}
    {sub && <p style={{ fontSize: '11px', fontWeight: 500, color: subColor, margin: 0 }}>{sub}</p>}
  </div>
);

/* ── Dashboard ────────────────────────────────────────── */
const Dashboard = () => {
  const { isDark } = useTheme();
  const [alertDismissed, setAlertDismissed] = useState(false);

  const accentColor = isDark ? '#00CED1' : '#0d9488';

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      background: 'var(--bg-page)',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
    }}>

      {/* Critical Alert Banner */}
      {!alertDismissed && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: isDark ? 'rgba(127,29,29,0.5)' : '#fff1f2',
          border: `1px solid ${isDark ? '#991b1b' : '#fca5a5'}`,
          borderRadius: '16px',
          padding: '14px 18px',
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
            background: isDark ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.1)',
            border: `1px solid ${isDark ? 'rgba(251,191,36,0.4)' : 'rgba(251,191,36,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={18} color="#f59e0b" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#d97706', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>
              Critical System Alert
            </p>
            <p style={{ color: isDark ? '#cbd5e1' : '#374151', fontSize: '13px', margin: 0 }}>
              Abnormal pressure surge detected in the Souss-Massa Zone C feeder canal. Immediate inspection recommended.
            </p>
          </div>
          <button
            onClick={() => setAlertDismissed(true)}
            style={{
              fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: '#d97706',
              border: `1px solid ${isDark ? 'rgba(217,119,6,0.4)' : 'rgba(217,119,6,0.3)'}`,
              borderRadius: '8px', padding: '6px 12px',
              background: 'transparent', cursor: 'pointer', flexShrink: 0,
              transition: 'background 0.15s',
            }}
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <StatCard isDark={isDark} icon={BarChart2} label="Water Level"    value="84.2" unit="%" sub="↗ +2.4% from last moon cycle" subColor={accentColor} iconColor={accentColor} progress={84.2} />
        <StatCard isDark={isDark} icon={Droplets}  label="Irrigation Flow" value="1.2k" unit="m³/s" sub="Optimal flow maintained across sectors" subColor="var(--text-muted)" iconColor="#06b6d4" />
        <StatCard isDark={isDark} icon={CloudRain} label="Rainfall Index"  value="12"   unit="mm" sub="Expected +5mm in 48 hours" subColor="var(--text-muted)" iconColor="#818cf8" />
        <StatCard isDark={isDark} icon={Users}     label="Active Co-ops"   value="312"  unit="" sub="● Online and transmitting" subColor="#10b981" iconColor="#10b981" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '14px' }}>

        {/* Fluid Dynamics Chart */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '24px',
          boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h2 style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '20px', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                Souss Basin Fluid Dynamics
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
                Real-time telemetry from main diversion channels
              </p>
            </div>
            <button style={{
              fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px', padding: '6px 12px',
              background: 'transparent', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
            >
              24H View
            </button>
          </div>
          <FluidChart isDark={isDark} />
        </div>

        {/* Catchment Map */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{ padding: '18px 20px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="var(--accent)" />
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '15px', margin: 0 }}>
              Taroudant Catchment
            </h3>
          </div>
          <div style={{ padding: '0 12px 12px', height: '240px' }}>
            <CatchmentMap isDark={isDark} />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>

        {/* Goal Status */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderLeft: `3px solid var(--accent)`,
          borderRadius: '18px',
          padding: '24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          boxShadow: 'var(--card-shadow)',
          minHeight: '150px',
        }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '17px', margin: '0 0 6px' }}>
              Sustainable Goal Status
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
              System tracking toward Q3 efficiency targets for communal irrigation.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '20px' }}>
            <span style={{ fontSize: '52px', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1 }}>A+</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
              Index Score
            </span>
          </div>
        </div>

        {/* Thermal Analysis */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '24px',
          display: 'flex', alignItems: 'center', gap: '20px',
          boxShadow: 'var(--card-shadow)',
          transition: 'border-color 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
        >
          {/* Thermal icon with circular pattern */}
          <div style={{
            width: '88px', height: '88px', borderRadius: '14px', flexShrink: 0,
            background: isDark
              ? 'linear-gradient(135deg, #064e3b, #065f46)'
              : 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <svg viewBox="0 0 88 88" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              {[10, 18, 26, 34, 42].map((r, i) => (
                <circle key={i} cx="44" cy="44" r={r} fill="none"
                  stroke={isDark ? `rgba(52,211,153,${0.35 - i * 0.05})` : `rgba(16,185,129,${0.3 - i * 0.04})`}
                  strokeWidth="5" />
              ))}
            </svg>
            <Thermometer size={20} color={isDark ? '#6ee7b7' : '#059669'} style={{ position: 'relative', zIndex: 1 }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '17px', margin: '0 0 8px' }}>
              Sector VII Thermal Analysis
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 12px', lineHeight: 1.6 }}>
              Satellite data indicates healthy moisture levels in the eastern pomegranate groves. Water usage remains below threshold.
            </p>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', fontWeight: 700, color: 'var(--accent)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              transition: 'gap 0.15s',
            }}>
              Full Analysis Report <ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
