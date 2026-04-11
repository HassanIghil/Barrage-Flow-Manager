import React, { useState, useEffect } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import apiRequest from '../services/api';
import {
    CheckCircle2,
    XCircle,
    Plus,
    Droplets,
    Send,
    X,
    MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Pins based on status
const createPin = (color) => {
    return new L.DivIcon({
        className: 'custom-pin',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transform: translate(7px, 7px);"></div>`
    });
};

const defaultPin = createPin('#005E70'); // Normal (Cyan-dark)
const pendingPin = createPin('#F59E0B'); // Warning (Orange)
const approvedPin = createPin('#10B981'); // Success (Green)

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

    const fetchData = async () => {
        try {
            const [demandsData, coopsData] = await Promise.all([
                apiRequest('/irrigation/'),
                apiRequest('/admin/management/cooperatives')
            ]);
            setDemands(demandsData || []);
            setCooperatives((coopsData || []).filter(c => c.actif));
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await apiRequest(`/irrigation/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });
            fetchData();
        } catch (error) {
            alert("Erreur lors de la mise à jour du statut");
        }
    };

    const handleCreateDemand = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiRequest('/irrigation/', {
                method: 'POST',
                body: JSON.stringify({ ...newDemand, volume_demande_m3: parseFloat(newDemand.volume_demande_m3) })
            });
            setIsModalOpen(false);
            setNewDemand({ id_coop: '', volume_demande_m3: '', priorite: 3 });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.detail || "Erreur de création");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredDemands = demands.filter(d => filter === 'all' ? true : d.status === filter);

    // Map logic: Determine coop status based on active Demands
    const getCoopMarker = (coopId) => {
        const coopDemands = demands.filter(d => d.id_coop === coopId);
        const hasPending = coopDemands.some(d => d.status === 'en_attente');
        const hasApproved = coopDemands.some(d => d.status === 'approuve');

        if (hasPending) return { icon: pendingPin, status: 'Demande en attente', color: '#B45309' };
        if (hasApproved) return { icon: approvedPin, status: 'Irrigation valid\u00e9e', color: '#047857' };
        return { icon: defaultPin, status: 'Normal', color: '#005E70' };
    };

    return (
        <>
            <style>{`
                .dm-root {
                    font-family: var(--font-main);
                    padding: clamp(16px, 4vw, 32px) clamp(16px, 4vw, 36px);
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    height: 100%;
                    overflow-y: auto;
                    background: rgba(255,255,255,0.62);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-left: 1.5px solid rgba(255,255,255,0.88);
                }

                .dm-header { display: flex; justify-content: space-between; align-items: flex-end; flex-shrink: 0; flex-wrap: wrap; gap: 16px; }
                .dm-title { font-family: var(--font-headline); font-size: 28px; font-weight: 800; color: #1A3A42; line-height: 1.1; }
                .dm-subtitle { font-size: 13px; color: #7A9BA0; font-weight: 500; margin-top: 4px; }

                .dm-actions { display: flex; gap: 12px; flex-shrink: 0; }

                .dm-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 24px;
                }

                @media (min-width: 1024px) {
                    .dm-grid { grid-template-columns: 350px 1fr; }
                }

                .dm-main-btn {
                    background: linear-gradient(135deg, #005E70, #003D4D);
                    color: white; border: none; border-radius: 100px;
                    padding: 14px 28px; font-family: var(--font-headline); font-size: 13px; font-weight: 700;
                    cursor: pointer; display: flex; align-items: center; gap: 8px;
                    transition: all .2s ease;
                }
                .dm-main-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,94,112,0.3); }

                .dm-filters { display: flex; gap: 8px; background: rgba(255,255,255,0.5); padding: 5px; border-radius: 100px; border: 1.5px solid white; width: fit-content; }
                .dm-tab { 
                    font-family: var(--font-headline); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
                    padding: 8px 20px; border-radius: 100px; cursor: pointer; transition: all .2s; border: none; background: transparent; color: #5A7A82;
                }
                .dm-tab.active { background: #1A3A42; color: white; }

                .dm-layout {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 24px;
                    flex: 1;
                    min-height: 0; /* Important for scrollable children in flex parent */
                }

                @media (max-width: 1024px) {
                    .dm-layout { grid-template-columns: 1fr; overflow-y: auto; }
                    .dm-map-container { height: 400px; }
                }

                .dm-list-container {
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding-right: 12px;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 184, 160, 0.4) transparent;
                }
                .dm-list-container::-webkit-scrollbar { width: 6px; }
                .dm-list-container::-webkit-scrollbar-thumb { background: rgba(0, 184, 160, 0.4); border-radius: 10px; }

                .dm-map-container {
                    background: white;
                    border: 1.5px solid rgba(255,255,255,0.8);
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.05);
                    position: relative;
                }

                .dm-row {
                    display: flex; align-items: center; gap: 20px;
                    background: rgba(255,255,255,0.7); border: 1.5px solid rgba(255,255,255,0.8);
                    border-radius: 20px; padding: 16px 20px; transition: all .2s;
                }
                .dm-row:hover { border-color: #00C8AE; transform: translateX(4px); background: white; }
                
                .dm-coop-name { font-family: var(--font-headline); font-size: 15px; font-weight: 800; color: #1A3A42; }
                .dm-coop-sub { font-size: 11px; color: #7A9BA0; }
                
                .dm-volume { font-family: var(--font-main); font-size: 18px; font-weight: 800; color: #005E70; text-align: right; min-width: 100px; }
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
                
                @media (max-width: 480px) {
                    .dm-root { padding: 0 !important; gap: 0; background: transparent; border: none; }
                    .dm-header { padding: 24px 16px 12px !important; background: transparent; width: 100%; box-sizing: border-box; }
                    .dm-title { font-size: 22px !important; letter-spacing: -0.02em; }
                    .dm-subtitle { font-size: 11px !important; opacity: 0.8; }
                    .dm-actions { width: 100%; margin-top: 8px; }
                    .dm-main-btn { width: 100%; justify-content: center; padding: 12px !important; font-size: 11px !important; }
                    
                    .dm-filters { padding: 0 16px 16px !important; width: 100%; box-sizing: border-box; background: transparent; border-radius: 0; border: none; overflow-x: auto; scrollbar-width: none; }
                    .dm-filters::-webkit-scrollbar { display: none; }
                    .dm-tab { padding: 6px 12px; font-size: 9px; white-space: nowrap; border: 1px solid var(--border-subtle); margin-right: 4px; }
                    .dm-tab.active { border-color: #1A3A42; }

                    .dm-layout { gap: 0; }
                    .dm-list-container { padding: 0 !important; gap: 0 !important; }
                    
                    .dm-row { 
                        border-radius: 0 !important; border-left: none !important; border-right: none !important;
                        padding: 12px 16px !important; gap: 10px !important; margin: 0 !important;
                        background: rgba(255,255,255,0.8) !important; border-bottom: 1px solid var(--border-subtle) !important;
                        width: 100% !important; box-sizing: border-box !important;
                    }
                    .dm-row:hover { transform: none; }
                    .dm-coop-name { font-size: 13px !important; }
                    .dm-volume { font-size: 14px !important; min-width: auto !important; margin-left: auto !important; margin-right: 0 !important; }
                    .dm-volume-lbl { font-size: 7px !important; }
                    
                    .dm-badge { padding: 4px 8px !important; font-size: 8px !important; }
                    .dm-dec-btn { width: 32px; height: 32px; }

                    .dm-map-container { display: none !important; }
                    
                    .pm-modal { padding: 32px 24px !important; border-radius: 20px !important; }
                    .pm-overlay { padding: 10px !important; }
                }

                /* LEAFLET OVERRIDES */
                .leaflet-popup-content-wrapper { border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
                .leaflet-popup-content { font-family: 'DM Sans', sans-serif; margin: 16px; }
            `}</style>

            <div className="dm-root">
                <div className="dm-header">
                    <div>
                        <div className="dm-title">Flux Hydraulique</div>
                        <div className="dm-subtitle">{"Pilotage g\u00e9olocalis\u00e9 des demandes d'irrigation"}</div>
                    </div>
                    {['directeur', 'ingenieur'].includes(user?.role) && (
                        <div className="dm-actions">
                            <button className="dm-main-btn" onClick={() => setIsModalOpen(true)}>
                                <Plus size={16} /> NOUVELLE DEMANDE
                            </button>
                        </div>
                    )}
                </div>

                <div className="dm-filters">
                    {['all', 'en_attente', 'approuve'].map(f => (
                        <button key={f} className={`dm-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f === 'all' ? 'Toutes' : f === 'en_attente' ? 'En Attente' : 'Approuv\u00e9es'}
                        </button>
                    ))}
                </div>

                <div className="dm-layout">
                    {/* LEFT LIST */}
                    <div className="dm-list-container">
                        {loading ? (
                            <LoadingOverlay message="Synchronisation des besoins..." />
                        ) : filteredDemands.length > 0 ? filteredDemands.map(dm => (
                            <div key={dm.id_demande} className="dm-row">
                                <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 14, background: '#E5EEF0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#005E70' }}>
                                    <Droplets size={20} />
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="dm-coop-name">{dm.nom_coop}</div>
                                    <div className="dm-coop-sub">Niveau {dm.priorite} {" \u00b7 "} {dm.date_demande}</div>
                                </div>

                                <div className="dm-volume" style={{ marginRight: '10px' }}>
                                    <div className="dm-volume-lbl">Besoin</div>
                                    {dm.volume_demande_m3.toLocaleString()} <span style={{ fontSize: 12, color: '#7A9BA0' }}>{"m\u00b3"}</span>
                                </div>

                                <div style={{ minWidth: 90 }}>
                                    {dm.status === 'approuve' ? (
                                        <div className="dm-badge dm-badge-approved">
                                            <div className="dm-badge-dot" style={{ background: '#00C8AE' }} /> {"Valid\u00e9"}
                                        </div>
                                    ) : dm.status === 'refuse' ? (
                                        <div className="dm-badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                            <div className="dm-badge-dot" style={{ background: '#EF4444' }} /> {"Refus\u00e9"}
                                        </div>
                                    ) : (
                                        <div className="dm-badge dm-badge-pending">
                                            <div className="dm-badge-dot" style={{ background: '#F59E0B' }} /> Attente
                                        </div>
                                    )}
                                </div>

                                {['directeur', 'ingenieur'].includes(user?.role) && dm.status === 'en_attente' && (
                                    <div className="dm-decision">
                                        <button className="dm-dec-btn no" onClick={() => handleUpdateStatus(dm.id_demande, 'refuse')} title="Refuser"><XCircle size={18} /></button>
                                        <button className="dm-dec-btn yes" onClick={() => handleUpdateStatus(dm.id_demande, 'approuve')} title="Approuver"><CheckCircle2 size={18} /></button>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div style={{ padding: 60, textAlign: 'center', color: '#7A9BA0', fontSize: 13, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 24 }}>
                                {"Aucun enregistrement ne correspond."}
                            </div>
                        )}
                    </div>

                    {/* RIGHT MAP */}
                    <div className="dm-map-container">
                        {!loading && cooperatives.length > 0 && (
                            <MapContainer
                                center={[29.85, -9.6]}
                                zoom={9}
                                style={{ height: '100%', width: '100%', zIndex: 0 }}
                                zoomControl={false}
                            >
                                <TileLayer
                                    url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                    attribution='&copy; Google Maps'
                                />
                                <ZoomControl position="bottomright" />

                                {/* Coordinates mapping from active coops */}
                                {cooperatives.map(coop => {
                                    if (!coop.localisation_gps) return null;
                                    const coords = coop.localisation_gps.split(',').map(c => parseFloat(c));
                                    if (coords.length !== 2 || isNaN(coords[0])) return null;

                                    const markerInfo = getCoopMarker(coop.id_coop);

                                    return (
                                        <Marker key={coop.id_coop} position={coords} icon={markerInfo.icon}>
                                            <Popup>
                                                <div>
                                                    <h3 style={{ margin: 0, fontFamily: 'var(--font-headline)', fontWeight: 800, color: '#1A3A42', fontSize: '15px' }}>
                                                        {coop.nom}
                                                    </h3>
                                                    <p style={{ margin: '4px 0 12px 0', fontSize: '11px', color: '#7A9BA0' }}>
                                                        {"Surface: "} {coop.surface_hectares} ha
                                                    </p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: markerInfo.color }}></div>
                                                        <span style={{ fontSize: '12px', fontWeight: 700, color: markerInfo.color }}>
                                                            {markerInfo.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                            </MapContainer>
                        )}
                        <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 400, background: 'rgba(255,255,255,0.9)', padding: '10px 16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
                            <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#1A3A42', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} color="#00C8AE" /> {"R\u00e9gion Souss-Massa"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL CREATION */}
            {isModalOpen && (
                <div className="pm-overlay" onClick={() => !isSubmitting && setIsModalOpen(false)}>
                    <div className="pm-modal" onClick={e => e.stopPropagation()}>
                        <div style={{ position: 'absolute', top: 32, right: 32, cursor: 'pointer', color: '#8AACB2' }} onClick={() => setIsModalOpen(false)}><X /></div>

                        <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: 24, marginBottom: 8, color: '#1A3A42' }}>{"Nouvelle Demande"}</h2>
                        <p style={{ fontSize: 12, color: '#7A9BA0', marginBottom: 32 }}>{"Enregistrement d'un besoin en eau agricole."}</p>

                        <form onSubmit={handleCreateDemand}>
                            <label className="pm-label">{"Coop\u00e9rative"}</label>
                            <select
                                className="pm-input" required
                                value={newDemand.id_coop}
                                onChange={(e) => setNewDemand({ ...newDemand, id_coop: e.target.value })}
                            >
                                <option value="">{"Choisir..."}</option>
                                {cooperatives.map(c => <option key={c.id_coop} value={c.id_coop}>{c.nom}</option>)}
                            </select>

                            <label className="pm-label">{"Volume (m\u00b3)"}</label>
                            <input
                                className="pm-input" type="number" required min="1"
                                placeholder="ex: 800000"
                                value={newDemand.volume_demande_m3}
                                onChange={(e) => setNewDemand({ ...newDemand, volume_demande_m3: e.target.value })}
                            />

                            <label className="pm-label">{"Priorit\u00e9 : niveau "} {newDemand.priorite}</label>
                            <input
                                type="range" min="1" max="5"
                                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-aqua mb-8"
                                value={newDemand.priorite}
                                onChange={(e) => setNewDemand({ ...newDemand, priorite: parseInt(e.target.value) })}
                                style={{ accentColor: '#00C8AE' }}
                            />

                            <button
                                className="w-full bg-[#1A3A42] text-white font-bold py-4 rounded-full text-sm tracking-widest hover:bg-[#005E70] transition-all flex items-center justify-center gap-2"
                                disabled={isSubmitting}
                                style={{ fontFamily: 'var(--font-headline)' }}
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
