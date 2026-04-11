import React, { useState, useEffect } from 'react';
import apiRequest from '../services/api';
import ReleaseForm from '../components/ReleaseForm';
import ReleaseList from '../components/ReleaseList';
import { useAuth } from '../context/AuthContext';
import { Droplets, ShieldAlert, X, Plus } from 'lucide-react';
import LoadingOverlay from '../components/LoadingOverlay';

const Releases = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await apiRequest('/dashboard/history');
            setHistory(data);
            setError(null);
        } catch (err) {
            setError("Impossible de charger l'historique des lâchers");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const canManage = ['directeur', 'ingenieur'].includes(user?.role);

    return (
        <>
            <style>{`
                .rl-root {
                    font-family: 'DM Sans', sans-serif;
                    padding: clamp(16px, 4vw, 36px);
                    display: flex;
                    flex-direction: column;
                    gap: clamp(20px, 3vh, 32px);
                    height: 100%;
                    overflow-y: auto;
                    background: rgba(255,255,255,0.62);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }

                .rl-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    flex-shrink: 0; 
                    flex-wrap: wrap; 
                    gap: 20px;
                }
                .rl-title { 
                    font-family: var(--font-headline); 
                    font-size: clamp(26px, 6vw, 38px); 
                    font-weight: 900; 
                    color: var(--text-primary); 
                    line-height: 1.05; 
                    letter-spacing: -0.04em;
                }
                .rl-subtitle { 
                    font-size: clamp(12px, 3.5vw, 14px); 
                    color: var(--text-muted); 
                    font-weight: 500; 
                    margin-top: 6px; 
                }

                .rl-btn-create {
                    background: linear-gradient(135deg, #005E70, #003D4D);
                    color: white; border: none; border-radius: 100px;
                    padding: clamp(12px, 3vw, 16px) clamp(20px, 5vw, 32px); 
                    font-family: var(--font-headline); font-size: clamp(11px, 3vw, 13px); font-weight: 800;
                    cursor: pointer; display: flex; align-items: center; gap: 10px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 10px 25px rgba(0, 94, 112, 0.2);
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }
                @media (max-width: 480px) {
                    .rl-header { flex-direction: column; align-items: flex-start; gap: 24px; }
                    .rl-btn-create { width: 100%; justify-content: center; }
                }
                .rl-btn-create:hover { 
                    transform: translateY(-3px) scale(1.02); 
                    box-shadow: 0 15px 35px rgba(0, 94, 112, 0.35); 
                }
                .rl-btn-create:active { transform: translateY(-1px); }

                /* MODAL */
                .rl-overlay { 
                    position: fixed; inset: 0; z-index: 9999; 
                    background: rgba(7, 40, 48, 0.4); 
                    backdrop-filter: blur(12px); 
                    display: flex; align-items: center; justify-content: center; 
                    padding: 24px;
                    animation: rl-fade 0.3s ease;
                }
                .rl-modal { 
                    width: 100%; max-width: 520px; 
                    background: white; 
                    border-radius: 40px; 
                    padding: 48px; 
                    position: relative; 
                    box-shadow: 0 50px 100px rgba(0,0,0,0.2);
                    animation: rl-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes rl-fade { from { opacity: 0; } to { opacity: 1; } }
                @keyframes rl-slide { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

                .rl-modal-close { 
                    position: absolute; top: 32px; right: 32px; 
                    width: 40px; height: 40px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    background: #f8f9fa; color: #8AACB2; cursor: pointer; border: none;
                    transition: all 0.2s;
                }
                .rl-modal-close:hover { background: #fee2e2; color: #dc2626; transform: rotate(90deg); }

                .rl-section-title {
                    font-family: var(--font-headline);
                    font-size: 20px;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .rl-section-title::after { content: ''; flex: 1; height: 1.5px; background: var(--border-subtle); border-radius: 2px; }

                .rl-empty-state {
                    padding: 120px 40px; text-align: center; color: var(--text-muted); 
                    background: rgba(255,255,255,0.25); border-radius: 32px; 
                    border: 2px dashed var(--border-medium);
                }
            `}</style>

            <div className="rl-root">
                <div className="rl-header">
                    <div>
                        <div className="rl-title">Opérations Hydrauliques</div>
                        <div className="rl-subtitle">Archive interactive des lâchers d'eau et planification stratégique</div>
                    </div>
                    {canManage && (
                        <button className="rl-btn-create" onClick={() => setIsModalOpen(true)}>
                            <Plus size={18} /> Programmer un Lâcher
                        </button>
                    )}
                </div>

                <div>
                    <div className="rl-section-title">
                        <Droplets size={20} color="var(--accent)" /> Historique des Opérations
                    </div>

                    {loading ? (
                        <LoadingOverlay message="Lecture du registre hydraulique..." />
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#EF4444' }}>
                            <ShieldAlert size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                            <p style={{ fontWeight: 700 }}>{error}</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="rl-empty-state">
                            <p style={{ fontSize: 16, fontWeight: 600 }}>{"Aucun historique pour le moment."}</p>
                            <p style={{ fontSize: 13, marginTop: 8 }}>{"Les données d'exploitation apparaîtront ici dès le premier lâcher effectué."}</p>
                        </div>
                    ) : (
                        <ReleaseList history={history} user={user} onRefresh={fetchHistory} />
                    )}
                </div>
            </div>

            {/* MODAL PROGRAMMATION */}
            {isModalOpen && (
                <div className="rl-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="rl-modal" onClick={e => e.stopPropagation()}>
                        <button className="rl-modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>

                        <div style={{ marginBottom: 36 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 8 }}>
                                <div style={{ background: 'rgba(0,200,174,0.1)', color: 'var(--accent)', padding: '8px', borderRadius: '12px' }}>
                                    <Droplets size={20} />
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: 26, color: '#1A3A42', margin: 0 }}>Nouveau Lâcher</h2>
                            </div>
                            <p style={{ fontSize: 14, color: '#7A9BA0', margin: 0, paddingLeft: 46 }}>Configuration technique et planification du déversement.</p>
                        </div>

                        <ReleaseForm
                            onReleaseCreated={() => {
                                setIsModalOpen(false);
                                fetchHistory();
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Releases;