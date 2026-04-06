import React, { useState } from 'react';
import {
  AlertTriangle, Info, Battery,
  ChevronDown, ArrowUpRight, Radio, CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* ── Heartbeat mini-chart ────────────────────────────── */
const HeartbeatChart = ({ isDark }) => {
  const points = [
    [0, 20], [8, 20], [12, 4], [16, 36], [20, 20],
    [30, 20], [34, 18], [38, 22], [48, 20],
    [58, 20], [62, 6], [66, 34], [70, 20], [100, 20]
  ];
  const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');

  return (
    <svg viewBox="0 0 100 40" width="128" height="32" preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="hbGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d={d} stroke="url(#hbGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ── Severity configs ─────────────────────────────────── */
const getSeverity = (isDark) => ({
  critical: {
    label: 'Critical Failure',
    textColor: '#f87171',
    borderColor: isDark ? '#b91c1c' : '#fca5a5',
    bgColor: isDark ? 'rgba(127,29,29,0.35)' : '#fff1f2',
    icon: AlertTriangle,
    iconColor: '#f87171',
    leftBorder: '#ef4444',
  },
  warning: {
    label: 'Warning',
    textColor: '#fbbf24',
    borderColor: isDark ? '#d97706' : '#fcd34d',
    bgColor: isDark ? 'rgba(120,53,15,0.25)' : '#fffbeb',
    icon: Radio,
    iconColor: '#fbbf24',
    leftBorder: '#f59e0b',
  },
  info: {
    label: 'Information',
    textColor: 'var(--accent)',
    borderColor: isDark ? 'rgba(0,206,209,0.4)' : 'rgba(13,148,136,0.35)',
    bgColor: isDark ? 'rgba(0,206,209,0.06)' : '#f0fdfa',
    icon: Info,
    iconColor: 'var(--accent)',
    leftBorder: 'var(--accent)',
  },
  battery: {
    label: 'Warning',
    textColor: '#fbbf24',
    borderColor: isDark ? '#d97706' : '#fcd34d',
    bgColor: isDark ? 'rgba(120,53,15,0.25)' : '#fffbeb',
    icon: Battery,
    iconColor: '#fbbf24',
    leftBorder: '#f59e0b',
  },
});

const ALERTS = [
  {
    id: '4882-QX', severity: 'critical',
    title: 'Main Pressure Leak - Sector 04',
    description: 'Sudden drop in atmospheric pressure detected at the Taliouine pump station. Automatic shutdown initiated.',
    time: '12 mins ago', statusLabel: 'Staff Notified',
    action: 'Details',
  },
  {
    id: '9021-ZA', severity: 'warning',
    title: 'Salinity Threshold Reach',
    description: 'Cooperative "Al-Najah" sensors reporting 15% increase in groundwater salinity. Immediate review advised.',
    time: '45 mins ago', statusLabel: 'Regional Queue',
    action: 'Review',
  },
  {
    id: '1104-BB', severity: 'info',
    title: 'Scheduled Release Optimization',
    description: 'Water release for the Aoulouz Basin has been optimized for lower evaporation losses tonight.',
    time: '2 hours ago', statusLabel: 'Auto-Applied',
    action: 'View Logs',
  },
  {
    id: '5541-MO', severity: 'battery',
    title: 'Battery Low - Remote Node A-12',
    description: 'Power cell in the High Atlas monitoring station is at 12%. Solar recharge efficiency decreasing.',
    time: '5 hours ago', statusLabel: 'Maintenance Needed',
    action: 'Schedule',
  },
];

const REGIONS = ['All Regions', 'Taliouine Basin', 'Aoulouz Sector', 'Argan Cooperatives'];

/* ── Alert Row ───────────────────────────────────────── */
const AlertRow = ({ alert, isDark }) => {
  const cfg = getSeverity(isDark)[alert.severity];
  const Icon = cfg.icon;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      background: 'var(--bg-surface)',
      border: `1px solid var(--border-subtle)`,
      borderLeft: `3px solid ${cfg.leftBorder}`,
      borderRadius: '16px',
      padding: '16px',
      transition: 'border-color 0.15s, box-shadow 0.15s',
      boxShadow: 'var(--card-shadow)',
      cursor: 'pointer',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderRightColor = 'var(--accent)'; e.currentTarget.style.borderTopColor = 'var(--accent)'; e.currentTarget.style.borderBottomColor = 'var(--accent)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderRightColor = 'var(--border-subtle)'; e.currentTarget.style.borderTopColor = 'var(--border-subtle)'; e.currentTarget.style.borderBottomColor = 'var(--border-subtle)'; }}
    >
      {/* Icon Badge */}
      <div style={{
        width: '46px', height: '46px', borderRadius: '12px', flexShrink: 0,
        background: cfg.bgColor,
        border: `1px solid ${cfg.borderColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={17} color={cfg.iconColor} strokeWidth={2} />
      </div>

      {/* Severity + ID */}
      <div style={{ width: '120px', flexShrink: 0 }}>
        <p style={{ color: cfg.textColor, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>
          {cfg.label}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '10px', margin: 0 }}>ID: {alert.id}</p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '15px', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {alert.title}
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0, lineHeight: 1.5,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {alert.description}
        </p>
      </div>

      {/* Time */}
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '100px' }}>
        <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, margin: '0 0 2px' }}>{alert.time}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '10px', margin: 0 }}>{alert.statusLabel}</p>
      </div>

      {/* Action */}
      <button style={{
        flexShrink: 0,
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em',
        color: alert.severity === 'critical' ? '#f87171' : 'var(--text-secondary)',
        border: `1px solid ${alert.severity === 'critical' ? 'rgba(248,113,113,0.4)' : 'var(--border-medium)'}`,
        borderRadius: '8px', padding: '6px 12px',
        background: 'transparent', cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
      onMouseLeave={e => {
        e.currentTarget.style.color = alert.severity === 'critical' ? '#f87171' : 'var(--text-secondary)';
        e.currentTarget.style.borderColor = alert.severity === 'critical' ? 'rgba(248,113,113,0.4)' : 'var(--border-medium)';
      }}
      >
        {alert.action}
      </button>
    </div>
  );
};

/* ── Sat Card ─────────────────────────────────────────── */
const SatCard = ({ tag, title, subtitle, children, isDark }) => (
  <div style={{
    borderRadius: '18px', overflow: 'hidden', position: 'relative',
    height: '210px', cursor: 'pointer',
    boxShadow: 'var(--card-shadow)',
  }}
  onMouseEnter={e => e.currentTarget.querySelector('.sat-overlay').style.opacity = '1'}
  onMouseLeave={e => e.currentTarget.querySelector('.sat-overlay').style.opacity = '0'}
  >
    {children}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(to top, rgba(11,19,43,0.92) 40%, rgba(11,19,43,0.2) 100%)',
    }} />
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px' }}>
      <span style={{
        fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
        color: 'var(--accent)', background: 'var(--accent-light)',
        border: `1px solid ${isDark ? 'rgba(0,206,209,0.3)' : 'rgba(13,148,136,0.3)'}`,
        padding: '2px 8px', borderRadius: '99px',
      }}>
        {tag}
      </span>
      <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '18px', margin: '8px 0 4px', lineHeight: 1.2 }}>
        {title}
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', margin: 0 }}>{subtitle}</p>
    </div>
    <div className="sat-overlay" style={{
      position: 'absolute', top: '12px', right: '12px', opacity: 0, transition: 'opacity 0.2s',
    }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}>
        <ArrowUpRight size={12} color="white" />
      </div>
    </div>
  </div>
);

/* ── SVG Scenes ───────────────────────────────────────── */
const DamScene = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="damSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#92400e" /><stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="damWater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" /><stop offset="100%" stopColor="#0e7490" />
      </linearGradient>
    </defs>
    <rect width="400" height="210" fill="url(#damSky)" />
    <ellipse cx="80" cy="160" rx="120" ry="60" fill="#78350f" opacity="0.8" />
    <ellipse cx="340" cy="150" rx="100" ry="55" fill="#92400e" opacity="0.7" />
    <rect x="0" y="155" width="400" height="25" fill="url(#damWater)" opacity="0.7" />
    <rect x="0" y="178" width="400" height="32" fill="#451a03" />
    {[0, 1, 2, 3, 4, 5].map(i => (
      <line key={i} x1={30 + i * 60} y1="160" x2={30 + i * 60} y2="210" stroke="#0891b2" strokeWidth="1.5" opacity="0.4" />
    ))}
  </svg>
);

const OliveScene = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="oliveSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0f172a" /><stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <radialGradient id="oliveSpot" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="210" fill="url(#oliveSky)" />
    <rect width="400" height="210" fill="url(#oliveSpot)" />
    {[[30, 20], [80, 35], [150, 15], [220, 40], [300, 25], [370, 10], [60, 55]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="1" fill="white" opacity="0.6" />
    ))}
    <line x1="200" y1="80" x2="320" y2="80" stroke="#94a3b8" strokeWidth="3" />
    <circle cx="200" cy="80" r="6" fill="#64748b" />
    {[0, 1, 2, 3, 4].map(i => (
      <path key={i} d={`M${240 + i * 16},80 Q${244 + i * 16},${100 + i * 4} ${240 + i * 16},${120 + i * 8}`}
        stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.5" />
    ))}
    <rect x="0" y="160" width="400" height="50" fill="#14532d" opacity="0.6" />
    {[[50, 155], [130, 148], [210, 155], [290, 150], [360, 155]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="28" ry="20" fill="#166534" opacity="0.8" />
    ))}
  </svg>
);

/* ── Alerts Page ─────────────────────────────────────── */
const Alerts = () => {
  const { isDark } = useTheme();
  const [activeRegion, setActiveRegion] = useState('All Regions');

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      background: 'var(--bg-page)',
      padding: '24px',
      display: 'flex', flexDirection: 'column', gap: '20px',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '30px', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            System Alerts &amp; <span style={{ color: 'var(--accent)' }}>Health</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, maxWidth: '480px', lineHeight: 1.6 }}>
            Real-time monitoring of Souss-Massa water distribution networks and cooperative irrigation clusters.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4',
          border: `1px solid ${isDark ? 'rgba(16,185,129,0.3)' : '#bbf7d0'}`,
          borderRadius: '99px', padding: '6px 14px',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            System Live
          </span>
        </div>
      </div>

      {/* Network Status Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>

        {/* Main panel */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px', padding: '24px',
          boxShadow: 'var(--card-shadow)',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 12px' }}>
            Network Status
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '46px', letterSpacing: '-0.04em', lineHeight: 1 }}>94.2%</span>
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: '17px' }}>↑ 2.4%</span>
            </div>
            <HeartbeatChart isDark={isDark} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, lineHeight: 1.6, maxWidth: '440px' }}>
            Global infrastructure operational efficiency is within optimal parameters. 3 maintenance cycles scheduled.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Critical Errors', value: '04', color: '#f87171', Icon: AlertTriangle, hoverBorder: 'rgba(248,113,113,0.4)' },
            { label: 'Pending Tasks', value: '12', color: 'var(--text-primary)', Icon: CheckCircle2, hoverBorder: 'var(--accent)' },
          ].map(({ label, value, color, Icon, hoverBorder }) => (
            <div key={label} style={{
              flex: 1,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '18px', padding: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: 'var(--card-shadow)',
              transition: 'border-color 0.15s', cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = hoverBorder}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>
                  {label}
                </p>
                <span style={{ color, fontWeight: 900, fontSize: '38px', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</span>
              </div>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: label === 'Critical Errors'
                  ? (isDark ? 'rgba(248,113,113,0.1)' : '#fff1f2')
                  : 'var(--accent-light)',
                border: `1px solid ${label === 'Critical Errors' ? 'rgba(248,113,113,0.2)' : 'var(--accent-glow)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color={label === 'Critical Errors' ? '#f87171' : 'var(--accent)'} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Sort Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {REGIONS.map(region => {
            const isActive = region === activeRegion;
            return (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                style={{
                  fontSize: '12px', fontWeight: 700,
                  padding: '7px 16px', borderRadius: '99px',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-medium)'}`,
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? (isDark ? '#0B132B' : '#fff') : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {region}
              </button>
            );
          })}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          border: '1px solid var(--border-medium)', borderRadius: '8px',
          padding: '7px 12px', cursor: 'pointer',
          background: 'var(--bg-surface)',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-medium)'}
        >
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Sort:</span>
          <span style={{ color: 'var(--text-primary)', fontSize: '11px', fontWeight: 600 }}>Most Recent</span>
          <ChevronDown size={14} color="var(--text-muted)" />
        </div>
      </div>

      {/* Alert List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ALERTS.map(alert => (
          <AlertRow key={alert.id} alert={alert} isDark={isDark} />
        ))}
      </div>

      {/* Satellite Intel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <SatCard tag="Satellite Intel" title="Aoulouz Dam Levels Monitoring" subtitle="Optical scan confirms +2% capacity vs last week." isDark={isDark}>
          <DamScene />
        </SatCard>
        <SatCard tag="Coop Update" title="Olive Grove Saturation Map" subtitle="Ground sensors showing ideal moisture levels in Taroudant North." isDark={isDark}>
          <OliveScene />
        </SatCard>
      </div>
    </div>
  );
};

export default Alerts;
