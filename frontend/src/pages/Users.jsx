import React, { useState } from 'react';
import apiRequest from '../services/api';

const Users = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'ingenieur'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await apiRequest('/users/register', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setMessage({ type: 'success', text: 'Nouvel agent créé avec succès !' });
            setFormData({ nom: '', prenom: '', email: '', password: '', role: 'ingenieur' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="users-root">
            <style>{`
                .users-root {
                    min-height: 100%;
                    width: 100%;
                    background: #D4DCDE;
                    padding: clamp(24px, 4vh, 48px) clamp(24px, 4vw, 40px);
                    font-family: 'DM Sans', sans-serif;
                }
                .users-container {
                    max-width: 600px;
                    margin: 0 auto;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.55);
                    border: 1.5px solid rgba(255, 255, 255, 0.8);
                    border-radius: 28px;
                    padding: 40px;
                    backdrop-filter: blur(16px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-label {
                    display: block;
                    font-size: 10px;
                    font-weight: 700;
                    color: #7A9BA0;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    margin-bottom: 8px;
                }
                .form-input, .form-select {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-size: 14px;
                    color: #1A3A42;
                    outline: none;
                    transition: all 0.2s;
                }
                .form-input:focus, .form-select:focus {
                    background: white;
                    border-color: #005E70;
                }
                .submit-btn {
                    width: 100%;
                    background: #005E70;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 14px;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 10px;
                }
                .submit-btn:hover:not(:disabled) {
                    background: #004552;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 94, 112, 0.2);
                }
                .submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .alert {
                    padding: 12px 16px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    font-weight: 500;
                }
                .alert-success {
                    background: rgba(5, 150, 105, 0.1);
                    color: #059669;
                    border: 1px solid rgba(5, 150, 105, 0.3);
                }
                .alert-error {
                    background: rgba(220, 38, 38, 0.1);
                    color: #DC2626;
                    border: 1px solid rgba(220, 38, 38, 0.3);
                }
                .eyebrow {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #005E70;
                    margin-bottom: 8px;
                }
                .page-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(32px, 5vw, 40px);
                    font-weight: 800;
                    color: #1A3A42;
                    line-height: 1.1;
                    margin-bottom: 12px;
                }
            `}</style>

            <div className="users-container">
                <div style={{ marginBottom: '40px' }}>
                    <p className="eyebrow">Gestion RH</p>
                    <h1 className="page-title">Nouvel Agent</h1>
                    <p style={{ color: '#5A7A82', fontSize: '14px' }}>
                        Créez de nouveaux comptes pour les ingénieurs ou les opérateurs du barrage.
                    </p>
                </div>

                <div className="glass-card">
                    {message.text && (
                        <div className={`alert alert-${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Prénom</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    className="form-input"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Jean"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    className="form-input"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Dupont"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Professionnel</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="jean.dupont@barrage.gov"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mot de passe provisoire</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="8"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Rôle Attribué</label>
                            <select
                                name="role"
                                className="form-select"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="ingenieur">Ingénieur Hydraulique</option>
                                <option value="operateur">Opérateur de Terrain</option>
                                <option value="directeur">Directeur / Administrateur</option>
                            </select>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Création en cours...' : 'CRÉER LE COMPTE AGENT'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Users;
