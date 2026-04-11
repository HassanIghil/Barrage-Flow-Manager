import React from 'react';
import { Calendar, Droplets, Activity, ChevronRight, CheckCircle2, Clock, AlertTriangle, XCircle, Home } from 'lucide-react';
import apiRequest from '../services/api';

const ReleaseList = ({ history, user, onRefresh }) => {
    // Utility to handle UTF-8 symbols from backend
    const fixEncoding = (str) => {
        if (!str) return '';
        if (typeof str !== 'string') return str;
        try {
            return decodeURIComponent(escape(str));
        } catch {
            return str;
        }
    };

    const handleExecute = async (id_lacher) => {
        if (!window.confirm("Voulez-vous vraiment exécuter ce lâcher d'eau ?")) return;

        try {
            await apiRequest(`/releases/${id_lacher}/execute`, {
                method: 'PUT'
            });
            onRefresh();
        } catch (error) {
            alert("Erreur lors de l'exécution : " + error.message);
        }
    };

    const handleRefuse = async (id_lacher) => {
        if (!window.confirm("Voulez-vous vraiment refuser ce lâcher d'eau ?")) return;
        try {
            await apiRequest(`/releases/${id_lacher}/refuse`, { method: 'PUT' });
            onRefresh();
        } catch (error) {
            alert("Erreur lors du refus : " + error.message);
        }
    };

    const getStatusConfig = (status) => {
        switch (status.toLowerCase()) {
            case 'en_attente':
                return { 
                    label: 'En Attente',
                    icon: <Clock size={14} />,
                    color: '#B45309',
                    bg: 'rgba(245,158,11,0.08)',
                    border: 'rgba(245,158,11,0.2)'
                };
            case 'execute':
                return { 
                    label: 'Exécuté',
                    icon: <CheckCircle2 size={14} />,
                    color: '#059669',
                    bg: 'rgba(5,150,105,0.08)',
                    border: 'rgba(5,150,105,0.2)'
                };
            case 'approuve':
                return { 
                    label: 'Approuvé',
                    icon: <Activity size={14} />,
                    color: '#0369A1',
                    bg: 'rgba(12,175,224,0.08)',
                    border: 'rgba(12,175,224,0.2)'
                };
            case 'refuse':
                return { 
                    label: 'Refusé',
                    icon: <XCircle size={14} />,
                    color: '#DC2626',
                    bg: 'rgba(220,38,38,0.08)',
                    border: 'rgba(220,38,38,0.2)'
                };
            default:
                return { 
                    label: status,
                    icon: <AlertTriangle size={14} />,
                    color: '#64748b',
                    bg: 'rgba(100,116,139,0.08)',
                    border: 'rgba(100,116,139,0.2)'
                };
        }
    };

    return (
        <div className="release-list">
            <style>{`
                .release-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .release-item {
                    background: rgba(255, 255, 255, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    border-radius: 16px;
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .release-item:hover {
                    background: rgba(255, 255, 255, 0.95);
                    transform: translateX(4px);
                    border-color: var(--accent);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                }
                
                .rel-main { display: flex; align-items: center; gap: 16px; flex: 1; }
                
                .rel-date-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    width: 48px;
                    height: 52px;
                    border-radius: 12px;
                    border: 1px solid var(--border-subtle);
                    flex-shrink: 0;
                }
                .rel-day { font-size: 16px; font-weight: 800; color: var(--text-primary); font-family: var(--font-headline); line-height: 1; }
                .rel-month { font-size: 8px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }

                .rel-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
                .rel-barrage { font-family: var(--font-headline); font-weight: 800; color: #11181A; font-size: clamp(13px, 4vw, 15px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .rel-meta { display: flex; align-items: center; gap: clamp(8px, 2.5vw, 16px); font-size: 11px; color: #5A7A82; font-weight: 600; flex-wrap: wrap; }
                .rel-meta-item { display: flex; align-items: center; gap: 4px; white-space: nowrap; }

                .rel-aside { display: flex; align-items: center; gap: clamp(12px, 3vw, 24px); flex-shrink: 0; }

                .rel-v-box { text-align: right; }
                .rel-v-val { font-family: var(--font-headline); font-size: clamp(15px, 4.5vw, 18px); font-weight: 900; color: var(--accent); letter-spacing: -0.01em; }
                .rel-v-unit { font-size: 10px; font-weight: 800; color: #8AACB2; margin-left: 2px; }

                .rel-status-chip {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 100px;
                    font-size: 9px;
                    font-weight: 850;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    min-width: 90px;
                    justify-content: center;
                    white-space: nowrap;
                }

                .rel-exec {
                    background: linear-gradient(135deg, #005E70, #003D4D);
                    color: white; border: none; padding: 10px 18px; border-radius: 100px;
                    font-size: 10px; font-weight: 850; cursor: pointer; transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(0, 94, 112, 0.15);
                }
                .rel-exec:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0, 94, 112, 0.25); }

                .rel-deny {
                    background: white; color: #DC2626; border: 1.5px solid #FEE2E2;
                    padding: 9px 18px; border-radius: 100px; font-size: 10px; font-weight: 850;
                    cursor: pointer; transition: all 0.2s;
                }
                .rel-deny:hover { background: #FEF2F2; border-color: #F87171; }

                @media (max-width: 768px) {
                    .release-item { 
                        flex-direction: column; align-items: stretch; gap: 16px; padding: 18px; 
                        background: rgba(255,255,255,0.7);
                    }
                    .rel-main { align-items: flex-start; }
                    .rel-aside { 
                        width: 100%; justify-content: space-between; 
                        border-top: 1.5px solid rgba(138, 172, 178, 0.1); 
                        padding-top: 14px; 
                        margin-top: 4px;
                    }
                    .rel-v-box { text-align: left; }
                }
                @media (max-width: 400px) {
                    .rel-date-card { width: 42px; height: 46px; }
                    .rel-day { font-size: 14px; }
                    .rel-meta { gap: 8px; }
                    .rel-status-chip { min-width: 80px; padding: 5px 10px; font-size: 8.5px; }
                }
            `}</style>

            {history.length > 0 ? history.map((item, index) => {
                const date = new Date(item.date_lacher);
                const status = getStatusConfig(item.status);
                
                return (
                    <div key={item.id_lacher || index} className="release-item">
                        <div className="rel-main">
                            <div className="rel-date-card">
                                <span className="rel-day">{date.getDate()}</span>
                                <span className="rel-month">{date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}</span>
                            </div>

                            <div className="rel-info">
                                <div className="rel-barrage">{fixEncoding(item.barrage)}</div>
                                <div className="rel-meta">
                                    <span className="rel-meta-item"><Activity size={14} color="#00C8AE" /> {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                                    <span className="rel-meta-item" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'var(--accent)', flexShrink: 0 }}>
                                            {item.utilisateur?.charAt(0).toUpperCase() || 'S'}
                                        </div>
                                        {fixEncoding(item.utilisateur) || 'Système'}
                                    </span>
                                    {item.motif && (
                                        <span className="rel-meta-item" style={{ fontStyle: 'italic', opacity: 0.8, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            — {fixEncoding(item.motif)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rel-aside">
                            <div className="rel-v-box">
                                <span className="rel-v-val">{item.volume_m3.toLocaleString('fr-FR')}</span>
                                <span className="rel-v-unit">m³</span>
                            </div>

                            <div className="rel-status-chip" style={{ color: status.color, background: status.bg, border: `1px solid ${status.border}` }}>
                                {status.icon}
                                {status.label}
                            </div>

                            {['directeur', 'ingenieur'].includes(user?.role) && item.status === 'en_attente' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleRefuse(item.id_lacher)} className="rel-deny">
                                        REFUSER
                                    </button>
                                    <button onClick={() => handleExecute(item.id_lacher)} className="rel-exec">
                                        EXÉCUTER
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }) : (
                <div style={{ padding: 100, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, background: 'rgba(255,255,255,0.2)', borderRadius: 24, border: '2px dashed var(--border-subtle)' }}>
                    {"Aucun historique disponible."}
                </div>
            )}
        </div>
    );
};

export default ReleaseList;
