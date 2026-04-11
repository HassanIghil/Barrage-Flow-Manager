import React from 'react';
import apiRequest from '../services/api';

const ReleaseTable = ({ history, user, onRefresh }) => {
    const fixEncoding = (str) => {
        if (!str) return '';
        if (typeof str !== 'string') return str;
        try { return decodeURIComponent(escape(str)); }
        catch { return str; }
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
        <table className="history-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Barrage</th>
                    <th>Volume (m³)</th>
                    <th>Type</th>
                    <th>Statut</th>
                    {['directeur', 'ingenieur'].includes(user?.role) && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {history.map((item, index) => (
                    <tr key={item.id_lacher || index}>
                        <td style={{ fontWeight: 600 }}>{new Date(item.date_lacher).toLocaleDateString('fr-FR')}</td>
                        <td>{fixEncoding(item.barrage)}</td>
                        <td style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                            {item.volume_m3.toLocaleString('fr-FR')}
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{item.type}</td>
                        <td>
                            <span className="status-badge" style={getStatusStyle(item.status)}>
                                {formatStatus(item.status)}
                            </span>
                        </td>
                        <td className="col-motif" style={{ padding: '10px', color: 'var(--text-secondary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fixEncoding(item.motif) || '-'}</td>
                        <td className="col-par" style={{ padding: '10px', color: 'var(--text-secondary)' }}>{fixEncoding(item.utilisateur)}</td>
                        {['directeur', 'ingenieur'].includes(user?.role) && (
                            <td>
                                {item.status === 'en_attente' && (
                                    <button
                                        onClick={() => handleExecute(item.id_lacher)}
                                        className="execute-btn"
                                    >
                                        EXÉCUTER
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
            <style>{`
                .execute-btn {
                    background: #005E70;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .execute-btn:hover {
                    background: #004552;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 94, 112, 0.2);
                }
            `}</style>
        </table>
    );
};

export default ReleaseTable;