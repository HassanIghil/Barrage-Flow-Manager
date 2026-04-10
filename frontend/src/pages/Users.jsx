import React, { useState, useEffect } from 'react';
import { UserPlus, Building2, Plus, X, Shield, Mail, MapPin, Leaf, Users as UsersIcon, Pencil } from 'lucide-react';
import apiRequest from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

const roleBadge = (role) => {
  const cfg = {
    directeur: { bg: 'rgba(239,68,68,0.08)', color: '#dc2626', border: 'rgba(239,68,68,0.2)', label: 'Directeur' },
    ingenieur: { bg: 'rgba(6,182,212,0.08)', color: '#0891b2', border: 'rgba(6,182,212,0.2)', label: 'Ingénieur' },
    operateur: { bg: 'rgba(16,185,129,0.08)', color: '#059669', border: 'rgba(16,185,129,0.2)', label: 'Opérateur' },
  };
  const c = cfg[role] || cfg.operateur;
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '4px 10px', borderRadius: '8px',
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>{c.label}</span>
  );
};

const Users = () => {
  const { user: currentUser } = useAuth();
  const isDirecteur = currentUser?.role === 'directeur';
  const [activeTab, setActiveTab] = useState('agents');
  const [users, setUsers] = useState([]);
  const [coops, setCoops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal: 'create-agent' | 'create-coop' | 'edit-agent' | 'edit-coop' | null
  const [modalType, setModalType] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalMsg, setModalMsg] = useState({ type: '', text: '' });

  // Create forms
  const emptyAgent = { nom: '', prenom: '', email: '', password: '', role: 'ingenieur' };
  const emptyCoop = { nom: '', surface_hectares: '', localisation_gps: '', contact_email: '', actif: true };
  const [agentData, setAgentData] = useState(emptyAgent);
  const [coopData, setCoopData] = useState(emptyCoop);

  // Edit forms
  const [editAgent, setEditAgent] = useState(null); // { id_user, nom, prenom, role }
  const [editCoop, setEditCoop] = useState(null); // { id_coop, nom, surface_hectares, ... }

  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, c] = await Promise.all([
        apiRequest('/users/'),
        apiRequest('/admin/management/cooperatives'),
      ]);
      setUsers(Array.isArray(u) ? u : []);
      setCoops(Array.isArray(c) ? c : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = (type) => {
    setModalMsg({ type: '', text: '' });
    if (type === 'agent') { setAgentData(emptyAgent); setModalType('create-agent'); }
    if (type === 'coop') { setCoopData(emptyCoop); setModalType('create-coop'); }
  };

  const openEditUser = (u) => {
    if (!isDirecteur) return;
    setEditAgent({ id_user: u.id_user, nom: u.nom, prenom: u.prenom, role: u.role });
    setModalMsg({ type: '', text: '' });
    setModalType('edit-agent');
  };

  const openEditCoop = (c) => {
    if (!isDirecteur) return;
    setEditCoop({
      id_coop: c.id_coop, nom: c.nom,
      surface_hectares: c.surface_hectares,
      localisation_gps: c.localisation_gps || '',
      contact_email: c.contact_email || '',
      actif: c.actif,
    });
    setModalMsg({ type: '', text: '' });
    setModalType('edit-coop');
  };

  // ── Handlers ──────────────────────
  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setSubmitting(true); setModalMsg({ type: '', text: '' });
    try {
      await apiRequest('/users/register', { method: 'POST', body: JSON.stringify(agentData) });
      setModalMsg({ type: 'success', text: 'Agent créé avec succès !' });
      fetchData();
      setTimeout(() => setModalType(null), 1000);
    } catch (error) { setModalMsg({ type: 'error', text: error.message }); }
    finally { setSubmitting(false); }
  };

  const handleCreateCoop = async (e) => {
    e.preventDefault();
    setSubmitting(true); setModalMsg({ type: '', text: '' });
    try {
      await apiRequest('/admin/management/cooperatives', {
        method: 'POST',
        body: JSON.stringify({ ...coopData, surface_hectares: parseFloat(coopData.surface_hectares) }),
      });
      setModalMsg({ type: 'success', text: 'Coopérative enregistrée !' });
      fetchData();
      setTimeout(() => setModalType(null), 1000);
    } catch (error) { setModalMsg({ type: 'error', text: error.message }); }
    finally { setSubmitting(false); }
  };

  const handleEditAgent = async (e) => {
    e.preventDefault();
    setSubmitting(true); setModalMsg({ type: '', text: '' });
    try {
      const { id_user, ...body } = editAgent;
      await apiRequest(`/users/${id_user}`, { method: 'PUT', body: JSON.stringify(body) });
      setModalMsg({ type: 'success', text: 'Agent mis à jour !' });
      fetchData();
      setTimeout(() => setModalType(null), 1000);
    } catch (error) { setModalMsg({ type: 'error', text: error.message }); }
    finally { setSubmitting(false); }
  };

  const handleEditCoop = async (e) => {
    e.preventDefault();
    setSubmitting(true); setModalMsg({ type: '', text: '' });
    try {
      const { id_coop, ...body } = editCoop;
      await apiRequest(`/admin/management/cooperatives/${id_coop}`, {
        method: 'PUT',
        body: JSON.stringify({ ...body, surface_hectares: parseFloat(body.surface_hectares) }),
      });
      setModalMsg({ type: 'success', text: 'Coopérative mise à jour !' });
      fetchData();
      setTimeout(() => setModalType(null), 1000);
    } catch (error) { setModalMsg({ type: 'error', text: error.message }); }
    finally { setSubmitting(false); }
  };

  const fixEncoding = (str) => {
    if (!str) return '';
    try { return decodeURIComponent(escape(str)); } catch { return str; }
  };

  return (
    <div className="mgmt-root">
      <style>{`

        .mgmt-root {
          min-height: 100%;
          padding: clamp(16px, 4vw, 32px) clamp(16px, 4vw, 36px);
          font-family: var(--font-main);
        }
        .mgmt-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 24px; gap: 16px; flex-wrap: wrap;
        }
        .mgmt-title {
          font-family: var(--font-headline); font-size: clamp(24px, 4vw, 32px);
          font-weight: 800; color: #1A3A42; line-height: 1.1; margin: 0 0 6px;
        }
        .mgmt-sub { font-size: 13px; color: #7A9BA0; margin: 0; line-height: 1.5; }

        .mgmt-tabs {
          display: flex; gap: 6px; background: rgba(255,255,255,0.5);
          padding: 5px; border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.75);
          margin-bottom: 20px; width: fit-content;
        }
        .mgmt-tab {
          display: flex; align-items: center; gap: 8px; padding: 10px 20px;
          border-radius: 10px; border: none; background: transparent;
          font-family: var(--font-headline); font-size: 12px; font-weight: 700;
          color: #5A7A82; cursor: pointer; transition: all 0.25s; letter-spacing: 0.02em;
        }
        .mgmt-tab:hover { background: rgba(255,255,255,0.5); }
        .mgmt-tab.active { background: #1A3A42; color: #fff; box-shadow: 0 4px 14px rgba(0,62,77,0.18); }
        .mgmt-tab .cnt { font-family: var(--font-main); font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 6px; background: rgba(0,200,174,0.12); color: #005E70; }
        .mgmt-tab.active .cnt { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.85); }

        .mgmt-add-btn {
          display: flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #005E70, #003D4D);
          color: white; border: none; border-radius: 100px;
          padding: 12px 24px; font-family: var(--font-headline); font-size: 12px;
          font-weight: 700; cursor: pointer; transition: all 0.2s;
          letter-spacing: 0.04em; flex-shrink: 0;
        }
        .mgmt-add-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,94,112,0.3); }

        .mgmt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }

        .mgmt-card {
          background: rgba(255,255,255,0.6); border: 1.5px solid rgba(255,255,255,0.85);
          border-radius: 20px; padding: 20px; backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.04); transition: all 0.2s;
          display: flex; flex-direction: column; gap: 12px;
          cursor: default; position: relative;
        }
        .mgmt-card.clickable { cursor: pointer; }
        .mgmt-card.clickable:hover { border-color: #00C8AE; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.07); }
        .mgmt-card-header { display: flex; align-items: center; gap: 14px; }
        .mgmt-avatar {
          width: 44px; height: 44px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          font-family: var(--font-headline); font-weight: 800; font-size: 15px;
        }
        .mgmt-card-name { font-family: var(--font-headline); font-weight: 800; font-size: 15px; color: #1A3A42; line-height: 1.2; }
        .mgmt-card-sub { font-size: 11px; color: #7A9BA0; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
        .mgmt-card-meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .mgmt-meta-chip { font-size: 11px; color: #5A7A82; display: flex; align-items: center; gap: 5px; background: rgba(0,0,0,0.03); padding: 4px 10px; border-radius: 8px; }
        .mgmt-edit-hint {
          position: absolute; top: 14px; right: 14px;
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,200,174,0.08); color: #005E70;
          opacity: 0; transition: opacity 0.2s;
        }
        .mgmt-card.clickable:hover .mgmt-edit-hint { opacity: 1; }

        /* Modal */
        .mgmt-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(7,40,48,0.35); backdrop-filter: blur(16px);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(12px, 3vw, 20px);
        }
        .mgmt-modal {
          width: 100%; max-width: 500px; background: white;
          border-radius: clamp(20px, 4vw, 32px); padding: clamp(24px, 5vw, 40px);
          position: relative; box-shadow: 0 40px 120px rgba(0,0,0,0.15);
          max-height: 90vh; overflow-y: auto;
        }
        .mgmt-modal-close {
          position: absolute; top: 20px; right: 20px;
          background: none; border: none; color: #8AACB2;
          cursor: pointer; padding: 4px; border-radius: 8px; transition: background 0.15s;
        }
        .mgmt-modal-close:hover { background: rgba(0,0,0,0.05); }
        .mgmt-modal-title { font-family: var(--font-headline); font-weight: 800; font-size: clamp(20px, 4vw, 24px); color: #1A3A42; margin: 0 0 6px; }
        .mgmt-modal-sub { font-size: 12px; color: #7A9BA0; margin: 0 0 28px; }

        .mf-group { margin-bottom: 18px; }
        .mf-label { display: block; font-size: 10px; font-weight: 700; color: #7A9BA0; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 6px; padding-left: 4px; }
        .mf-input, .mf-select {
          width: 100%; background: #f4f7f8; border: 1.5px solid #e5eef0;
          border-radius: 12px; padding: 12px 16px; font-size: 14px;
          color: #1A3A42; outline: none; transition: all 0.2s; box-sizing: border-box;
        }
        .mf-input:focus, .mf-select:focus { background: white; border-color: #005E70; box-shadow: 0 0 0 3px rgba(0,94,112,0.08); }
        .mf-input::placeholder { color: #b0c4c8; }
        .mf-input:disabled, .mf-select:disabled { background: #eef2f4; color: #8AACB2; cursor: not-allowed; }
        .mf-hint { font-size: 10px; color: #8AACB2; margin-top: 4px; padding-left: 4px; }
        .mf-hint-lock { font-size: 10px; color: #b0c4c8; margin-top: 3px; padding-left: 4px; font-style: italic; }
        .mf-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .mf-submit {
          width: 100%; background: #005E70; color: white; border: none;
          border-radius: 12px; padding: 14px; font-weight: 700; font-size: 14px;
          cursor: pointer; transition: all 0.2s; margin-top: 8px;
        }
        .mf-submit:hover:not(:disabled) { background: #004552; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,94,112,0.2); }
        .mf-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .mf-alert { padding: 12px 16px; border-radius: 12px; margin-bottom: 18px; font-size: 13px; font-weight: 500; }
        .mf-alert-success { background: rgba(5,150,105,0.08); color: #059669; border: 1px solid rgba(5,150,105,0.25); }
        .mf-alert-error   { background: rgba(220,38,38,0.08); color: #DC2626; border: 1px solid rgba(220,38,38,0.25); }

        .mf-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; margin-bottom: 10px; }
        .mf-toggle-label { font-size: 13px; font-weight: 600; color: #1A3A42; }
        .mf-toggle-sub { font-size: 11px; color: #7A9BA0; margin-top: 2px; }
        .mf-toggle { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
        .mf-toggle input { opacity: 0; width: 0; height: 0; }
        .mf-toggle-sl { position: absolute; inset: 0; background: #cfd8dc; border-radius: 999px; cursor: pointer; transition: background 0.25s; }
        .mf-toggle-sl::after { content: ''; position: absolute; width: 18px; height: 18px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: transform 0.25s; box-shadow: 0 2px 4px rgba(0,0,0,0.15); }
        .mf-toggle input:checked + .mf-toggle-sl { background: #00C8AE; }
        .mf-toggle input:checked + .mf-toggle-sl::after { transform: translateX(20px); }

        .mgmt-empty { text-align: center; padding: 60px 20px; color: #7A9BA0; font-size: 13px; background: rgba(255,255,255,0.35); border-radius: 20px; border: 1.5px dashed rgba(138,172,178,0.3); }
        .mgmt-loading { text-align: center; padding: 60px; color: #005E70; font-weight: 600; }

        @media (max-width: 600px) {
          .mgmt-header { flex-direction: column; }
          .mgmt-tabs { width: 100%; }
          .mgmt-tab { flex: 1; justify-content: center; padding: 10px 12px; font-size: 11px; }
          .mgmt-grid { grid-template-columns: 1fr; }
          .mf-grid2 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Header ──────────────────────── */}
      <div className="mgmt-header">
        <div>
          <h1 className="mgmt-title">{"Agents & Coop\u00e9ratives"}</h1>
          <p className="mgmt-sub">{"Gestion des comptes utilisateurs et des coop\u00e9ratives agricoles."}</p>
        </div>
        {isDirecteur && (
          <button className="mgmt-add-btn" onClick={() => openCreate(activeTab === 'agents' ? 'agent' : 'coop')}>
            <Plus size={16} />
            {activeTab === 'agents' ? 'NOUVEL AGENT' : "NOUVELLE COOP\u00c9RATIVE"}
          </button>
        )}
      </div>

      {/* ── Tabs ────────────────────────── */}
      <div className="mgmt-tabs">
        <button className={`mgmt-tab ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>
          <UsersIcon size={15} /> Agents <span className="cnt">{users.length}</span>
        </button>
        <button className={`mgmt-tab ${activeTab === 'coops' ? 'active' : ''}`} onClick={() => setActiveTab('coops')}>
          <Building2 size={15} /> {"Coop\u00e9ratives"} <span className="cnt">{coops.length}</span>
        </button>
      </div>

      {/* ── Content ─────────────────────── */}
      {loading ? (
        <LoadingOverlay message="Indexation des agents et coopératives..." />
      ) : (
        <>
          {/* ═══ AGENTS ═══ */}
          {activeTab === 'agents' && (
            users.length > 0 ? (
              <div className="mgmt-grid">
                {users.map(u => (
                  <div key={u.id_user} className={`mgmt-card ${isDirecteur ? 'clickable' : ''}`}
                    onClick={() => openEditUser(u)}>
                    {isDirecteur && <div className="mgmt-edit-hint"><Pencil size={13} /></div>}
                    <div className="mgmt-card-header">
                      <div className="mgmt-avatar" style={{
                        background: u.role === 'directeur' ? 'rgba(239,68,68,0.08)' : u.role === 'ingenieur' ? 'rgba(6,182,212,0.08)' : 'rgba(16,185,129,0.08)',
                        color: u.role === 'directeur' ? '#dc2626' : u.role === 'ingenieur' ? '#0891b2' : '#059669',
                      }}>
                        {(u.prenom?.[0] || '').toUpperCase()}{(u.nom?.[0] || '').toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="mgmt-card-name">{fixEncoding(u.prenom)} {fixEncoding(u.nom)}</div>
                        <div className="mgmt-card-sub"><Mail size={10} /> {u.email}</div>
                      </div>
                    </div>
                    <div className="mgmt-card-meta">
                      {roleBadge(u.role)}
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="mgmt-empty">{"Aucun agent enregistr\u00e9."}</div>
          )}

          {/* ═══ COOPS ═══ */}
          {activeTab === 'coops' && (
            coops.length > 0 ? (
              <div className="mgmt-grid">
                {coops.map(c => (
                  <div key={c.id_coop} className={`mgmt-card ${isDirecteur ? 'clickable' : ''}`}
                    onClick={() => openEditCoop(c)}>
                    {isDirecteur && <div className="mgmt-edit-hint"><Pencil size={13} /></div>}
                    <div className="mgmt-card-header">
                      <div className="mgmt-avatar" style={{
                        background: c.actif ? 'rgba(0,200,174,0.1)' : 'rgba(0,0,0,0.04)',
                        color: c.actif ? '#005E70' : '#999',
                      }}>
                        <Building2 size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="mgmt-card-name">{fixEncoding(c.nom)}</div>
                        <div className="mgmt-card-sub">
                          {c.actif
                            ? <><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Active</>
                            : <><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block' }} /> Inactive</>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="mgmt-card-meta">
                      <span className="mgmt-meta-chip"><Leaf size={10} /> {Number(c.surface_hectares).toLocaleString()} ha</span>
                      {c.localisation_gps && <span className="mgmt-meta-chip"><MapPin size={10} /> GPS</span>}
                      {c.contact_email && <span className="mgmt-meta-chip"><Mail size={10} /> {c.contact_email}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="mgmt-empty">{"Aucune coop\u00e9rative enregistr\u00e9e."}</div>
          )}
        </>
      )}

      {/* ── MODALS ──────────────────────── */}
      {modalType && (
        <div className="mgmt-overlay" onClick={() => !submitting && setModalType(null)}>
          <div className="mgmt-modal" onClick={e => e.stopPropagation()}>
            <button className="mgmt-modal-close" onClick={() => setModalType(null)}><X size={20} /></button>

            {/* ═══ CREATE AGENT ═══ */}
            {modalType === 'create-agent' && (
              <>
                <h2 className="mgmt-modal-title">Nouvel Agent</h2>
                <p className="mgmt-modal-sub">{"Cr\u00e9ation d\u2019un compte pour un membre de l\u2019\u00e9quipe."}</p>
                {modalMsg.text && <div className={`mf-alert mf-alert-${modalMsg.type}`}>{modalMsg.text}</div>}
                <form onSubmit={handleCreateAgent}>
                  <div className="mf-grid2">
                    <div className="mf-group">
                      <label className="mf-label">{"Pr\u00e9nom"}</label>
                      <input type="text" className="mf-input" value={agentData.prenom}
                        onChange={e => setAgentData({ ...agentData, prenom: e.target.value })}
                        required placeholder="Ex: Jean" />
                    </div>
                    <div className="mf-group">
                      <label className="mf-label">Nom</label>
                      <input type="text" className="mf-input" value={agentData.nom}
                        onChange={e => setAgentData({ ...agentData, nom: e.target.value })}
                        required placeholder="Ex: Dupont" />
                    </div>
                  </div>
                  <div className="mf-group">
                    <label className="mf-label">Email</label>
                    <input type="email" className="mf-input" value={agentData.email}
                      onChange={e => setAgentData({ ...agentData, email: e.target.value })}
                      required placeholder="agent@barrage-yt.ma" />
                  </div>
                  <div className="mf-group">
                    <label className="mf-label">Mot de passe provisoire</label>
                    <input type="password" className="mf-input" value={agentData.password}
                      onChange={e => setAgentData({ ...agentData, password: e.target.value })}
                      required minLength="8" placeholder="••••••••" />
                  </div>
                  <div className="mf-group">
                    <label className="mf-label">{"R\u00f4le"}</label>
                    <select className="mf-select" value={agentData.role}
                      onChange={e => setAgentData({ ...agentData, role: e.target.value })} required>
                      <option value="ingenieur">{"Ing\u00e9nieur Hydraulique"}</option>
                      <option value="operateur">{"Op\u00e9rateur de Terrain"}</option>
                      <option value="directeur">{"Directeur / Administrateur"}</option>
                    </select>
                  </div>
                  <button type="submit" className="mf-submit" disabled={submitting}>
                    {submitting ? 'Création...' : 'CRÉER LE COMPTE'}
                  </button>
                </form>
              </>
            )}

            {/* ═══ EDIT AGENT ═══ */}
            {modalType === 'edit-agent' && editAgent && (
              <>
                <h2 className="mgmt-modal-title">{"Modifier l\u2019Agent"}</h2>
                <p className="mgmt-modal-sub">{"Mettez \u00e0 jour les informations de cet utilisateur."}</p>
                {modalMsg.text && <div className={`mf-alert mf-alert-${modalMsg.type}`}>{modalMsg.text}</div>}
                <form onSubmit={handleEditAgent}>
                  <div className="mf-grid2">
                    <div className="mf-group">
                      <label className="mf-label">{"Pr\u00e9nom"}</label>
                      <input type="text" className="mf-input" value={editAgent.prenom}
                        onChange={e => setEditAgent({ ...editAgent, prenom: e.target.value })} required />
                    </div>
                    <div className="mf-group">
                      <label className="mf-label">Nom</label>
                      <input type="text" className="mf-input" value={editAgent.nom}
                        onChange={e => setEditAgent({ ...editAgent, nom: e.target.value })} required />
                    </div>
                  </div>
                  <div className="mf-group">
                    <label className="mf-label">{"R\u00f4le"}</label>
                    <select className="mf-select" value={editAgent.role}
                      onChange={e => setEditAgent({ ...editAgent, role: e.target.value })} required>
                      <option value="ingenieur">{"Ing\u00e9nieur Hydraulique"}</option>
                      <option value="operateur">{"Op\u00e9rateur de Terrain"}</option>
                      <option value="directeur">{"Directeur / Administrateur"}</option>
                    </select>
                  </div>
                  <div className="mf-group" style={{ opacity: 0.5 }}>
                    <label className="mf-label">Email</label>
                    <input type="email" className="mf-input" disabled
                      value={users.find(u => u.id_user === editAgent.id_user)?.email || ''} />
                    <p className="mf-hint-lock">{"L\u2019email ne peut pas \u00eatre modifi\u00e9 depuis cette interface."}</p>
                  </div>
                  <button type="submit" className="mf-submit" disabled={submitting}>
                    {submitting ? 'Enregistrement...' : 'SAUVEGARDER'}
                  </button>
                </form>
              </>
            )}

            {/* ═══ CREATE COOP ═══ */}
            {modalType === 'create-coop' && (
              <>
                <h2 className="mgmt-modal-title">{"Nouvelle Coop\u00e9rative"}</h2>
                <p className="mgmt-modal-sub">{"Ajoutez une coop\u00e9rative au r\u00e9seau d\u2019irrigation."}</p>
                {modalMsg.text && <div className={`mf-alert mf-alert-${modalMsg.type}`}>{modalMsg.text}</div>}
                <form onSubmit={handleCreateCoop}>
                  <div className="mf-group">
                    <label className="mf-label">{"Nom de la coop\u00e9rative"}</label>
                    <input type="text" className="mf-input" value={coopData.nom}
                      onChange={e => setCoopData({ ...coopData, nom: e.target.value })}
                      required minLength="2" placeholder="Ex: Coop Al Amal" />
                  </div>
                  <div className="mf-grid2">
                    <div className="mf-group">
                      <label className="mf-label">Surface (ha)</label>
                      <input type="number" className="mf-input" value={coopData.surface_hectares}
                        onChange={e => setCoopData({ ...coopData, surface_hectares: e.target.value })}
                        required min="1" step="any" placeholder="1200" />
                    </div>
                    <div className="mf-group">
                      <label className="mf-label">Email Contact</label>
                      <input type="email" className="mf-input" value={coopData.contact_email}
                        onChange={e => setCoopData({ ...coopData, contact_email: e.target.value })}
                        placeholder="contact@coop.ma" />
                    </div>
                  </div>
                  <div className="mf-group">
                    <label className="mf-label">Localisation GPS</label>
                    <input type="text" className="mf-input" value={coopData.localisation_gps}
                      onChange={e => setCoopData({ ...coopData, localisation_gps: e.target.value })}
                      placeholder="29.7500,-9.8000" />
                    <p className="mf-hint">{"Format\u00a0: latitude,longitude"}</p>
                  </div>
                  <div className="mf-toggle-row">
                    <div>
                      <div className="mf-toggle-label">{"Coop\u00e9rative Active"}</div>
                      <div className="mf-toggle-sub">{"Visible dans les demandes d\u2019irrigation"}</div>
                    </div>
                    <label className="mf-toggle">
                      <input type="checkbox" checked={coopData.actif}
                        onChange={e => setCoopData({ ...coopData, actif: e.target.checked })} />
                      <span className="mf-toggle-sl" />
                    </label>
                  </div>
                  <button type="submit" className="mf-submit" disabled={submitting}>
                    {submitting ? 'Enregistrement...' : 'ENREGISTRER'}
                  </button>
                </form>
              </>
            )}

            {/* ═══ EDIT COOP ═══ */}
            {modalType === 'edit-coop' && editCoop && (
              <>
                <h2 className="mgmt-modal-title">{"Modifier la Coop\u00e9rative"}</h2>
                <p className="mgmt-modal-sub">{"Mettez \u00e0 jour les informations de cette coop\u00e9rative."}</p>
                {modalMsg.text && <div className={`mf-alert mf-alert-${modalMsg.type}`}>{modalMsg.text}</div>}
                <form onSubmit={handleEditCoop}>
                  <div className="mf-group">
                    <label className="mf-label">{"Nom de la coop\u00e9rative"}</label>
                    <input type="text" className="mf-input" value={editCoop.nom}
                      onChange={e => setEditCoop({ ...editCoop, nom: e.target.value })} required />
                  </div>
                  <div className="mf-grid2">
                    <div className="mf-group">
                      <label className="mf-label">Surface (ha)</label>
                      <input type="number" className="mf-input" value={editCoop.surface_hectares}
                        onChange={e => setEditCoop({ ...editCoop, surface_hectares: e.target.value })}
                        required min="1" step="any" />
                    </div>
                    <div className="mf-group">
                      <label className="mf-label">Email Contact</label>
                      <input type="email" className="mf-input" value={editCoop.contact_email}
                        onChange={e => setEditCoop({ ...editCoop, contact_email: e.target.value })}
                        placeholder="contact@coop.ma" />
                    </div>
                  </div>
                  <div className="mf-group">
                    <label className="mf-label">Localisation GPS</label>
                    <input type="text" className="mf-input" value={editCoop.localisation_gps}
                      onChange={e => setEditCoop({ ...editCoop, localisation_gps: e.target.value })}
                      placeholder="29.7500,-9.8000" />
                    <p className="mf-hint">{"Format\u00a0: latitude,longitude"}</p>
                  </div>
                  <div className="mf-toggle-row">
                    <div>
                      <div className="mf-toggle-label">{"Coop\u00e9rative Active"}</div>
                      <div className="mf-toggle-sub">{"D\u00e9sactiver masquera la coop\u00e9rative du syst\u00e8me"}</div>
                    </div>
                    <label className="mf-toggle">
                      <input type="checkbox" checked={editCoop.actif}
                        onChange={e => setEditCoop({ ...editCoop, actif: e.target.checked })} />
                      <span className="mf-toggle-sl" />
                    </label>
                  </div>
                  <button type="submit" className="mf-submit" disabled={submitting}>
                    {submitting ? 'Enregistrement...' : 'SAUVEGARDER'}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Users;