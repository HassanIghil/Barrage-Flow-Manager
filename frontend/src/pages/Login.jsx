import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [keepSigned, setKeepSigned] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const success = await login(email, password);
            if (success) {
                navigate('/');
            } else {
                setError("Email ou mot de passe incorrect");
            }
        } catch (err) {
            setError(err.message || "Erreur de connexion");
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

                html, body, #root {
                    height: 100%;
                    overflow: hidden;
                }

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .login-root {
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    background: #C8D8D9;
                    font-family: 'DM Sans', sans-serif;
                    overflow: hidden;
                    position: fixed;
                    top: 0; left: 0;
                }

                /* ─── LEFT PANEL ─────────────────────────────── */
                .left-panel {
                    width: 52%;
                    background: linear-gradient(160deg, #1A4F5C 0%, #0D3540 55%, #072830 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: clamp(28px, 4vh, 52px) clamp(28px, 4vw, 56px);
                    position: relative;
                    overflow: hidden;
                }

                /* subtle grid overlay */
                .left-panel::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
                    background-size: 48px 48px;
                    pointer-events: none;
                }

                /* glowing orb */
                .left-panel::after {
                    content: '';
                    position: absolute;
                    width: 520px;
                    height: 520px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(0,180,160,0.18) 0%, transparent 70%);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                }

                .brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    position: relative;
                    z-index: 1;
                }

                .brand-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #00B8A0, #007A6E);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 20px rgba(0,184,160,0.3);
                }

                .brand-name {
                    font-family: 'Syne', sans-serif;
                    font-size: 15px;
                    font-weight: 700;
                    color: white;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }

                .left-center {
                    position: relative;
                    z-index: 1;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: clamp(16px, 2vh, 40px) 0;
                    min-height: 0;
                }

                /* Decorative dam/water illustration */
                .dam-illustration {
                    width: 100%;
                    max-width: clamp(200px, 28vw, 380px);
                    margin: 0 auto clamp(20px, 3vh, 48px);
                    flex-shrink: 1;
                }

                .left-headline {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(22px, 2.8vw, 38px);
                    font-weight: 800;
                    color: #ffffff;
                    line-height: 1.15;
                    letter-spacing: -0.02em;
                    margin-bottom: clamp(10px, 1.5vh, 18px);
                }

                .left-headline span {
                    color: #00C8AE;
                }

                .left-desc {
                    font-size: clamp(12px, 1.1vw, 14px);
                    color: rgba(255,255,255,0.5);
                    line-height: 1.7;
                    max-width: 300px;
                    font-weight: 400;
                }

                /* Stats row */
                .stats-row {
                    display: flex;
                    gap: clamp(16px, 2.5vw, 32px);
                    margin-top: clamp(20px, 3vh, 48px);
                    position: relative;
                    z-index: 1;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .stat-value {
                    font-family: 'Syne', sans-serif;
                    font-size: 22px;
                    font-weight: 700;
                    color: #ffffff;
                }

                .stat-label {
                    font-size: 11px;
                    color: rgba(255,255,255,0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    font-weight: 500;
                }

                .stat-divider {
                    width: 1px;
                    background: rgba(255,255,255,0.1);
                    align-self: stretch;
                }

                /* Status bar */
                .left-footer {
                    display: flex;
                    align-items: center;
                    gap: 10px;
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
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.3); }
                }

                .status-text {
                    font-size: 11px;
                    font-weight: 600;
                    color: rgba(255,255,255,0.45);
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }

                /* ─── RIGHT PANEL ─────────────────────────────── */
                .right-panel {
                    width: 48%;
                    background: #D4DCDE;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: clamp(24px, 4vh, 48px) clamp(24px, 4vw, 40px);
                    position: relative;
                    overflow: hidden;
                }

                /* subtle noise texture */
                .right-panel::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
                    pointer-events: none;
                    opacity: 0.5;
                }

                .login-card {
                    width: 100%;
                    max-width: 400px;
                    position: relative;
                    z-index: 1;
                }

                .card-eyebrow {
                    font-size: 10px;
                    font-weight: 700;
                    color: #7A9BA0;
                    text-transform: uppercase;
                    letter-spacing: 0.22em;
                    margin-bottom: clamp(6px, 1vh, 12px);
                }

                .card-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(24px, 2.8vw, 34px);
                    font-weight: 800;
                    color: #1A3A42;
                    line-height: 1.1;
                    letter-spacing: -0.025em;
                    margin-bottom: 6px;
                }

                .card-subtitle {
                    font-size: 13px;
                    color: #7A9BA0;
                    font-weight: 400;
                    margin-bottom: clamp(20px, 3.5vh, 44px);
                    line-height: 1.5;
                }

                /* Form fields */
                .field-group {
                    margin-bottom: clamp(12px, 1.8vh, 20px);
                }

                .field-label {
                    display: block;
                    font-size: 10px;
                    font-weight: 700;
                    color: #7A9BA0;
                    text-transform: uppercase;
                    letter-spacing: 0.18em;
                    margin-bottom: 10px;
                    padding-left: 4px;
                }

                .field-wrap {
                    position: relative;
                }

                .field-icon {
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #8AACB2;
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                }

                .field-input {
                    width: 100%;
                    background: rgba(255,255,255,0.45);
                    border: 1.5px solid rgba(255,255,255,0.7);
                    border-radius: 100px;
                    padding: clamp(12px, 1.6vh, 16px) 20px clamp(12px, 1.6vh, 16px) 50px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1A3A42;
                    font-family: 'DM Sans', sans-serif;
                    outline: none;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 2px rgba(255,255,255,0.5);
                }

                .field-input::placeholder { color: #A5BEC3; }

                .field-input:focus {
                    background: rgba(255,255,255,0.7);
                    border-color: rgba(0,184,160,0.4);
                    box-shadow: 0 0 0 4px rgba(0,184,160,0.08), 0 2px 8px rgba(0,0,0,0.04);
                }

                /* Password field */
                .field-row-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    padding: 0 4px;
                }

                .forgot-link {
                    font-size: 10px;
                    font-weight: 700;
                    color: #00897A;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    transition: color 0.15s;
                }

                .forgot-link:hover { color: #005E70; }

                /* Checkbox */
                .checkbox-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: clamp(14px, 2vh, 24px) 0 clamp(16px, 2.2vh, 28px);
                    cursor: pointer;
                    user-select: none;
                }

                .checkbox-box {
                    width: 20px;
                    height: 20px;
                    border-radius: 6px;
                    border: 2px solid;
                    border-color: ${'' /* dynamic */}'#CBD8DB';
                    background: rgba(255,255,255,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.15s;
                    flex-shrink: 0;
                }

                .checkbox-box.checked {
                    background: #005E70;
                    border-color: #005E70;
                }

                .checkbox-label {
                    font-size: 13px;
                    font-weight: 500;
                    color: #5A7A82;
                }

                /* Error */
                .error-box {
                    background: rgba(239,68,68,0.08);
                    border: 1px solid rgba(239,68,68,0.2);
                    border-radius: 16px;
                    padding: 12px 18px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #DC2626;
                    margin-bottom: 20px;
                    text-align: center;
                }

                /* Submit button */
                .submit-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #005E70 0%, #003D4D 100%);
                    color: white;
                    font-family: 'Syne', sans-serif;
                    font-size: 15px;
                    font-weight: 700;
                    border: none;
                    border-radius: 100px;
                    padding: clamp(14px, 1.8vh, 18px) 32px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    letter-spacing: 0.01em;
                    box-shadow: 0 12px 32px rgba(0,94,112,0.28), 0 4px 12px rgba(0,0,0,0.1);
                    transition: all 0.2s ease;
                    position: relative;
                    overflow: hidden;
                }

                .submit-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.07), transparent);
                    pointer-events: none;
                }

                .submit-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 16px 40px rgba(0,94,112,0.35), 0 6px 16px rgba(0,0,0,0.12);
                }

                .submit-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 8px 20px rgba(0,94,112,0.2);
                }

                .btn-arrow {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.12);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }

                .submit-btn:hover .btn-arrow {
                    background: rgba(255,255,255,0.2);
                }

                /* Footer */
                .card-footer {
                    margin-top: clamp(16px, 2.5vh, 28px);
                    text-align: center;
                }

                .card-footer p {
                    font-size: 11px;
                    font-weight: 600;
                    color: #8AACB2;
                    text-transform: uppercase;
                    letter-spacing: 0.16em;
                }

                .card-footer span {
                    color: #00897A;
                    cursor: pointer;
                    transition: color 0.15s;
                }

                .card-footer span:hover { color: #005E70; text-decoration: underline; }

                /* Mobile-only status pill — hidden on desktop */
                .mobile-status {
                    display: none;
                    align-items: center;
                    gap: 8px;
                }

                /* ─── RESPONSIVE ──────────────────────────────── */

                /* Tablet: side by side but tighter */
                @media (max-width: 900px) {
                    .left-panel { width: 45%; padding: 28px 28px; }
                    .right-panel { width: 55%; padding: 28px 24px; }
                    .dam-illustration { display: none; }
                    .left-desc { display: none; }
                }

                /* Mobile: stacked, scrollable only on right */
                @media (max-width: 640px) {
                    .login-root {
                        flex-direction: column;
                        position: fixed;
                        overflow: hidden;
                    }

                    .left-panel {
                        width: 100%;
                        flex: 0 0 auto;
                        padding: 28px 24px 24px;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        gap: 16px;
                    }

                    .left-center { display: none; }

                    .left-footer { display: none; }
                    .mobile-status { display: flex; }

                    .brand-logo { flex-shrink: 0; }

                    /* Show mini stats inline on mobile header */
                    .stats-row {
                        margin-top: 0;
                        gap: 16px;
                    }

                    .stat-value {
                        font-size: 14px;
                    }

                    .stat-label {
                        font-size: 9px;
                    }

                    .stat-divider { display: none; }

                    .right-panel {
                        width: 100%;
                        flex: 1;
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                        align-items: flex-start;
                        padding: 32px 24px 40px;
                    }

                    .login-card {
                        max-width: 100%;
                        width: 100%;
                    }

                    .card-title { font-size: 30px; }
                }
            `}</style>

            <div className="login-root">

                {/* ── LEFT ───────────────────────────────────── */}
                <div className="left-panel">
                    {/* Brand */}
                    <div className="brand-logo">
                        <div className="brand-icon">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <path d="M3 16 Q6 10 11 12 Q16 14 19 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                                <circle cx="11" cy="17" r="2.5" fill="rgba(255,255,255,0.5)"/>
                                <path d="M5 19 H17" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <span className="brand-name">AquaFlow&nbsp;<span style={{fontWeight:400, opacity:.5}}>|</span>&nbsp;Taroudant</span>
                    </div>

                    {/* Center content */}
                    <div className="left-center">
                        {/* Minimal dam SVG illustration */}
                        <div className="dam-illustration">
                            <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Water surface */}
                                <ellipse cx="180" cy="80" rx="160" ry="40" fill="rgba(0,180,160,0.08)"/>
                                {/* Dam body */}
                                <path d="M100 160 L120 60 L240 60 L260 160 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
                                {/* Dam face detail */}
                                <path d="M120 60 L240 60 L238 65 L122 65 Z" fill="rgba(0,200,174,0.15)"/>
                                {/* Water level */}
                                <path d="M60 82 Q120 70 180 78 Q240 86 300 74 L300 110 Q240 122 180 114 Q120 106 60 118 Z" fill="rgba(0,180,160,0.12)"/>
                                <path d="M60 82 Q120 70 180 78 Q240 86 300 74" stroke="rgba(0,200,174,0.4)" strokeWidth="1.5" fill="none"/>
                                {/* Flow lines */}
                                <path d="M180 160 L180 190" stroke="rgba(0,200,174,0.3)" strokeWidth="3" strokeLinecap="round"/>
                                <path d="M168 168 L192 168" stroke="rgba(0,200,174,0.2)" strokeWidth="2" strokeLinecap="round"/>
                                {/* Left mountain */}
                                <path d="M0 160 L60 90 L100 160 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                                {/* Right mountain */}
                                <path d="M260 160 L310 85 L360 160 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                                {/* Grid lines on dam */}
                                <line x1="140" y1="60" x2="128" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                                <line x1="160" y1="60" x2="150" y2="160" strokeWidth="1" stroke="rgba(255,255,255,0.05)"/>
                                <line x1="180" y1="60" x2="180" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                                <line x1="200" y1="60" x2="210" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                                <line x1="220" y1="60" x2="232" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                                {/* Horizontal dam lines */}
                                <line x1="110" y1="90" x2="250" y2="90" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                                <line x1="105" y1="120" x2="255" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                                <line x1="100" y1="150" x2="260" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                                {/* Sensor dots */}
                                <circle cx="180" cy="78" r="3" fill="#00C8AE" opacity="0.8"/>
                                <circle cx="180" cy="78" r="6" fill="none" stroke="#00C8AE" strokeWidth="1" opacity="0.3"/>
                                <circle cx="130" cy="130" r="2" fill="rgba(255,255,255,0.3)"/>
                                <circle cx="230" cy="130" r="2" fill="rgba(255,255,255,0.3)"/>
                            </svg>
                        </div>

                        <h1 className="left-headline">
                            Regional Water<br/><span>Flow Manager</span>
                        </h1>
                        <p className="left-desc">
                            Monitor and control dam infrastructure across the Souss-Massa basin in real time.
                        </p>

                        {/* Stats — desktop only (inside left-center) */}
                        <div className="stats-row">
                            <div className="stat-item">
                                <span className="stat-value">14</span>
                                <span className="stat-label">Barrages</span>
                            </div>
                            <div className="stat-divider"/>
                            <div className="stat-item">
                                <span className="stat-value">98.4%</span>
                                <span className="stat-label">Uptime</span>
                            </div>
                            <div className="stat-divider"/>
                            <div className="stat-item">
                                <span className="stat-value">Live</span>
                                <span className="stat-label">Data Feed</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer — desktop */}
                    <div className="left-footer">
                        <div className="status-dot"/>
                        <span className="status-text">All systems operational</span>
                    </div>

                    {/* Mobile-only: status pill in header */}
                    <div className="mobile-status">
                        <div className="status-dot"/>
                        <span className="status-text">Live</span>
                    </div>
                </div>

                {/* ── RIGHT ──────────────────────────────────── */}
                <div className="right-panel">
                    <div className="login-card">
                        <p className="card-eyebrow">Secure Access Portal</p>
                        <h2 className="card-title">Welcome<br/>Back</h2>
                        <p className="card-subtitle">Access the Regional Control Dashboard</p>

                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="field-group">
                                <label className="field-label">Username or Email</label>
                                <div className="field-wrap">
                                    <span className="field-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        className="field-input"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="admin@taroudant.aqua"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="field-group">
                                <div className="field-row-header">
                                    <label className="field-label" style={{marginBottom:0}}>Password</label>
                                    <button type="button" className="forgot-link">Forgot?</button>
                                </div>
                                <div className="field-wrap">
                                    <span className="field-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    </span>
                                    <input
                                        type="password"
                                        className="field-input"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Keep signed in */}
                            <div className="checkbox-row" onClick={() => setKeepSigned(!keepSigned)}>
                                <div className={`checkbox-box${keepSigned ? ' checked' : ''}`}>
                                    {keepSigned && (
                                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                            <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </div>
                                <span className="checkbox-label">Keep me signed in</span>
                            </div>

                            {error && <div className="error-box">{error}</div>}

                            <button type="submit" className="submit-btn">
                                <span>Sign In to Dashboard</span>
                                <div className="btn-arrow">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </button>
                        </form>

                        <div className="card-footer">
                            <p>New infrastructure? <span>Request Access</span></p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Login;