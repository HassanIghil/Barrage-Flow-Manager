import React from 'react';
import { Calendar, Droplets, Activity, ChevronRight, CheckCircle2, Clock, AlertTriangle, XCircle, Home } from 'lucide-react';
import apiRequest from '../services/api';

const ReleaseList = ({ history, user, onRefresh }) => {

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

                .rel-info { display: flex; flex-direction: column; gap: 2px; }
                .rel-barrage { font-family: var(--font-headline); font-weight: 800; color: var(--text-primary); font-size: 14px; }
                .rel-meta { display: flex; align-items: center; gap: 12px; font-size: 11px; color: var(--text-muted); font-weight: 500; }
                .rel-meta-item { display: flex; align-items: center; gap: 4px; }

                .rel-aside { display: flex; align-items: center; gap: 24px; }

                .rel-v-box { text-align: right; }
                .rel-v-val { font-family: var(--font-headline); font-size: 16px; font-weight: 900; color: var(--accent); }
                .rel-v-unit { font-size: 10px; font-weight: 700; color: var(--text-muted); margin-left: 3px; }

                .rel-status-chip {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    border-radius: 100px;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    min-width: 90px;
                    justify-content: center;
                }

                .rel-exec {
                    background: linear-gradient(135deg, #005E70, #003D4D);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 100px;
                    font-size: 10px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .rel-exec:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 94, 112, 0.2); }

                .rel-deny {
                    background: white;
                    color: #DC2626;
                    border: 1.5px solid #FEE2E2;
                    padding: 7px 16px;
                    border-radius: 100px;
                    font-size: 10px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .rel-deny:hover { background: #FEF2F2; border-color: #F87171; }

                @media (max-width: 768px) {
                    .release-item { flex-direction: column; align-items: flex-start; gap: 16px; padding: 16px; }
                    .rel-aside { width: 100%; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 12px; }
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
                                <div className="rel-barrage">{item.barrage}</div>
                                <div className="rel-meta">
                                    <span className="rel-meta-item"><Activity size={14} color="#00C8AE" /> {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                                    <span className="rel-meta-item" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'var(--accent)', flexShrink: 0 }}>
                                            {item.utilisateur?.charAt(0).toUpperCase() || 'S'}
                                        </div>
                                        {item.utilisateur || 'Système'}
                                    </span>
                                    {item.motif && (
                                        <span className="rel-meta-item" style={{ fontStyle: 'italic', opacity: 0.8, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            — {item.motif}
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

                            {user?.role === 'directeur' && item.status === 'en_attente' && (
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
