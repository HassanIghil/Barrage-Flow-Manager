import React, { useState } from 'react';
import apiRequest from '../services/api';

const ReleaseForm = ({ onReleaseCreated }) => {
    const [formData, setFormData] = useState({
        volume_m3: '',
        type: 'normal',
        motif: '',
        id_barrage: 1, 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'volume_m3' ? parseFloat(value) || '' : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (formData.volume_m3 <= 0) {
            setError("Le volume doit être strictement supérieur à 0");
            return;
        }

        setLoading(true);
        try {
            await apiRequest('/releases/', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setSuccess(true);
            setFormData({
                volume_m3: '',
                type: 'normal',
                motif: '',
                id_barrage: 1,
            });
            if (onReleaseCreated) onReleaseCreated();
        } catch (err) {
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rf-container">
            <style>{`
                .rf-group { margin-bottom: 24px; }
                .rf-label { 
                    display: block; font-family: var(--font-headline); font-size: 11px; font-weight: 800; 
                    color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; 
                    padding-left: 4px;
                }
                .rf-input { 
                    width: 100%; background: #f8fafb; border: 1.5px solid #edf2f4; border-radius: 16px; 
                    padding: 14px 20px; font-size: 14px; color: var(--text-primary); transition: all 0.2s; outline: none; 
                }
                .rf-input:focus { border-color: var(--accent); background: white; box-shadow: 0 0 0 4px var(--accent-light); }
                
                .rf-submit { 
                    width: 100%; background: linear-gradient(135deg, #005E70, #003D4D); color: white; border: none; 
                    border-radius: 100px; padding: 16px; font-family: var(--font-headline); font-size: 13px; font-weight: 800; 
                    cursor: pointer; transition: all 0.2s; margin-top: 12px; box-shadow: 0 10px 20px rgba(0, 94, 112, 0.15);
                }
                .rf-submit:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(0, 94, 112, 0.25); }
                .rf-submit:disabled { opacity: 0.6; transform: none; box-shadow: none; }

                .rf-alert { padding: 12px 18px; border-radius: 12px; font-size: 13px; margin-bottom: 20px; font-weight: 600; }
                .rf-alert-err { background: #fee2e2; color: #dc2626; border: 1px solid rgba(220,38,38,0.1); }
                .rf-alert-ok { background: #d1fae5; color: #059669; border: 1px solid rgba(5,150,105,0.1); }
            `}</style>

            <form onSubmit={handleSubmit}>
                {error && <div className="rf-alert rf-alert-err">{error}</div>}
                {success && <div className="rf-alert rf-alert-ok">Demande enregistrée avec succès.</div>}

                <div className="rf-group">
                    <label className="rf-label">Barrage de Référence</label>
                    <select className="rf-input" name="id_barrage" value={formData.id_barrage} onChange={handleChange} required>
                        <option value={1}>Youssef Ibn Tachfine</option>
                    </select>
                </div>

                <div className="rf-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="rf-group">
                        <label className="rf-label">Volume à Libérer (m³)</label>
                        <input type="number" name="volume_m3" className="rf-input" placeholder="Ex: 1000000" value={formData.volume_m3} onChange={handleChange} required min="0.01" step="any" />
                    </div>
                    <div className="rf-group">
                        <label className="rf-label">Type d'Opération</label>
                        <select className="rf-input" name="type" value={formData.type} onChange={handleChange}>
                            <option value="normal">Normal</option>
                            <option value="urgence">Urgence</option>
                        </select>
                    </div>
                </div>

                <div className="rf-group">
                    <label className="rf-label">Motif & Instructions Techniques</label>
                    <textarea name="motif" className="rf-input" placeholder="Détails du lâcher..." value={formData.motif} onChange={handleChange} rows="3" style={{ borderRadius: '20px', resize: 'none' }} />
                </div>

                <button type="submit" className="rf-submit" disabled={loading}>
                    {loading ? 'Traitement en cours...' : 'CONFIRMER LA PLANIFICATION'}
                </button>
            </form>
        </div>
    );
};

export default ReleaseForm;