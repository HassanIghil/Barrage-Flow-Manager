<p align="center">
  <img src="https://img.shields.io/badge/Status-En%20Développement-yellow?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Version-Manuelle%20🖊️-orange?style=for-the-badge" alt="Version"/>
  <img src="https://img.shields.io/badge/Université-Souss%20Massa-blue?style=for-the-badge" alt="University"/>
  <img src="https://img.shields.io/badge/Projet-SIBD%202025--2026-green?style=for-the-badge" alt="Project"/>
</p>

<h1 align="center">🌊 Barrage-Flow Manager — Version Manuelle</h1>
<h3 align="center">Optimisation des lâchers d'eau — Barrage Youssef Ibn Tachfine</h3>

<p align="center">
  Système d'information critique pour arbitrer entre l'irrigation agricole et la réserve de sécurité/eau potable dans la région Souss-Massa.<br/>
  <b>🖊️ Ce repo contient la version développée entièrement à la main (sans IA).</b>
</p>

---

## 🎯 Objectif du Projet

> **Arbitrer entre l'eau destinée à l'irrigation des coopératives agricoles et la réserve de sécurité/eau potable du Barrage Youssef Ibn Tachfine.**

1. **Protéger la réserve de sécurité** — Ne jamais descendre sous un seuil critique d'eau potable
2. **Répartir équitablement l'eau** — Entre les différentes coopératives agricoles
3. **Optimiser les lâchers d'eau** — En fonction du niveau du barrage, des prévisions météo et des besoins agricoles
4. **Contrôler l'accès (RBAC)** — Seul le Directeur du Barrage peut forcer un lâcher d'eau

---

## ⚙️ Stack Technique

| Couche | Technologie | Notes |
|--------|------------|-------|
| 🖥️ **Frontend** | React + Vite + TypeScript | Dashboard avec Recharts, Leaflet, TailwindCSS |
| 🔌 **Backend API** | FastAPI (Python 3.11+) | REST API avec JWT auth, RBAC |
| 🗄️ **Base de Données** | MySQL 8.0 | Triggers, procédures stockées, RBAC natif |
| 🐳 **Containerisation** | Docker + Docker Compose | Environnement de développement unifié |
| 💬 **Communication** | Slack | Un canal par équipe |
| 📦 **Versioning** | Git + GitHub | Branches par équipe, zéro conflit |

---

## 📂 Architecture du Projet

```
barrage-flow-manager/
│
├── README.md                          ← CE FICHIER
├── .gitignore
├── docker-compose.yml
│
├── 📁 backend/                        ← FastAPI Backend (Python)
│   ├── README.md                      ← Guide outils + structure
│   └── app/
│       ├── core/                      ← Config, DB, Security
│       ├── middleware/                ← Auth JWT, RBAC
│       ├── models/                    ← Modèles SQLAlchemy
│       ├── schemas/                   ← Schémas Pydantic
│       ├── routes/                    ← Endpoints API
│       ├── services/                  ← Logique métier
│       └── utils/                     ← Helpers
│
├── 📁 database/                       ← Conception & Scripts SQL
│   ├── README.md                      ← Guide équipe + outils
│   ├── conception/                    ← MERISE : MCD, MLD, MPD
│   └── sql/                           ← Scripts SQL (MySQL)
│
├── 📁 frontend/                       ← React + Vite + TypeScript
│   ├── README.md                      ← Guide outils + frameworks
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── assets/
│
├── 📁 docs/                           ← Documentation Centrale
│   ├── README.md                      ← Index des guides
│   ├── DOCKER_GUIDE.md                ← Comment utiliser Docker
│   ├── GITHUB_WORKFLOW.md             ← Branches, commits, PRs
│   ├── TOOLS_REFERENCE.md             ← Tous les outils du projet
│   └── conception/                    ← Diagrammes officiels
│
├── 📁 security/                       ← Pôle Sécurité
│   ├── red-team/                      ← 🔴 Attaque / Audit
│   │   └── GUIDE.md                   ← Guide débutant Red Team
│   └── blue-team/                     ← 🔵 Défense / Durcissement
│       └── GUIDE.md                   ← Guide débutant Blue Team
│
└── 📁 quality/                        ← QA
    └── GUIDE.md                       ← Guide débutant QA
```

---

## 👥 Équipe — Version Manuelle

> 🖊️ Ce projet est réalisé **entièrement à la main**, sans assistance IA.

### 🔧 Équipe de Développement (Filière SDBDIA)

| Membre | Rôle | Responsabilités |
|--------|------|-----------------|
| **IGHIL Hassan** | PM + Développeur | Conception (MCD), RBAC SQL, coordination projet |
| **IFQUIRNE Yassine** | Développeur | Conception (MLD), Schema SQL, Triggers, Backend |
| **ID BOULAID Aabir** | Développeur | Conception (MPD), Procédures SQL, Frontend |

### 🛡️ Pôle Sécurité & Qualité (Filière SITCN)

| Rôle | Membres | Mission | Dossier |
|------|---------|---------|---------|
| **Red Team** 🔴 | HARBECH M., HARBOUS Moncif | Tests d'intrusion, SQLi, RBAC bypass | `security/red-team/` |
| **Blue Team** 🔵 | HRIMICH Reda, IGHRANE Imane | Défense, durcissement, corrections | `security/blue-team/` |
| **QA** 🧪 | ISKANDER El Mahdi, JAIT Reda | Tests fonctionnels, comparaison IA vs Manuel | `quality/` |

### 📌 Deux Versions du Projet

| Version | Équipe | Repo |
|---------|--------|------|
| 🖊️ **Manuelle** (ce repo) | Hassan, Yassine, Aabir | [Barrage-Flow-Manager](https://github.com/HassanIghil/Barrage-Flow-Manager) |
| 🤖 **IA** | INAK Samia, IRHIL Oussama, ISLAOUINE Mouad | *(repo séparé)* |

---

## 🗓️ Calendrier & Phases

```
📅 Mars 2026     → Phase 1 : Conception MERISE (MCD → MLD → MPD)
📅 Mars 2026     → Phase 2 : Scripts SQL (Schema, Triggers, Procédures)
📅 Mars 2026     → Phase 3 : Backend FastAPI + Frontend React
📅 Mars-Avril    → Phase 4 : Red/Blue Team audits + QA tests
📅 Avril 2026    → 🎤 Soutenances
```

---

## 🌿 Workflow Git — Zéro Conflit

| Membre / Équipe | Branche | Dossier autorisé |
|--------|---------|-----------------|
| Hassan | `feat/conception`, `feat/database` | `database/`, `docs/` |
| Yassine | `feat/backend-api` | `database/`, `backend/` |
| Aabir | `feat/frontend-dashboard` | `database/`, `frontend/` |
| Red Team | `security/red-team-audit` | `security/red-team/` |
| Blue Team | `security/blue-team-defense` | `security/blue-team/` |
| QA | `quality/tests` | `quality/` |

> 📖 Voir `docs/GITHUB_WORKFLOW.md` pour le guide complet.

---

## 🚀 Lancement Rapide

```bash
# Avec Docker (recommandé)
docker-compose up -d

# Sans Docker
cd backend/ && pip install -r requirements.txt && uvicorn app.main:app --reload
cd frontend/ && npm install && npm run dev
```

> 📖 Voir `docs/DOCKER_GUIDE.md` pour le guide complet.

---

<p align="center">
  <b>Souss-Massa Resilience Prototype 2026 — Équipe 6</b><br/>
  <i>Pr. S. EL-ATEIF | SIBD Projet 2025-2026</i>
</p>
