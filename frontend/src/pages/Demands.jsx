import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Search,
  Droplets,
  Send,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Demands = () => {
    const { user } = useAuth();
    const [demands, setDemands] = useState([]);
    const [cooperatives, setCooperatives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDemand, setNewDemand] = useState({ id_coop: '', volume_demande_m3: '', priorite: 3 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchDemands = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/api/irrigation/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDemands(res.data);
        } catch (error) {
            console.error("Erreur chargement demandes:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCooperatives = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/api/admin/management/cooperatives', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCooperatives(res.data.filter(c => c.actif));
        } catch (error) {
            console.error("Erreur chargement coops:", error);
        }
    };

    useEffect(() => {
        fetchDemands();
        fetchCooperatives();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/irrigation/${id}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchDemands();
        } catch (error) {
            alert("Erreur lors de la mise à jour du statut");
        }
    };

    const handleCreateDemand = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/api/irrigation/', 
                { ...newDemand, volume_demande_m3: parseFloat(newDemand.volume_demande_m3) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsModalOpen(false);
            setNewDemand({ id_coop: '', volume_demande_m3: '', priorite: 3 });
            fetchDemands();
        } catch (error) {
            alert(error.response?.data?.detail || "Erreur de création");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredDemands = demands.filter(d => filter === 'all' ? true : d.status === filter);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

                .dm-root {
                    font-family: 'DM Sans', sans-serif;
                    padding: 32px 36px;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                    height: 100%;
                    overflow-y: auto;
                    background: rgba(255,255,255,0.62);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-left: 1.5px solid rgba(255,255,255,0.88);
                }

                .dm-header { display: flex; justify-content: space-between; align-items: flex-end; flex-shrink: 0; }
                .dm-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #1A3A42; line-height: 1.1; }
                .dm-subtitle { font-size: 13px; color: #7A9BA0; font-weight: 500; margin-top: 4px; }

                .dm-actions { display: flex; gap: 12px; flex-shrink: 0; }
                .dm-main-btn {
                    background: linear-gradient(135deg, #005E70, #003D4D);
                    color: white; border: none; border-radius: 100px;
                    padding: 14px 28px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
                    cursor: pointer; display: flex; align-items: center; gap: 8px;
                    transition: all .2s ease;
                }
                .dm-main-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,94,112,0.3); }

                .dm-filters { display: flex; gap: 8px; background: rgba(255,255,255,0.5); padding: 5px; border-radius: 100px; border: 1.5px solid white; width: fit-content; }
                .dm-tab { 
                    font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
                    padding: 8px 20px; border-radius: 100px; cursor: pointer; transition: all .2s; border: none; background: transparent; color: #5A7A82;
                }
                .dm-tab.active { background: #1A3A42; color: white; }

                .dm-list { display: flex; flex-direction: column; gap: 12px; }
                .dm-row {
                    display: flex; align-items: center; gap: 20px;
                    background: rgba(255,255,255,0.48); border: 1.5px solid rgba(255,255,255,0.8);
                    border-radius: 20px; padding: 16px 28px; transition: all .2s;
                }
                .dm-row:hover { border-color: #00C8AE; transform: translateX(4px); background: white; }
                
                .dm-coop-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #1A3A42; }
                .dm-coop-sub { font-size: 11px; color: #7A9BA0; }
                
                .dm-volume { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #005E70; text-align: right; min-width: 140px; }
                .dm-volume-lbl { font-size: 8px; font-weight: 800; color: #8AACB2; text-transform: uppercase; letter-spacing: 0.1em; }

                .dm-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; display: inline-flex; align-items: center; gap: 6px; }
                .dm-badge-pending { border: 1px solid rgba(245,158,11,0.2); background: rgba(245,158,11,0.08); color: #B45309; }
                .dm-badge-approved { border: 1px solid rgba(0,200,174,0.2); background: rgba(0,200,174,0.08); color: #005E70; }
                .dm-badge-dot { width: 5px; height: 5px; border-radius: 50%; }

                .dm-decision { display: flex; gap: 8px; margin-left: auto; }
                .dm-dec-btn { 
                    width: 36px; height: 36px; border-radius: 12px; border: 1.5px solid #E5EEF0; 
                    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s;
                }
                .dm-dec-btn.yes { color: #00C8AE; } .dm-dec-btn.yes:hover { background: #00C8AE; color: white; border-color: #00C8AE; }
                .dm-dec-btn.no { color: #EF4444; } .dm-dec-btn.no:hover { background: #EF4444; color: white; border-color: #EF4444; }

                /* MODAL */
                .pm-overlay { 
                    position: fixed; inset: 0; z-index: 9999; background: rgba(7,40,48,0.35); 
                    backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; padding: 20px;
                }
                .pm-modal { 
                    width: 100%; max-width: 480px; background: white; border-radius: 32px; padding: 40px; 
                    position: relative; box-shadow: 0 40px 120px rgba(0,0,0,0.15); 
                }
                .pm-input { width: 100%; border: 1.5px solid #E5EEF0; border-radius: 100px; padding: 14px 22px; margin-bottom: 20px; font-size: 14px; outline: none; }
                .pm-label { font-size: 10px; font-weight: 700; color: #7A9BA0; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; display: block; padding-left: 14px;}
            `}</style>

            <div className="dm-root">
                <div className="dm-header">
                    <div>
                        <div className="dm-title">Flux Hydraulique</div>
                        <div className="dm-subtitle">Pilotage des demandes d'irrigation et allocations</div>
                    </div>
                    <div className="dm-actions">
                        <button className="dm-main-btn" onClick={() => setIsModalOpen(true)}>
                            <Plus size={16} /> NOUVELLE DEMANDE
                        </button>
                    </div>
                </div>

                <div className="dm-filters">
                    {['all', 'en_attente', 'approuve'].map(f => (
                        <button key={f} className={`dm-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f === 'all' ? 'Tout' : f.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className="dm-list">
                    {loading ? (
                        <center><div className="animate-spin h-8 w-8 border-2 border-aqua rounded-full border-t-transparent" /></center>
                    ) : filteredDemands.length > 0 ? filteredDemands.map(dm => (
                        <div key={dm.id_demande} className="dm-row">
                            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#E5EEF0', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#005E70' }}>
                                <Droplets size={20} className="mx-auto" />
                            </div>
                            
                            <div>
                                <div className="dm-coop-name">{dm.nom_coop}</div>
                                <div className="dm-coop-sub">Priorité Niveau {dm.priorite} · {dm.date_demande}</div>
                            </div>

                            <div className="dm-volume" style={{ marginLeft: 'auto' }}>
                                <div className="dm-volume-lbl">Besoin Estimé</div>
                                {dm.volume_demande_m3.toLocaleString()} <span style={{ fontSize: 12, color: '#7A9BA0' }}>m³</span>
                            </div>

                            <div style={{ minWidth: 120 }}>
                                {dm.status === 'approuve' ? (
                                    <div className="dm-badge dm-badge-approved">
                                        <div className="dm-badge-dot" style={{ background: '#00C8AE' }} /> Validé
                                    </div>
                                ) : dm.status === 'refuse' ? (
                                    <div className="dm-badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        <div className="dm-badge-dot" style={{ background: '#EF4444' }} /> Refusé
                                    </div>
                                ) : (
                                    <div className="dm-badge dm-badge-pending">
                                        <div className="dm-badge-dot animate-pulse" style={{ background: '#F59E0B' }} /> Attente
                                    </div>
                                )}
                            </div>

                            {user?.role === 'directeur' && dm.status === 'en_attente' && (
                                <div className="dm-decision">
                                    <button className="dm-dec-btn no" onClick={() => handleUpdateStatus(dm.id_demande, 'refuse')} title="Refuser"><XCircle size={18} /></button>
                                    <button className="dm-dec-btn yes" onClick={() => handleUpdateStatus(dm.id_demande, 'approuve')} title="Approuver"><CheckCircle2 size={18} /></button>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div style={{ padding: 60, textAlign: 'center', color: '#7A9BA0', fontSize: 13, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 24 }}>
                            Aucun enregistrement ne correspond.
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL CREATION (Style Profile/PM) */}
            {isModalOpen && (
                <div className="pm-overlay" onClick={() => !isSubmitting && setIsModalOpen(false)}>
                    <div className="pm-modal" onClick={e => e.stopPropagation()}>
                        <div style={{ position: 'absolute', top: 32, right: 32, cursor: 'pointer', color: '#8AACB2' }} onClick={() => setIsModalOpen(false)}><X /></div>
                        
                        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24, marginBottom: 8, color: '#1A3A42' }}>Nouvelle Demande</h2>
                        <p style={{ fontSize: 12, color: '#7A9BA0', marginBottom: 32 }}>Enregistrement d'un besoin en eau agricole.</p>

                        <form onSubmit={handleCreateDemand}>
                            <label className="pm-label">Coopérative</label>
                            <select 
                                className="pm-input" required
                                value={newDemand.id_coop}
                                onChange={(e) => setNewDemand({...newDemand, id_coop: e.target.value})}
                            >
                                <option value="">Choisir...</option>
                                {cooperatives.map(c => <option key={c.id_coop} value={c.id_coop}>{c.nom}</option>)}
                            </select>

                            <label className="pm-label">Volume (m³)</label>
                            <input 
                                className="pm-input" type="number" required min="1"
                                placeholder="ex: 800000"
                                value={newDemand.volume_demande_m3}
                                onChange={(e) => setNewDemand({...newDemand, volume_demande_m3: e.target.value})}
                            />

                            <label className="pm-label">Priorité : niveau {newDemand.priorite}</label>
                            <input 
                                type="range" min="1" max="5" 
                                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-aqua mb-8"
                                value={newDemand.priorite}
                                onChange={(e) => setNewDemand({...newDemand, priorite: parseInt(e.target.value)})}
                                style={{ accentColor: '#00C8AE' }}
                            />

                            <button 
                                className="w-full bg-[#1A3A42] text-white font-bold py-4 rounded-full font-syne text-sm tracking-widest hover:bg-[#005E70] transition-all flex items-center justify-center gap-2"
                                disabled={isSubmitting}
                                style={{ fontFamily: 'Syne' }}
                            >
                                {isSubmitting ? "ENVOI..." : <><Send size={16} /> SOUMETTRE LA DEMANDE</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Demands;
