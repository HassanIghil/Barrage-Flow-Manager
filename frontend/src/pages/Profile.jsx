import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiRequest from '../services/api';

/* ── Icons ── */
const EditIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const LockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
const GlobeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);
const BellIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const HistoryIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" />
    </svg>
);
const LangIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
);
const MapIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);
const AwardIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
);
const UsersIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const ChevronIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8AACB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const TABS = [
    { id: 'info', label: 'Informations', title: 'Profil Utilisateur' },
    { id: 'security', label: 'Sécurité', title: 'Sécurité & Accès' },
    { id: 'region', label: 'Région', title: 'Région & Préférences' },
];

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('info');
    const [stats, setStats] = useState({ demandes: 0, lachers: 0, alertes: 0, coops: 0 });
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [passForm, setPassForm] = useState({ old: '', new: '', confirm: '' });
    const [passStatus, setPassStatus] = useState({ type: '', msg: '' });

    // Interactive Toggles State
    const [securityPrefs, setSecurityPrefs] = useState({
        twoFA: true,
        regionSync: true,
        notifs: true,
        highRes: false
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch overview per barrage
                const overview = await apiRequest('/dashboard/overview');
                let dCount = 0, aCount = 0;
                for (const item of overview || []) {
                    dCount += (item.nb_demandes_en_attente || 0);
                    aCount += (item.nb_alertes_critiques || 0);
                }

                // Fetch history
                const history = await apiRequest('/dashboard/history');
                const lCount = (history || []).length;

                setStats({ demandes: dCount, lachers: lCount, alertes: aCount, coops: stats.coops });

                // Fetch real coops count
                const coopsRes = await apiRequest('/admin/management/cooperatives');
                setStats(prev => ({ ...prev, coops: (coopsRes || []).length }));
            } catch (err) {
                console.error("Failed to load real-time stats", err);
            }
        };
        fetchStats();
    }, []);

    const handlePassUpdate = async (e) => {
        e.preventDefault();
        if (passForm.new !== passForm.confirm) {
            setPassStatus({ type: 'error', msg: 'Mots de passe différents' });
            return;
        }
        setPassStatus({ type: 'loading', msg: 'Mise à jour...' });
        try {
            await apiRequest(`/users/change-password?old_password=${encodeURIComponent(passForm.old)}&new_password=${encodeURIComponent(passForm.new)}`, {
                method: 'POST'
            });
            setPassStatus({ type: 'success', msg: 'Modifié avec succès' });
            setTimeout(() => {
                setIsPassModalOpen(false);
                setPassStatus({ type: '', msg: '' });
                setPassForm({ old: '', new: '', confirm: '' });
            }, 1000);
        } catch (err) {
            setPassStatus({ type: 'error', msg: err.message });
        }
    };

    const displayRole = user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : 'Directeur';
    const initials = user?.prenom
        ? `${user.prenom[0]}${user.nom?.[0] || ''}`.toUpperCase()
        : 'HI';
    const fullName = user?.prenom ? `${user.prenom} ${user.nom}` : 'Hassan Ighil';
    const email = user?.email || 'directeur@barrage-yt.ma';

    const currentTab = TABS.find(t => t.id === activeTab);

    const securityRows = [
        { icon: <LockIcon />, label: 'Authentification 2FA', sub: 'SMS + Authenticator', toggle: true, key: 'twoFA' },
        { icon: <GlobeIcon />, label: 'Autorité Régionale', sub: 'MENA — Maroc', toggle: true, key: 'regionSync' },
        { icon: <BellIcon />, label: 'Notifications', sub: 'Email & Push activés', toggle: true, key: 'notifs' },
        { icon: <HistoryIcon />, label: 'Historique de Connexion', sub: 'Dernière: Marrakech, 04:12', active: false },
    ];

    const regionRows = [
        { icon: <LangIcon />, label: 'Langue', sub: 'Français · Arabe (MA)', badge: null },
        { icon: <MapIcon />, label: 'Fuseau Horaire', sub: 'Africa/Casablanca (UTC+1)', badge: null },
        { icon: <AwardIcon />, label: 'Certification', sub: 'Niveau 4 Hydro-Engineering', badge: 'Valide' },
        { icon: <UsersIcon />, label: 'Coopératives Couvertes', sub: `${stats.coops} coopératives · Gérées`, badge: null },
    ];

    const roleMeta = {
        directeur: { dept: 'Direction Générale', cert: 'Expert Conseil & Pilotage' },
        ingenieur: { dept: 'Hydro Opérations', cert: 'Niveau 4 Hydro-Eng.' },
        operateur: { dept: 'Maintenance & Flux', cert: 'Technicien Certifié' },
    }[user?.role?.toLowerCase()] || { dept: 'Opérations', cert: 'Agent de Terrain' };

    const infoFields = [
        { label: 'Prénom', value: user?.prenom || 'Hassan' },
        { label: 'Nom', value: user?.nom || 'Ighil' },
        { label: 'Email', value: email },
        { label: 'Rôle', value: displayRole },
        { label: 'Département', value: roleMeta.dept },
        { label: 'Certification', value: roleMeta.cert },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

                .pr-root {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: stretch;
                    justify-content: stretch;
                    padding: 0;
                    font-family: 'DM Sans', sans-serif;
                    box-sizing: border-box;
                    overflow: hidden;
                }

                .pr-card {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: rgba(255,255,255,0.62);
                    border-left: 1.5px solid rgba(255,255,255,0.88);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    padding: 32px 36px;
                    gap: 24px;
                    overflow-x: hidden;
                    overflow-y: auto;
                }

                .pr-top {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    flex-shrink: 0;
                }

                .pr-avatar {
                    width: 68px; height: 68px; border-radius: 50%;
                    background: linear-gradient(135deg, #00B8A0, #005E70);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: white;
                    border: 3px solid rgba(255,255,255,0.6);
                    box-shadow: 0 8px 24px rgba(0,184,160,0.28);
                    flex-shrink: 0;
                }

                .pr-identity { flex-shrink: 0; }
                .pr-uname {
                    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800;
                    color: #1A3A42; line-height: 1.15; margin-bottom: 3px;
                }
                .pr-uemail { font-size: 12px; color: #7A9BA0; font-weight: 500; margin-bottom: 8px; }
                .pr-pills { display: flex; gap: 6px; }
                .pr-pill {
                    background: rgba(255,255,255,0.7); border: 1.5px solid rgba(255,255,255,0.9);
                    color: #005E70; padding: 4px 12px; border-radius: 100px;
                    font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
                    font-family: 'Syne', sans-serif; display: flex; align-items: center; gap: 5px;
                }
                .pr-pill-dot {
                    width: 5px; height: 5px; border-radius: 50%;
                    background: #00C8AE; box-shadow: 0 0 5px #00C8AE;
                }

                .pr-vdiv { width: 1px; height: 52px; background: rgba(138,172,178,0.25); flex-shrink: 0; }

                .pr-stats { display: flex; gap: 10px; flex-shrink: 0; }
                .pr-stat {
                    background: rgba(255,255,255,0.5); border: 1.5px solid rgba(255,255,255,0.8);
                    border-radius: 18px; padding: 10px 18px; text-align: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.03); flex: 1;
                }
                .pr-stat-val { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #1A3A42; line-height: 1; margin-bottom: 3px; }
                .pr-stat-lbl { font-size: 9px; font-weight: 700; color: #7A9BA0; text-transform: uppercase; letter-spacing: 0.14em; }

                .pr-status {
                    display: flex; align-items: center; gap: 7px;
                    background: rgba(0,200,174,0.1); border: 1px solid rgba(0,200,174,0.22);
                    border-radius: 100px; padding: 7px 14px; flex-shrink: 0;
                }
                .pr-sdot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #00C8AE; box-shadow: 0 0 8px #00C8AE;
                    animation: pr-pulse 2s infinite; flex-shrink: 0;
                }
                @keyframes pr-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: .6; transform: scale(1.3); }
                }
                .pr-stxt {
                    font-size: 9px; font-weight: 700; color: #005E70;
                    text-transform: uppercase; letter-spacing: 0.14em;
                    font-family: 'Syne', sans-serif; white-space: nowrap;
                }

                .pr-spacer { flex: 1; }
                .pr-edit-btn {
                    background: linear-gradient(135deg, #005E70, #003D4D);
                    color: white; border: none; border-radius: 12px;
                    padding: 12px 24px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
                    cursor: pointer; display: flex; align-items: center; gap: 8px;
                    transition: all .2s ease; flex-shrink: 0;
                    white-space: nowrap; min-width: 120px; justify-content: center;
                }
                .pr-edit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,94,112,0.3); }

                .pr-hdiv { width: 100%; height: 1px; background: rgba(138,172,178,0.18); flex-shrink: 0; }

                .pr-nav { display: flex; align-items: center; gap: 20px; flex-shrink: 0; flex-wrap: wrap; }
                .pr-section-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #1A3A42; flex-shrink: 0; min-width: 250px; }
                .pr-tabs {
                    display: flex; gap: 4px; border-radius: 100px; padding: 4px;
                    background: rgba(255,255,255,0.4); border: 1.5px solid rgba(255,255,255,0.8);
                }
                .pr-tab {
                    font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    padding: 6px 16px; border-radius: 100px; border: none;
                    background: transparent; color: #5A7A82; cursor: pointer; transition: all .2s;
                    white-space: nowrap;
                }
                .pr-tab.active { background: linear-gradient(135deg, #005E70, #003D4D); color: white; }

                .pr-pane { flex: 1; min-height: 0; }
                .pr-fields-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
                .pr-field {
                    background: rgba(255,255,255,0.45); border: 1.2px solid rgba(255,255,255,0.7);
                    border-radius: 16px; padding: 18px 24px; min-height: 80px;
                    display: flex; flex-direction: column; justify-content: center;
                }
                .pr-field-lbl { font-size: 10px; font-weight: 700; color: #7A9BA0; text-transform: uppercase; margin-bottom: 4px; }
                .pr-field-val { font-size: 14px; font-weight: 600; color: #11181A; }

                .pr-rows { display: flex; flex-direction: column; gap: 10px; }
                .pr-row {
                    display: flex; align-items: center; gap: 14px;
                    background: rgba(255,255,255,0.48); border: 1.5px solid rgba(255,255,255,0.8);
                    border-radius: 100px; padding: 12px 20px; transition: all .2s; cursor: pointer;
                }
                .pr-row-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #1A3A42; }
                .pr-row-sub { font-size: 11px; color: #7A9BA0; }
                .pr-badge {
                    font-size: 9px; font-weight: 700; color: #005E70; background: rgba(0,200,174,0.12);
                    padding: 3px 10px; border-radius: 100px; text-transform: uppercase; margin-left: auto;
                }

                @media (max-width: 1200px) {
                    .pr-top { flex-wrap: wrap; }
                    .pr-vdiv { display: none; }
                }

                @media (max-width: 768px) {
                    .pr-root { position: relative; padding: 12px; overflow-y: auto; }
                    .pr-card { height: auto; padding: 20px; }
                    .pr-top { flex-direction: column; align-items: flex-start; }
                    .pr-stats { width: 100%; }
                    .pr-nav { flex-direction: column; align-items: stretch; }
                }

                @media (max-width: 480px) {
                    .pr-stat { flex: 1; padding: 8px; }
                    .pr-stat-val { font-size: 16px; }
                    .pr-stat-lbl { font-size: 7px; }
                    .pr-tabs { 
                        overflow-x: auto; padding: 4px;
                        scrollbar-width: none; 
                    }
                    .pr-tabs::-webkit-scrollbar { display: none; }
                    .pr-tab { padding: 8px 14px; font-size: 10px; flex-shrink: 0; }
                    .pr-edit-btn { width: 100%; }
                    .pr-status { width: 100%; justify-content: center; }
                }

                /* MODAL PASS */
                .pm-overlay { 
                    position: fixed; inset: 0; z-index: 9999; background: rgba(7,40,48,0.35); 
                    backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; padding: 20px;
                    animation: pm-fade 0.3s ease;
                }
                @keyframes pm-fade { from { opacity: 0; } to { opacity: 1; } }
                .pm-modal { 
                    width: 100%; max-width: 420px; background: white; border-radius: 32px; padding: 36px; 
                    position: relative; box-shadow: 0 40px 120px rgba(0,0,0,0.15); 
                }
                .pm-close { position: absolute; top: 24px; right: 24px; cursor: pointer; color: #8AACB2; }
                .pm-input { width: 100%; border: 1.5px solid #E5EEF0; border-radius: 100px; padding: 14px 22px; margin-bottom: 12px; font-size: 14px; outline: none; }
                .pm-btn { width: 100%; background: #005E70; color: white; border: none; border-radius: 100px; padding: 16px; font-family: 'Syne', sans-serif; font-weight: 700; cursor: pointer; }
                .pm-status { padding: 12px; border-radius: 12px; font-size: 12px; text-align: center; margin-bottom: 16px; font-weight: 600; }
                .pm-status.error { background: #fee2e2; color: #dc2626; }
                .pm-status.success { background: #d1fae5; color: #059669; }

                /* TOGGLE CSS */
                .le-switch {
                    position: relative; display: inline-block; width: 32px; height: 18px; flex-shrink: 0;
                }
                .le-switch input { opacity: 0; width: 0; height: 0; }
                .le-slider {
                    position: absolute; cursor: pointer; inset: 0; background-color: #CBD8DB;
                    transition: .4s; border-radius: 34px;
                }
                .le-slider:before {
                    position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px;
                    background-color: white; transition: .4s; border-radius: 50%;
                }
                input:checked + .le-slider { background-color: #00C8AE; }
                input:checked + .le-slider:before { transform: translateX(14px); }
            `}</style>

            <div className="pr-root">
                <div className="pr-card">
                    <div className="pr-top">
                        <div className="pr-avatar">{initials}</div>
                        <div className="pr-identity">
                            <div className="pr-uname">{fullName}</div>
                            <div className="pr-uemail">{email}</div>
                            <div className="pr-pills">
                                <div className="pr-pill"><span className="pr-pill-dot" />{displayRole}</div>
                                <div className="pr-pill">Hydraulique</div>
                            </div>
                        </div>
                        <div className="pr-vdiv" />
                        <div className="pr-stats">
                            <div className="pr-stat"><div className="pr-stat-val">{stats.demandes}</div><div className="pr-stat-lbl">Demandes</div></div>
                            <div className="pr-stat"><div className="pr-stat-val">{stats.lachers}</div><div className="pr-stat-lbl">Lâchers</div></div>
                            <div className="pr-stat"><div className="pr-stat-val">{stats.alertes}</div><div className="pr-stat-lbl">Alertes</div></div>
                        </div>
                        <div className="pr-status"><span className="pr-sdot" /><span className="pr-stxt">Infrastructure Opérationnelle</span></div>
                    </div>

                    <div className="pr-hdiv" />

                    <div className="pr-nav">
                        <div className="pr-section-title">{currentTab.title}</div>
                        <div className="pr-tabs">
                            {TABS.map(t => (
                                <button key={t.id} className={`pr-tab${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
                            ))}
                        </div>

                        <div className="pr-spacer" style={{ display: 'block' }} />

                        {activeTab == 'security' && (
                            <button className="pr-edit-btn" onClick={() => setIsPassModalOpen(true)}>
                                <EditIcon />
                                <span>Mot de passe</span>
                            </button>
                        )}
                    </div>

                    <div className="pr-pane">
                        {activeTab === 'info' && (
                            <div className="pr-fields-grid">
                                {infoFields.map((f, i) => (
                                    <div key={i} className="pr-field"><div className="pr-field-lbl">{f.label}</div><div className="pr-field-val">{f.value}</div></div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'security' && (
                            <div className="pr-rows">
                                {securityRows.map((r, i) => (
                                    <div key={i} className="pr-row" onClick={r.action}>
                                        <div style={{ flex: 1 }}>
                                            <div className="pr-row-name">{r.label}</div>
                                            <div className="pr-row-sub">{r.sub}</div>
                                        </div>
                                        {r.toggle ? (
                                            <label className="le-switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={securityPrefs[r.key]} 
                                                    onChange={() => setSecurityPrefs({...securityPrefs, [r.key]: !securityPrefs[r.key]})}
                                                />
                                                <span className="le-slider"></span>
                                            </label>
                                        ) : (
                                            r.active && <span className="pr-badge">Historique</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'region' && (
                            <div className="pr-rows">
                                {regionRows.map((r, i) => (
                                    <div key={i} className="pr-row"><div style={{ flex: 1 }}><div className="pr-row-name">{r.label}</div><div className="pr-row-sub">{r.sub}</div></div>{r.badge && <span className="pr-badge">{r.badge}</span>}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isPassModalOpen && (
                <div className="pm-overlay" onClick={() => setIsPassModalOpen(false)}>
                    <div className="pm-modal" onClick={e => e.stopPropagation()}>
                        <div className="pm-close" onClick={() => setIsPassModalOpen(false)}>✕</div>
                        <h2 style={{ fontFamily: 'Syne', marginBottom: 8, fontSize: 22 }}>Sécurité</h2>
                        <p style={{ fontSize: 12, color: '#8AACB2', marginBottom: 20 }}>Mise à jour de votre mot de passe AquaFlow.</p>

                        {passStatus.msg && <div className={`pm-status ${passStatus.type}`}>{passStatus.msg}</div>}

                        <form onSubmit={handlePassUpdate}>
                            <input className="pm-input" type="password" placeholder="Mot de passe actuel" value={passForm.old} onChange={e => setPassForm({ ...passForm, old: e.target.value })} required />
                            <input className="pm-input" type="password" placeholder="Nouveau mot de passe" value={passForm.new} onChange={e => setPassForm({ ...passForm, new: e.target.value })} required />
                            <input className="pm-input" type="password" placeholder="Confirmer" value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} required />
                            <button className="pm-btn" type="submit">Enregistrer</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;