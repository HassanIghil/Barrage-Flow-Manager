import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [keepSigned, setKeepSigned] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const success = await login(email, password);
            if (success) {
                // Short deliberate delay to show the nice loading state
                setTimeout(() => navigate('/'), 800);
            } else {
                setError("Email ou mot de passe incorrect");
                setLoading(false);
            }
        } catch (err) {
            setError(err.message || "Erreur de connexion");
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                html, body, #root { height: 100%; overflow: hidden; }
                * { box-sizing: border-box; margin: 0; padding: 0; }

                .login-root {
                    height: 100vh; width: 100vw; display: flex;
                    background: #C8D8D9; font-family: var(--font-main);
                    overflow: hidden; position: fixed; top: 0; left: 0;
                }

                /* ─── LEFT PANEL ─────────────────────────────── */
                .left-panel {
                    width: 52%; background: linear-gradient(160deg, #1A4F5C 0%, #0D3540 55%, #072830 100%);
                    display: flex; flex-direction: column; justify-content: space-between;
                    padding: clamp(28px, 4vh, 52px) clamp(28px, 4vw, 56px); position: relative; overflow: hidden;
                }
                .left-panel::before {
                    content: ''; position: absolute; inset: 0;
                    background-image: linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
                    background-size: 48px 48px; pointer-events: none;
                }
                .left-panel::after {
                    content: ''; position: absolute; width: 520px; height: 520px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(0,180,160,0.18) 0%, transparent 70%);
                    top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
                }

                .brand-logo { display: flex; align-items: center; gap: 14px; position: relative; z-index: 1; }
                .brand-icon {
                    width: 42px; height: 42px; border-radius: 12px;
                    background: linear-gradient(135deg, #00B8A0, #007A6E);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 8px 20px rgba(0,184,160,0.3);
                }
                .brand-name { font-family: var(--font-headline); font-size: 15px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.04em; }

                .left-center { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; padding: clamp(16px, 2vh, 40px) 0; }
                .dam-illustration { width: 100%; max-width: clamp(200px, 28vw, 380px); margin: 0 auto clamp(20px, 3vh, 48px); }
                .left-headline { font-family: var(--font-headline); font-size: clamp(22px, 2.8vw, 38px); font-weight: 800; color: #ffffff; line-height: 1.15; margin-bottom: 18px; }
                .left-headline span { color: #00C8AE; }
                .left-desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.7; max-width: 300px; }

                .stats-row { display: flex; gap: clamp(16px, 2.5vw, 32px); margin-top: clamp(20px, 3vh, 48px); position: relative; z-index: 1; }
                .stat-value { font-family: var(--font-headline); font-size: 22px; font-weight: 700; color: #ffffff; }
                .stat-label { font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.12em; }
                .stat-divider { width: 1px; background: rgba(255,255,255,0.1); align-self: stretch; }

                .left-footer { display: flex; align-items: center; gap: 10px; position: relative; z-index: 1; }
                .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #00C8AE; box-shadow: 0 0 10px #00C8AE; animation: pulse 2s infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.3); } }
                .status-text { font-size: 11px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.15em; }

                /* ─── RIGHT PANEL ─────────────────────────────── */
                .right-panel {
                    width: 48%; background: #D4DCDE; display: flex; align-items: center; justify-content: center;
                    padding: clamp(24px, 4vh, 48px) clamp(24px, 4vw, 40px); position: relative; overflow: hidden;
                }
                .right-panel::before {
                    content: ''; position: absolute; inset: 0; opacity: 0.5;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
                }

                .login-card { width: 100%; max-width: 400px; position: relative; z-index: 1; }
                .card-eyebrow { font-size: 10px; font-weight: 700; color: #7A9BA0; text-transform: uppercase; letter-spacing: 0.22em; margin-bottom: 12px; }
                .card-title { font-family: var(--font-headline); font-size: clamp(24px, 2.8vw, 34px); font-weight: 800; color: #1A3A42; margin-bottom: 6px; }
                .card-subtitle { font-size: 13px; color: #7A9BA0; margin-bottom: 44px; }

                .field-group { margin-bottom: 20px; }
                .field-label { display: block; font-size: 10px; font-weight: 700; color: #7A9BA0; text-transform: uppercase; margin-bottom: 10px; }
                .field-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: #8AACB2; }
                .field-input {
                    width: 100%; background: rgba(255,255,255,0.45); border: 1.5px solid rgba(255,255,255,0.7);
                    border-radius: 100px; padding: 16px 20px 16px 50px; font-size: 14px; color: #1A3A42; outline: none; transition: all 0.2s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }
                .field-input:focus { background: rgba(255,255,255,0.7); border-color: rgba(0,184,160,0.4); }

                .forgot-link { font-size: 10px; font-weight: 700; color: #00897A; text-transform: uppercase; background: none; border: none; cursor: pointer; }
                .checkbox-row { display: flex; align-items: center; gap: 12px; margin: 24px 0 28px; cursor: pointer; }
                .checkbox-box { width: 20px; height: 20px; border-radius: 6px; border: 2px solid #CBD8DB; display: flex; align-items: center; justify-content: center; transition: 0.15s; }
                .checkbox-box.checked { background: #005E70; border-color: #005E70; }

                .submit-btn {
                    width: 100%; background: linear-gradient(135deg, #005E70 0%, #003D4D 100%);
                    color: white; font-family: var(--font-headline); font-size: 15px; font-weight: 700;
                    border: none; border-radius: 100px; padding: 18px 32px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 12px;
                    box-shadow: 0 12px 32px rgba(0,94,112,0.28); transition: all 0.2s;
                }
                .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 16px 40px rgba(0,94,112,0.35); }

                .error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 16px; padding: 12px 18px; font-size: 12px; color: #DC2626; margin-bottom: 20px; text-align: center; }


                @media (max-width: 640px) {
                    .login-root { flex-direction: column; position: fixed; }
                    .left-panel { width: 100%; flex: 0 0 auto; padding: 28px 24px 24px; flex-direction: row; align-items: center; justify-content: space-between; }
                    .left-center, .left-footer { display: none; }
                    .right-panel { width: 100%; flex: 1; overflow-y: auto; align-items: flex-start; padding: 32px 24px 40px; }
                }
            `}</style>

            <div className="login-root">
                {/* ── CHARGEMENT ── */}
                {/* ── CHARGEMENT ── */}
                {loading && <LoadingOverlay message="Vérification en cours..." />}

                <div className="left-panel">
                    <div className="brand-logo">
                        <div className="brand-icon">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <path d="M3 16 Q6 10 11 12 Q16 14 19 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                <circle cx="11" cy="17" r="2.5" fill="rgba(255,255,255,0.5)" />
                                <path d="M5 19 H17" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="brand-name">AquaFlow&nbsp;|&nbsp;Taroudant</span>
                    </div>

                    <div className="left-center">
                        <div className="dam-illustration">
                            <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="180" cy="80" rx="160" ry="40" fill="rgba(0,180,160,0.08)" />
                                <path d="M100 160 L120 60 L240 60 L260 160 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                                <path d="M120 60 L240 60 L238 65 L122 65 Z" fill="rgba(0,200,174,0.15)" />
                                <path d="M60 82 Q120 70 180 78 Q240 86 300 74 L300 110 Q240 122 180 114 Q120 106 60 118 Z" fill="rgba(0,180,160,0.12)" />
                                <path d="M60 82 Q120 70 180 78 Q240 86 300 74" stroke="rgba(0,200,174,0.4)" strokeWidth="1.5" fill="none" />
                                <circle cx="180" cy="78" r="3" fill="#00C8AE" opacity="0.8" />
                                <circle cx="180" cy="78" r="6" fill="none" stroke="#00C8AE" strokeWidth="1" opacity="0.3" />
                            </svg>
                        </div>

                        <h1 className="left-headline">Gestionnaire de Flux<br /><span>d'Eau Régional</span></h1>
                        <p className="left-desc">Surveillez et contrôlez l'infrastructure des barrages à travers le bassin Souss-Massa en temps réel.</p>

                        <div className="stats-row">
                            <div className="stat-item"><span className="stat-value">14</span><span className="stat-label">Barrages</span></div>
                            <div className="stat-divider" />
                            <div className="stat-item"><span className="stat-value">98.4%</span><span className="stat-label">Disponibilité</span></div>
                            <div className="stat-divider" />
                            <div className="stat-item"><span className="stat-value">LIVE</span><span className="stat-label">Données</span></div>
                        </div>
                    </div>

                    <div className="left-footer">
                        <div className="status-dot" />
                        <span className="status-text">Tous les systèmes opérationnels</span>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="login-card">
                        <p className="card-eyebrow">Portail d'Accès Sécurisé</p>
                        <h2 className="card-title">Heureux de vous<br />revoir</h2>
                        <p className="card-subtitle">Accédez au tableau de bord de contrôle régional</p>

                        <form onSubmit={handleSubmit}>
                            <div className="field-group">
                                <label className="field-label">Email ou Nom d'utilisateur</label>
                                <div style={{ position: 'relative' }}>
                                    <span className="field-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </span>
                                    <input type="email" className="field-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" required />
                                </div>
                            </div>

                            <div className="field-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <label className="field-label" style={{ marginBottom: 0 }}>Mot de Passe</label>
                                    <button type="button" className="forgot-link">Oublié ?</button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <span className="field-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </span>
                                    <input type="password" className="field-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                                </div>
                            </div>

                            <div className="checkbox-row" onClick={() => setKeepSigned(!keepSigned)}>
                                <div className={`checkbox-box${keepSigned ? ' checked' : ''}`}>
                                    {keepSigned && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                </div>
                                <span className="checkbox-label">Rester connecté</span>
                            </div>

                            {error && <div className="error-box">{error}</div>}

                            <button type="submit" className="submit-btn" disabled={loading}>
                                <span>Se Connecter</span>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </div>
                            </button>
                        </form>

                        <div className="card-footer" style={{ marginTop: 28, textCenter: 'center' }}>
                            <p style={{ fontSize: 11, fontWeight: 600, color: '#8AACB2', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Nouvelle infrastructure ? <span style={{ color: '#00897A', cursor: 'pointer' }}>Demander l'Accès</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;