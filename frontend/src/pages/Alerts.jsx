import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Info, Radio, CheckCircle2
} from 'lucide-react';
import LoadingOverlay from '../components/LoadingOverlay';
import apiRequest from '../services/api';



/* ── Severity configs ─────────────────────────────────── */
const getSeverity = () => ({
  critique: {
    label: '\u00c9chec Critique',
    textColor: '#f87171',
    borderColor: '#fca5a5',
    bgColor: '#fff1f2',
    icon: AlertTriangle,
    iconColor: '#f87171',
    leftBorder: '#ef4444',
  },
  warning: {
    label: 'Avertissement',
    textColor: '#fbbf24',
    borderColor: '#fcd34d',
    bgColor: '#fffbeb',
    icon: Radio,
    iconColor: '#fbbf24',
    leftBorder: '#f59e0b',
  },
  info: {
    label: 'Information',
    textColor: 'var(--accent)',
    borderColor: 'rgba(13,148,136,0.35)',
    bgColor: '#f0fdfa',
    icon: Info,
    iconColor: 'var(--accent)',
    leftBorder: 'var(--accent)',
  },
});

const TABS = ['Toutes', 'Critiques', 'Avertissements', 'Informations'];

/* ── Alert Row ───────────────────────────────────────── */
const AlertRow = ({ alert, isHandled, onHandle }) => {
  const cfg = getSeverity()[alert.severity] || getSeverity().info;
  const Icon = cfg.icon;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      background: 'var(--bg-surface)',
      border: `1px solid var(--border-subtle)`,
      borderLeft: `3px solid ${isHandled ? 'var(--border-medium)' : cfg.leftBorder}`,
      borderRadius: '16px',
      padding: '16px',
      opacity: isHandled ? 0.6 : 1,
      transition: 'border-color 0.15s, box-shadow 0.15s, opacity 0.3s',
      boxShadow: 'var(--card-shadow)',
    }}>
      {/* Icon Badge */}
      <div style={{
        width: '46px', height: '46px', borderRadius: '12px', flexShrink: 0,
        background: cfg.bgColor,
        border: `1px solid ${cfg.borderColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={17} color={cfg.iconColor} strokeWidth={2} />
      </div>

      {/* Severity */}
      <div style={{ width: '120px', flexShrink: 0 }}>
        <p style={{ color: cfg.textColor, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>
          {cfg.label}
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '15px', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {alert.title}
        </h4>
        <p style={{
          color: 'var(--text-secondary)', fontSize: '12px', margin: 0, lineHeight: 1.5,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
        }}>
          {alert.description}
        </p>
      </div>

      {/* Time */}
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '100px' }}>
        <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, margin: '0 0 2px' }}>{alert.time}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '10px', margin: 0 }}>{"Enregistr\u00e9"}</p>
      </div>

      {/* Action */}
      <button
        onClick={() => onHandle && onHandle()}
        disabled={isHandled}
        style={{
          flexShrink: 0,
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em',
          color: isHandled ? 'var(--text-muted)' : (alert.severity === 'critique' ? '#f87171' : 'var(--text-secondary)'),
          border: `1px solid ${isHandled ? 'var(--border-subtle)' : (alert.severity === 'critique' ? 'rgba(248,113,113,0.4)' : 'var(--border-medium)')}`,
          borderRadius: '8px', padding: '6px 12px',
          background: isHandled ? 'var(--bg-element)' : 'transparent',
          cursor: isHandled ? 'default' : 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { if (!isHandled) { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; } }}
        onMouseLeave={e => {
          if (!isHandled) {
            e.currentTarget.style.color = alert.severity === 'critique' ? '#f87171' : 'var(--text-secondary)';
            e.currentTarget.style.borderColor = alert.severity === 'critique' ? 'rgba(248,113,113,0.4)' : 'var(--border-medium)';
          }
        }}
      >
        {isHandled ? 'Trait\u00e9e \u2714' : 'Traiter'}
      </button>
    </div>
  );
};

/* ── Alerts Page ─────────────────────────────────────── */
const Alerts = () => {
  const [activeTab, setActiveTab] = useState('Toutes');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handledList, setHandledList] = useState([]);

  useEffect(() => {
    setHandledList(JSON.parse(localStorage.getItem('handledAlerts')) || []);
    setLoading(true);
    apiRequest('/alerts')
      .then(alertsData => {
        if (!alertsData.detail) {
          setAlerts(Array.isArray(alertsData) ? alertsData : []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAlert = (id) => {
    if (!handledList.includes(id)) {
      const newList = [...handledList, id];
      setHandledList(newList);
      localStorage.setItem('handledAlerts', JSON.stringify(newList));
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'Critiques') return alert.severity === 'critique';
    if (activeTab === 'Avertissements') return alert.severity === 'warning';
    if (activeTab === 'Informations') return alert.severity === 'info';
    return true; // 'Toutes'
  }).sort((a, b) => {
    // Show handled at the bottom
    const aHandled = handledList.includes(a.id);
    const bHandled = handledList.includes(b.id);
    if (aHandled && !bHandled) return 1;
    if (!aHandled && bHandled) return -1;
    return 0; // fallback to original sort
  });

  return (
    <div style={{
      padding: '24px 36px',
      display: 'flex', flexDirection: 'column', gap: '20px',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '30px', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            Gestion des <span style={{ color: 'var(--accent)' }}>Alertes</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, maxWidth: '480px', lineHeight: 1.6 }}>
            {"Supervision en temps r\u00e9el de la sant\u00e9 du barrage et du r\u00e9seau de distribution d'eau."}
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '99px', padding: '6px 14px',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {"Syst\u00e8me Actif"}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {TABS.map(tab => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontSize: '12px', fontWeight: 700,
                  padding: '7px 16px', borderRadius: '99px',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-medium)'}`,
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading ? (
          <LoadingOverlay message="Scan de sécurité du barrage..." />
        ) : filteredAlerts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Aucune alerte enregistrée pour cette catégorie.</p>
        ) : (
          filteredAlerts.map(alert => (
            <AlertRow
              key={alert.id}
              alert={alert}
              isHandled={handledList.includes(alert.id)}
              onHandle={() => handleAlert(alert.id)}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default Alerts;
