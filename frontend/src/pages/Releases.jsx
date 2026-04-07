import React, { useState, useEffect } from 'react';
import apiRequest from '../services/api';
import ReleaseForm from '../components/ReleaseForm';
import { useAuth } from '../context/AuthContext';

const Releases = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'en_attente':
                return { color: '#D97706', background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)' };
            case 'execute':
                return { color: '#059669', background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.3)' };
            case 'approuve':
                return { color: '#2563EB', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.3)' };
            case 'refuse':
                return { color: '#DC2626', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)' };
            default:
                return { color: '#5A7A82', background: 'rgba(90, 122, 130, 0.1)', border: '1px solid rgba(90, 122, 130, 0.3)' };
        }
    };

    const formatStatus = (status) => {
        switch (status.toLowerCase()) {
            case 'en_attente': return 'En Attente';
            case 'execute': return 'Exécuté';
            case 'approuve': return 'Approuvé';
            case 'refuse': return 'Refusé';
            default: return status;
        }
    };

    return (
        <div className="pr-root">
            <style>{`
                .pr-root {
                    min-height: 100%;
                    width: 100%;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    background: #D4DCDE;
                    font-family: 'DM Sans', sans-serif;
                }
                .releases-container {
                    padding: clamp(24px, 4vh, 48px) clamp(24px, 4vw, 40px);
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }
                .releases-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 32px;
                }
                @media (min-width: 1024px) {
                    .releases-grid {
                        grid-template-columns: 1fr 2fr;
                    }
                }
                .history-table-container {
                    overflow-x: auto;
                    background: rgba(255, 255, 255, 0.55);
                    border: 1.5px solid rgba(255, 255, 255, 0.8);
                    border-radius: 28px;
                    padding: 24px;
                    backdrop-filter: blur(16px);
                }
                .history-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0 8px;
                    font-family: 'DM Sans', sans-serif;
                }
                .history-table th {
                    text-align: left;
                    font-size: 10px;
                    font-weight: 700;
                    color: #7A9BA0;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    padding: 0 16px 12px;
                }
                .history-table td {
                    background: rgba(255, 255, 255, 0.4);
                    padding: 16px;
                    font-size: 14px;
                    color: #1A3A42;
                    border-top: 1px solid rgba(255, 255, 255, 0.6);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.6);
                }
                .history-table td:first-child {
                    border-left: 1px solid rgba(255, 255, 255, 0.6);
                    border-top-left-radius: 12px;
                    border-bottom-left-radius: 12px;
                }
                .history-table td:last-child {
                    border-right: 1px solid rgba(255, 255, 255, 0.6);
                    border-top-right-radius: 12px;
                    border-bottom-right-radius: 12px;
                }
                .status-badge {
                    font-size: 10px;
                    font-weight: 700;
                    padding: 4px 12px;
                    border-radius: 100px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    display: inline-block;
                }
                .loading-spinner {
                    display: flex;
                    justify-content: center;
                    padding: 40px;
                    color: #005E70;
                    font-weight: 600;
                }
            `}</style>

            <div className="releases-container">
                <div style={{ marginBottom: '40px' }}>
                    <p className="eyebrow">Opérations Hydrauliques</p>
                    <h1 className="page-title">Lâchers & Irrigation</h1>
                    <p className="page-desc">
                        Saisissez les nouvelles demandes de lâchers d'eau et consultez l'historique complet des opérations effectuées sur le barrage.
                    </p>
                </div>

                <div className="releases-grid">
                    {/* Colonne Formulaire (Ingénieurs et Directeurs) */}
                    <div>
                        {(user?.role === 'ingenieur' || user?.role === 'directeur') ? (
                            <ReleaseForm onReleaseCreated={fetchHistory} />
                        ) : (
                            <div className="glass-card">
                                <p className="eyebrow" style={{ color: '#D97706' }}>Accès Restreint</p>
                                <p style={{ fontSize: '14px', color: '#5A7A82', marginTop: '12px' }}>
                                    Seuls les ingénieurs et le directeur peuvent initier de nouvelles demandes de lâcher d'eau.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Colonne Historique */}
                    <div className="history-table-container">
                        <p className="eyebrow" style={{ marginBottom: 20 }}>Historique des Lâchers</p>
                        
                        {loading ? (
                            <div className="loading-spinner">Chargement des données...</div>
                        ) : error ? (
                            <div className="error-msg" style={{ textAlign: 'center', padding: '20px' }}>{error}</div>
                        ) : history.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#5A7A82' }}>Aucun lâcher enregistré.</div>
                        ) : (
                            <table className="history-table">
                               <thead>
                                   <tr>
                                       <th>Date</th>
                                       <th>Barrage</th>
                                       <th>Volume (m³)</th>
                                       <th>Type</th>
                                       <th>Statut</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   {history.map((item, index) => (
                                       <tr key={index}>
                                           <td style={{ fontWeight: 600 }}>{new Date(item.date_lacher).toLocaleDateString('fr-FR')}</td>
                                           <td>{item.barrage}</td>
                                           <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                                               {item.volume_m3.toLocaleString('fr-FR')}
                                           </td>
                                           <td style={{ textTransform: 'capitalize' }}>{item.type}</td>
                                           <td>
                                               <span className="status-badge" style={getStatusStyle(item.status)}>
                                                   {formatStatus(item.status)}
                                               </span>
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Releases;
