import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/* ── Inline SVG icons ── */
const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);
const GlobeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
);
const BellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
);
const HistoryIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
    </svg>
);
const DropIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
    </svg>
);
const UsersIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);
const ZapIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
);
const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);
const ChevronIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A5BEC3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
    </svg>
);
const LangIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
        <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
);
const MapIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);
const AwardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
);

const Profile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const displayRole = user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : 'Directeur';

    const initials = user?.prenom
        ? `${user.prenom[0]}${user.nom?.[0] || ''}`.toUpperCase()
        : 'HI';

    const fullName = user?.prenom ? `${user.prenom} ${user.nom}` : 'Hassan Ighil';
    const email = user?.email || 'directeur@barrage-yt.ma';

    const tabs = [
        { id: 'overview', label: 'Vue Générale' },
        { id: 'security', label: 'Sécurité' },
        { id: 'preferences', label: 'Préférences' },
    ];

    const securityItems = [
        { icon: <LockIcon />, label: 'Authentification à Deux Facteurs', detail: 'SMS + Application Authenticator', active: true },
        { icon: <GlobeIcon />, label: 'Autorité Régionale', detail: 'MENA — Maroc', active: true },
        { icon: <BellIcon />, label: 'Notifications', detail: 'Email & Push activés', active: true },
        { icon: <HistoryIcon />, label: 'Historique de Connexion', detail: 'Dernière: Marrakech, 04:12', active: false },
    ];

    const prefItems = [
        { icon: <LangIcon />, label: 'Langue', detail: 'Français • Arabe (MA)' },
        { icon: <MapIcon />, label: 'Fuseau Horaire', detail: 'Africa/Casablanca (UTC+1)' },
        { icon: <AwardIcon />, label: 'Certification', detail: 'Niveau 4 Hydro-Engineering' },
    ];

    const bottomCards = [
        { icon: <DropIcon />, title: "Lâchers Récents", desc: "2 lâchers normaux validés aujourd'hui pour un volume cumulé de 4 500 m³." },
        { icon: <UsersIcon />, title: "Réseau Coopératives", desc: "24 coopératives agricoles (2 800 Ha) couvertes par le débit entrant." },
        { icon: <ZapIcon />, title: "Alertes Actives", desc: "Sécurité maximale. Aucun risque de débordement ni d'urgence détecté." },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

                .pr-root {
                    min-height: 100%;
                    width: 100%;
                    background: #D4DCDE;
                    font-family: 'DM Sans', sans-serif;
                    position: relative;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                .pr-root::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
                    pointer-events: none;
                    opacity: 0.5;
                    z-index: 0;
                }

                .pr-content {
                    position: relative;
                    z-index: 1;
                    padding: clamp(24px, 4vh, 48px) clamp(24px, 4vw, 40px);
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                    flex: 1;
                }

                .eyebrow {
                    font-size: 10px;
                    font-weight: 700;
                    color: #7A9BA0;
                    text-transform: uppercase;
                    letter-spacing: 0.22em;
                    margin-bottom: clamp(6px, 1vh, 12px);
                }

                .page-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(28px, 3.5vw, 42px);
                    font-weight: 800;
                    color: #1A3A42;
                    line-height: 1.1;
                    letter-spacing: -0.025em;
                    margin-bottom: 8px;
                }

                .page-desc {
                    font-size: 14px;
                    color: #5A7A82;
                    font-weight: 400;
                    margin-bottom: clamp(24px, 4vh, 40px);
                    line-height: 1.6;
                    max-width: 560px;
                }

                /* Glass card — same as Login right panel inputs */
                .glass-card {
                    background: rgba(255,255,255,0.55);
                    border: 1.5px solid rgba(255,255,255,0.8);
                    border-radius: 28px;
                    padding: 32px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.03), inset 0 2px 4px rgba(255,255,255,0.6);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                }

                .profile-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 24px;
                }

                @media (min-width: 1024px) {
                    .profile-grid { grid-template-columns: 1.6fr 1fr; }
                }

                .avatar-wrap {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #00B8A0, #005E70);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Syne', sans-serif;
                    font-size: 32px;
                    font-weight: 800;
                    color: white;
                    border: 4px solid rgba(255,255,255,0.8);
                    box-shadow: 0 8px 24px rgba(0,184,160,0.3);
                    flex-shrink: 0;
                }

                .id-header {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    margin-bottom: 28px;
                }

                .user-name {
                    font-family: 'Syne', sans-serif;
                    font-size: 26px;
                    font-weight: 800;
                    color: #1A3A42;
                    letter-spacing: -0.02em;
                    line-height: 1.1;
                    margin-bottom: 4px;
                    text-transform: capitalize;
                }

                .user-email {
                    font-size: 13px;
                    color: #7A9BA0;
                    font-weight: 500;
                    margin-bottom: 12px;
                }

                .role-pills {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .pill {
                    background: rgba(255,255,255,0.8);
                    border: 1px solid rgba(0,184,160,0.3);
                    color: #005E70;
                    padding: 6px 14px;
                    border-radius: 100px;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .pill-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #00C8AE;
                    box-shadow: 0 0 6px #00C8AE;
                }

                /* Stats row — identical to Login */
                .stats-container {
                    display: flex;
                    justify-content: space-between;
                    background: rgba(255,255,255,0.4);
                    border: 1px solid rgba(255,255,255,0.6);
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 28px;
                }

                .stat-box {
                    text-align: center;
                    flex: 1;
                    border-right: 1px solid rgba(138,172,178,0.2);
                }

                .stat-box:last-child { border-right: none; }

                .stat-num {
                    font-family: 'Syne', sans-serif;
                    font-size: 28px;
                    font-weight: 800;
                    color: #1A3A42;
                    line-height: 1;
                    margin-bottom: 6px;
                }

                .stat-label-sm {
                    font-size: 10px;
                    font-weight: 700;
                    color: #7A9BA0;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }

                /* Buttons — exact Login style */
                .action-row {
                    display: flex;
                    gap: 16px;
                }

                .btn-primary {
                    flex: 1;
                    background: linear-gradient(135deg, #005E70 0%, #003D4D 100%);
                    color: white;
                    font-family: 'Syne', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    border: none;
                    border-radius: 100px;
                    padding: 14px 24px;
                    cursor: pointer;
                    letter-spacing: 0.01em;
                    box-shadow: 0 8px 24px rgba(0,94,112,0.2);
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 12px 32px rgba(0,94,112,0.3);
                }

                .btn-secondary {
                    flex: 1;
                    background: rgba(255,255,255,0.7);
                    color: #1A3A42;
                    border: 1.5px solid rgba(255,255,255,0.9);
                    font-family: 'Syne', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    border-radius: 100px;
                    padding: 14px 24px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-secondary:hover {
                    background: #ffffff;
                    color: #DC2626;
                }

                .btn-danger {
                    flex: 1;
                    background: rgba(239,68,68,0.1);
                    color: #DC2626;
                    border: 1.5px solid rgba(239,68,68,0.3);
                    font-family: 'Syne', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    border-radius: 100px;
                    padding: 14px 24px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-danger:hover {
                    background: rgba(239,68,68,0.15);
                    border-color: rgba(239,68,68,0.5);
                    color: #B91C1C;
                }

                /* Tab bar — pill style matching Login submit btn */
                .tab-bar {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                }

                .tab-btn {
                    font-family: 'Syne', sans-serif;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    padding: 10px 22px;
                    border-radius: 100px;
                    border: 1.5px solid rgba(255,255,255,0.7);
                    background: rgba(255,255,255,0.45);
                    color: #5A7A82;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                }

                .tab-btn.active {
                    background: linear-gradient(135deg, #005E70 0%, #003D4D 100%);
                    color: white;
                    border-color: transparent;
                    box-shadow: 0 8px 24px rgba(0,94,112,0.25);
                }

                .tab-btn:not(.active):hover {
                    background: rgba(255,255,255,0.7);
                    color: #1A3A42;
                }

                /* List items */
                .glass-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .list-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: rgba(255,255,255,0.4);
                    border: 1px solid rgba(255,255,255,0.6);
                    padding: 16px 20px;
                    border-radius: 16px;
                    transition: background 0.2s;
                    cursor: pointer;
                }

                .list-item:hover { background: rgba(255,255,255,0.65); }

                .list-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 11px;
                    background: linear-gradient(135deg, rgba(0,184,160,0.15), rgba(0,94,112,0.1));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #00897A;
                    flex-shrink: 0;
                }

                .list-name {
                    font-family: 'Syne', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    color: #1A3A42;
                    margin-bottom: 2px;
                }

                .list-sub {
                    font-size: 12px;
                    font-weight: 500;
                    color: #5A7A82;
                }

                .active-badge {
                    font-size: 9px;
                    font-weight: 700;
                    color: #005E70;
                    background: rgba(0,200,174,0.15);
                    border: 1px solid rgba(0,200,174,0.3);
                    padding: 4px 12px;
                    border-radius: 100px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    white-space: nowrap;
                }

                /* Dark card — mirrors Login left panel exactly */
                .dark-card {
                    border-radius: 28px;
                    overflow: hidden;
                    position: relative;
                    background: linear-gradient(160deg, #1A4F5C 0%, #0D3540 55%, #072830 100%);
                    border: 1.5px solid rgba(255,255,255,0.08);
                    padding: 28px 32px;
                }

                .dark-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
                    background-size: 48px 48px;
                    pointer-events: none;
                }

                .dark-card::after {
                    content: '';
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(0,180,160,0.16) 0%, transparent 70%);
                    bottom: -80px;
                    right: -60px;
                    pointer-events: none;
                }

                .dark-eyebrow {
                    font-size: 10px;
                    font-weight: 700;
                    color: #00C8AE;
                    text-transform: uppercase;
                    letter-spacing: 0.22em;
                    margin-bottom: 12px;
                    position: relative;
                    z-index: 1;
                }

                .dark-headline {
                    font-family: 'Syne', sans-serif;
                    font-size: 17px;
                    font-weight: 700;
                    color: white;
                    line-height: 1.4;
                    margin-bottom: 20px;
                    position: relative;
                    z-index: 1;
                }

                .status-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    position: relative;
                    z-index: 1;
                }

                .status-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #00C8AE;
                    box-shadow: 0 0 10px #00C8AE;
                    animation: pulse 2s infinite;
                    flex-shrink: 0;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.3); }
                }

                .status-text {
                    font-size: 11px;
                    font-weight: 700;
                    color: rgba(255,255,255,0.5);
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }

                /* Read-only input fields — mimic Login field-input but static */
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                    gap: 16px;
                }

                .info-field {
                    background: rgba(255,255,255,0.45);
                    border: 1.5px solid rgba(255,255,255,0.7);
                    border-radius: 100px;
                    padding: 14px 22px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.03), inset 0 1px 2px rgba(255,255,255,0.5);
                }

                .info-field-label {
                    font-size: 9px;
                    font-weight: 700;
                    color: #7A9BA0;
                    text-transform: uppercase;
                    letter-spacing: 0.18em;
                    margin-bottom: 4px;
                }

                .info-field-value {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1A3A42;
                    text-transform: capitalize;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-family: 'DM Sans', sans-serif;
                }

                /* Bottom mini cards */
                .bottom-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 24px;
                    margin-top: 24px;
                }

                @media (min-width: 768px) {
                    .bottom-grid { grid-template-columns: repeat(3, 1fr); }
                }

                .mini-card {
                    background: rgba(255,255,255,0.55);
                    border: 1.5px solid rgba(255,255,255,0.8);
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.02);
                }

                .mini-card h4 {
                    font-family: 'Syne', sans-serif;
                    font-size: 15px;
                    font-weight: 700;
                    color: #1A3A42;
                    margin: 12px 0 6px;
                }

                .mini-card p {
                    font-size: 12px;
                    color: #5A7A82;
                    line-height: 1.6;
                }
            `}</style>

            <div className="pr-root">
                <div className="pr-content">

                    {/* ── Page Header ── */}
                    <div style={{ marginBottom: 'clamp(24px, 4vh, 40px)' }}>
                        <p className="eyebrow">Paramètres du Compte</p>
                        <h1 className="page-title">Profil Utilisateur</h1>
                        <p className="page-desc">
                            Gérez votre identité et vos autorisations pour le pilotage du barrage Youssef Ibn Tachfine et l'irrigation Souss-Massa.
                        </p>
                    </div>

                    {/* ── Tab Bar ── */}
                    <div className="tab-bar">
                        {tabs.map(t => (
                            <button
                                key={t.id}
                                className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
                                onClick={() => setActiveTab(t.id)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* ══ OVERVIEW ══ */}
                    {activeTab === 'overview' && (
                        <>
                            <div className="profile-grid">

                                {/* Identity card */}
                                <div className="glass-card">
                                    <div className="id-header">
                                        <div className="avatar-wrap">{initials}</div>
                                        <div>
                                            <h2 className="user-name">{fullName}</h2>
                                            <p className="user-email">{email}</p>
                                            <div className="role-pills">
                                                <div className="pill">
                                                    <span className="pill-dot" />
                                                    {displayRole}
                                                </div>
                                                <div className="pill">Hydraulique</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="stats-container">
                                        <div className="stat-box">
                                            <div className="stat-num">145</div>
                                            <div className="stat-label-sm">Demandes Traitées</div>
                                        </div>
                                        <div className="stat-box">
                                            <div className="stat-num">18</div>
                                            <div className="stat-label-sm">Lâchers Autorisés</div>
                                        </div>
                                        <div className="stat-box">
                                            <div className="stat-num">0</div>
                                            <div className="stat-label-sm">Alertes Actives</div>
                                        </div>
                                    </div>

                                    <div className="action-row">
                                        <button className="btn-primary">
                                            <EditIcon /> Modifier le Profil
                                        </button>
                                        <button className="btn-danger" onClick={logout}>Déconnexion</button>
                                    </div>
                                </div>

                                {/* Right column */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                                    {/* Pending requests */}
                                    <div className="glass-card" style={{ padding: '24px 28px', flex: 1 }}>
                                        <p className="eyebrow" style={{ marginBottom: 16 }}>Demandes en Attente</p>
                                        <div className="glass-list">
                                            <div className="list-item">
                                                <div className="list-icon"><DropIcon /></div>
                                                <div style={{ flex: 1 }}>
                                                    <div className="list-name">Coopérative Al Amal</div>
                                                    <div className="list-sub" style={{ color: '#D97706' }}>2 500 m³ • Priorité Élevée</div>
                                                </div>
                                                <ChevronIcon />
                                            </div>
                                            <div className="list-item">
                                                <div className="list-icon"><DropIcon /></div>
                                                <div style={{ flex: 1 }}>
                                                    <div className="list-name">Domaine Ait Baha</div>
                                                    <div className="list-sub">850 m³ • En attente de validation</div>
                                                </div>
                                                <ChevronIcon />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dark status card — mirrors Login left panel */}
                                    <div className="dark-card">
                                        <p className="dark-eyebrow">Barrage Y. Tachfine</p>
                                        <p className="dark-headline">
                                            "Niveau d'eau stable et distribution optimale aux coopératives agricoles."
                                        </p>
                                        <div className="status-row">
                                            <span className="status-dot" />
                                            <span className="status-text">Infrastructure Opérationnelle</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom mini cards */}
                            <div className="bottom-grid">
                                {bottomCards.map((c, i) => (
                                    <div key={i} className="mini-card">
                                        <div className="list-icon" style={{ width: 40, height: 40, borderRadius: 12 }}>{c.icon}</div>
                                        <h4>{c.title}</h4>
                                        <p>{c.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ══ SECURITY ══ */}
                    {activeTab === 'security' && (
                        <div className="glass-card">
                            <p className="eyebrow" style={{ marginBottom: 20 }}>Sécurité &amp; Accès</p>
                            <div className="glass-list">
                                {securityItems.map((item, i) => (
                                    <div key={i} className="list-item">
                                        <div className="list-icon">{item.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div className="list-name">{item.label}</div>
                                            <div className="list-sub">{item.detail}</div>
                                        </div>
                                        {item.active && <span className="active-badge">Actif</span>}
                                        <ChevronIcon />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ══ PREFERENCES ══ */}
                    {activeTab === 'preferences' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div className="glass-card">
                                <p className="eyebrow" style={{ marginBottom: 20 }}>Informations Personnelles</p>
                                <div className="info-grid">
                                    {[
                                        { label: 'Prénom', value: user?.prenom || 'Hassan' },
                                        { label: 'Nom', value: user?.nom || 'Ighil' },
                                        { label: 'Email', value: email },
                                        { label: 'Rôle', value: displayRole },
                                        { label: 'Région', value: 'MENA — Maroc' },
                                        { label: 'Département', value: 'Hydro Opérations' },
                                    ].map((f, i) => (
                                        <div key={i} className="info-field">
                                            <div className="info-field-label">{f.label}</div>
                                            <div className="info-field-value">{f.value}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="action-row" style={{ marginTop: 24 }}>
                                    <button className="btn-primary">
                                        <EditIcon /> Enregistrer les Modifications
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card">
                                <p className="eyebrow" style={{ marginBottom: 20 }}>Paramètres Régionaux</p>
                                <div className="glass-list">
                                    {prefItems.map((item, i) => (
                                        <div key={i} className="list-item">
                                            <div className="list-icon">{item.icon}</div>
                                            <div style={{ flex: 1 }}>
                                                <div className="list-name">{item.label}</div>
                                                <div className="list-sub">{item.detail}</div>
                                            </div>
                                            <ChevronIcon />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Profile;