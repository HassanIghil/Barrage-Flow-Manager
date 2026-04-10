import React, { useState, useEffect } from 'react';
import {
  BarChart2, Droplets, AlertTriangle,
  Database, Clock, FileText
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import LoadingOverlay from '../components/LoadingOverlay';
import apiRequest from '../services/api';

/* ── Recharts: Volume History Chart ─────────────────── */
const VolumeChart = ({ data }) => (
  <div style={{ width: '100%', height: '220px', marginTop: '10px' }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00C8AE" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#00C8AE" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(138, 172, 178, 0.15)" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#7A9BA0', fontWeight: 600 }} 
          dy={10} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#7A9BA0', fontWeight: 600 }}
          tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(0)}M` : (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
          width={40}
        />
        <RechartsTooltip
          contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.88)', borderRadius: '12px', fontSize: '13px', color: '#1A3A42', fontWeight: 600, boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}
          itemStyle={{ color: '#00C8AE', fontWeight: 800 }}
          formatter={(value) => [`${Number(value).toLocaleString()} m³`, "Volume d'eau"]}
          labelStyle={{ color: '#5A7A82', marginBottom: '6px' }}
        />
        <Area type="monotone" dataKey="volume_m3" stroke="#00C8AE" strokeWidth={3.5} fillOpacity={1} fill="url(#colorFlow)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

/* ── Recharts: Releases Bar Chart ───────────────────── */
const ReleasesChart = ({ data }) => (
  <div style={{ width: '100%', height: '220px', marginTop: '10px' }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(138, 172, 178, 0.15)" />
        <XAxis 
          dataKey="date_lacher" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#7A9BA0', fontWeight: 600 }} 
          dy={10} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#7A9BA0', fontWeight: 600 }}
          tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(0)}M` : (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
          width={40}
        />
        <RechartsTooltip
          contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.88)', borderRadius: '12px', fontSize: '13px', color: '#1A3A42', fontWeight: 600, boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}
          itemStyle={{ color: '#06b6d4', fontWeight: 800 }}
          formatter={(value) => [`${Number(value).toLocaleString()} m³`, "Volume lâché"]}
          labelStyle={{ color: '#5A7A82', marginBottom: '6px' }}
        />
        <Bar dataKey="volume_m3" fill="#06b6d4" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/* ── Stat Card ────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, unit, sub, subColor, iconColor, progress }) => (
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
      <div style={{ width: '100%', height: '3px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.min(progress, 100)}%`,
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
  const [dashboardData, setDashboardData] = useState(null);
  const [releases, setReleases] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const fixEncoding = (str) => {
    if (!str) return '';
    if (typeof str !== 'string') return str;
    try {
      return decodeURIComponent(escape(str));
    } catch {
      return str;
    }
  };

  useEffect(() => {
    // Fetch overview stats
    apiRequest('/dashboard/overview')
      .then(data => {
        if (data && data.length > 0) {
          setDashboardData(data[0]);
        } else {
          setErrorMsg("Aucune donnée remontée par la base de données.");
        }
      })
      .catch(err => setErrorMsg(err.message));

    // Fetch release history
    apiRequest('/dashboard/history')
      .then(data => setReleases(Array.isArray(data) ? data.slice(0, 10) : []))
      .catch(() => { });

    // Fetch latest alerts
    apiRequest('/alerts')
      .then(data => {
        if (Array.isArray(data)) {
          setAlerts(data);
        }
      })
      .catch(() => { });
  }, []);

  const handleDismiss = (alertId) => {
    const stored = JSON.parse(localStorage.getItem('handledAlerts') || '[]');
    if (!stored.includes(alertId)) {
      stored.push(alertId);
      localStorage.setItem('handledAlerts', JSON.stringify(stored));
    }
    // Force re-render so the banner disappears, but keep alerts in state for the Recent Alerts section
    setAlerts(prev => [...prev]);
  };

  const accentColor = '#00C8AE';

  if (errorMsg) {
    return (
      <div style={{ padding: '40px', color: '#ef4444', fontWeight: 'bold' }}>
        Erreur API Dashboard : {errorMsg}
      </div>
    );
  }

  if (!dashboardData) {
    return <LoadingOverlay message="Analyse du bassin en cours..." />;
  }

  const handledList = JSON.parse(localStorage.getItem('handledAlerts') || '[]');
  const latestCriticalAlert = alerts.find(a => a.severity === 'critique' && !handledList.includes(a.id));

  return (
    <>
      <style>{`
        .dash-container {
          padding: 24px 36px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 14px;
        }

        @media (max-width: 1024px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .charts-grid { grid-template-columns: 1fr; }
          .bottom-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .dash-container { padding: 16px; gap: 14px; }
          .stat-grid { grid-template-columns: 1fr; gap: 10px; }
          .charts-grid, .bottom-grid { gap: 10px; }
        }
      `}</style>

      <div className="dash-container">

        {/* Critical Alert Banner — from DB alerts */}
        {latestCriticalAlert && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: '#fff1f2',
            border: '1px solid #fca5a5',
            borderRadius: '16px',
            padding: '14px 18px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
              background: 'rgba(251,191,36,0.1)',
              border: '1px solid rgba(251,191,36,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertTriangle size={18} color="#f59e0b" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#d97706', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>
                {fixEncoding(latestCriticalAlert.title)}
              </p>
              <p style={{ color: '#374151', fontSize: '13px', margin: 0 }}>
                {fixEncoding(latestCriticalAlert.description)}
              </p>
            </div>
            <button
              onClick={() => handleDismiss(latestCriticalAlert.id)}
              style={{
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: '#d97706',
                border: '1px solid rgba(217,119,6,0.3)',
                borderRadius: '8px', padding: '6px 12px',
                background: 'transparent', cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              Acquitter
            </button>
          </div>
        )}

        {/* Stat Cards — all from API */}
        <div className="stat-grid">
          <StatCard icon={BarChart2} label="Remplissage du Barrage" value={dashboardData.pourcentage_remplissage.toFixed(1)} unit="%" sub={`Capacité: ${Number(dashboardData.capacite_max_m3).toLocaleString()} m³`} subColor={accentColor} iconColor={accentColor} progress={dashboardData.pourcentage_remplissage} />
          <StatCard icon={Droplets} label="Volume d'Eau Actuel" value={(dashboardData.niveau_eau_m3 / 1000000).toFixed(2)} unit="M m³" sub={`Barrage: ${dashboardData.barrage}`} subColor="var(--text-muted)" iconColor="#06b6d4" />
          <StatCard icon={Database} label="Demandes en Attente" value={dashboardData.nb_demandes_en_attente} unit="" sub="Demandes d'irrigation en cours" subColor="var(--text-muted)" iconColor="#818cf8" />
          <StatCard icon={AlertTriangle} label="Alertes Critiques" value={dashboardData.nb_alertes_critiques} unit="" sub={dashboardData.nb_alertes_critiques > 0 ? "Intervention requise" : "Tout est normal"} subColor={dashboardData.nb_alertes_critiques > 0 ? "#ef4444" : "#10b981"} iconColor={dashboardData.nb_alertes_critiques > 0 ? "#ef4444" : "#10b981"} />
        </div>

        {/* Charts Row */}
        <div className="charts-grid">

          {/* Volume History Chart — from API level_history */}
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
                  {dashboardData.barrage}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
                  {"Evolution du volume d'eau sur 5 jours"}
                </p>
              </div>
              <span style={{
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px', padding: '6px 12px',
              }}>
                Vue 5 Jours
              </span>
            </div>
            <VolumeChart data={dashboardData.level_history || []} />
          </div>

          {/* Releases Bar Chart — from /api/dashboard/history */}
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
                  {"L\u00e2chers d'Eau"}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
                  {"Historique des volumes distribu\u00e9s"}
                </p>
              </div>
              <span style={{
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px', padding: '6px 12px',
              }}>
                {releases.length} enregistrements
              </span>
            </div>
            {releases.length > 0 ? (
              <ReleasesChart data={releases} />
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{"Aucun l\u00e2cher enregistr\u00e9."}</p>
            )}
          </div>
        </div>

        {/* Bottom Row: Recent Releases Table + Recent Alerts */}
        <div className="bottom-grid">

          {/* Recent Releases Table — from /api/dashboard/history */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FileText size={16} color={accentColor} />
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '17px', margin: 0 }}>
                {"Derniers L\u00e2chers d'Eau"}
              </h3>
            </div>
            {releases.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {['Date', 'Volume', 'Type', 'Statut', 'Motif', 'Par'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '10px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {releases.slice(0, 5).map((r, i) => (
                      <tr key={r.id_lacher || i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px', color: 'var(--text-primary)', fontWeight: 600 }}>{r.date_lacher}</td>
                        <td style={{ padding: '10px', color: '#06b6d4', fontWeight: 700 }}>{Number(r.volume_m3).toLocaleString()} m³</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                            background: r.type === 'urgence' ? 'rgba(239,68,68,0.1)' : 'rgba(0,200,174,0.1)',
                            color: r.type === 'urgence' ? '#ef4444' : accentColor,
                          }}>{r.type}</span>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                            background: r.status === 'execute' ? 'rgba(16,185,129,0.1)' : r.status === 'approuve' ? 'rgba(6,182,212,0.1)' : 'rgba(251,191,36,0.1)',
                            color: r.status === 'execute' ? '#10b981' : r.status === 'approuve' ? '#06b6d4' : '#f59e0b',
                          }}>{r.status}</span>
                        </td>
                        <td style={{ padding: '10px', color: 'var(--text-secondary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fixEncoding(r.motif) || '-'}</td>
                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{fixEncoding(r.utilisateur)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Aucun historique disponible.</p>
            )}
          </div>

          {/* Recent Alerts — from /api/alerts */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <AlertTriangle size={16} color="#f59e0b" />
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '17px', margin: 0 }}>
                {"Alertes R\u00e9centes"}
              </h3>
            </div>
            {alerts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {alerts.slice(0, 5).map((alert, i) => (
                  <div key={alert.id || i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '12px', borderRadius: '12px',
                    background: alert.severity === 'critique' ? 'rgba(239,68,68,0.05)' : alert.severity === 'warning' ? 'rgba(251,191,36,0.05)' : 'rgba(6,182,212,0.05)',
                    border: `1px solid ${alert.severity === 'critique' ? 'rgba(239,68,68,0.15)' : alert.severity === 'warning' ? 'rgba(251,191,36,0.15)' : 'rgba(6,182,212,0.15)'}`,
                  }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px', flexShrink: 0,
                      background: alert.severity === 'critique' ? '#ef4444' : alert.severity === 'warning' ? '#f59e0b' : '#06b6d4',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>
                        {fixEncoding(alert.title)}
                      </p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0, lineHeight: 1.4 }}>
                        {fixEncoding(alert.description)}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                        <Clock size={10} color="var(--text-muted)" />
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{alert.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{"Aucune alerte en base de donn\u00e9es."}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
