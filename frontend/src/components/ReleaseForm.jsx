import React, { useState } from 'react';
import apiRequest from '../services/api';

const ReleaseForm = ({ onReleaseCreated }) => {
    const [formData, setFormData] = useState({
        volume_m3: '',
        type: 'normal',
        motif: '',
        id_barrage: 1, // Par défaut le barrage Youssef Ibn Tachfine
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
            setError(err.message || "Une erreur est survenue lors de la création de la demande");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card">
            <style>{`
                .form-group {
                    margin-bottom: 20px;
                }
                .form-label {
                    display: block;
                    font-size: 11px;
                    font-weight: 700;
                    color: #7A9BA0;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    margin-bottom: 8px;
                }
                .form-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.45);
                    border: 1.5px solid rgba(255, 255, 255, 0.7);
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    color: #1A3A42;
                    transition: all 0.2s ease;
                    outline: none;
                }
                .form-input:focus {
                    border-color: #00B8A0;
                    background: rgba(255, 255, 255, 0.7);
                    box-shadow: 0 0 0 4px rgba(0, 184, 160, 0.1);
                }
                .error-msg {
                    color: #DC2626;
                    font-size: 12px;
                    margin-bottom: 16px;
                    font-weight: 500;
                }
                .success-msg {
                    color: #059669;
                    font-size: 12px;
                    margin-bottom: 16px;
                    font-weight: 500;
                }
            `}</style>
            <p className="eyebrow" style={{ marginBottom: 20 }}>Nouvelle Demande d'Irrigation</p>
            <form onSubmit={handleSubmit}>
                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">Demande de lâcher créée avec succès !</div>}
                
                <div className="form-group">
                    <label className="form-label">Barrage</label>
                    <select 
                        className="form-input" 
                        name="id_barrage" 
                        value={formData.id_barrage} 
                        onChange={handleChange}
                        required
                    >
                        <option value={1}>Youssef Ibn Tachfine</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Volume (m³)</label>
                    <input 
                        type="number" 
                        name="volume_m3" 
                        className="form-input" 
                        placeholder="Ex: 500000"
                        value={formData.volume_m3}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="any"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Type de Lâcher</label>
                    <select 
                        className="form-input" 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange}
                    >
                        <option value="normal">Normal</option>
                        <option value="urgence">Urgence</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Motif / Description</label>
                    <textarea 
                        name="motif" 
                        className="form-input" 
                        placeholder="Précisez le motif de la demande..."
                        value={formData.motif}
                        onChange={handleChange}
                        rows="3"
                        maxLength="500"
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ width: '100%', marginTop: 10 }}
                    disabled={loading}
                >
                    {loading ? 'Envoi en cours...' : 'Envoyer la Demande'}
                </button>
            </form>
        </div>
    );
};

export default ReleaseForm;
