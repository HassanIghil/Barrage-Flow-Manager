<p align="center">
  <img src="https://img.shields.io/badge/Status-En%20Développement-yellow?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Version-Manuelle%20🖊️-orange?style=for-the-badge" alt="Version"/>
  <img src="https://img.shields.io/badge/Université-Souss%20Massa-blue?style=for-the-badge" alt="University"/>
  <img src="https://img.shields.io/badge/Projet-SIBD%202025--2026-green?style=for-the-badge" alt="Project"/>
</p>

<h1 align="center">🌊 Barrage-Flow Manager — Version Manuelle</h1>
<h3 align="center">Optimisation des lâchers d'eau — Barrage Youssef Ibn Tachfine</h3>

<p align="center">
  <b>Solution de gestion hydrique stratégique pour le barrage Youssef Ibn Tachfine.</b><br/>
  Arbitrage sécurisé entre l'irrigation agricole et les réserves vitales d'eau potable.<br/>
  <br/>
  <b>🏆 Partenariat : Intelligence Humaine 🤝 Intelligence Artificielle</b><br/>
  Projet collaboratif comparant deux approches de développement :<br/>
  <b>1. Équipe Manuelle (Ce Repo)</b> : Hassan, Yassine, Aabir (Conception MERISE & Code Artisan).<br/>
  <b>2. Équipe Augmentée (IA)</b> : Samia, Oussama, Mouad (Code Assisté par IA).
</p>

---

## 🎯 Vision & Objectifs

> "Gérer chaque goutte pour la résilience de notre région."

Le système repose sur quatre piliers fondamentaux :

1.  **🛡️ Protection des Réserves Vitales** : Algorithmes de contrôle empêchant le niveau du barrage de descendre sous le seuil critique de l'AEP (Alimentation en Eau Potable).
2.  **⚖️ Équité de Répartition** : Système de distribution intelligent pour les coopératives agricoles basé sur les surfaces et l'historique de consommation.
3.  **📊 Aide à la Décision** : Tableau de bord analytique en temps réel (Temps, Pluviométrie, Niveaux) pour optimiser chaque lâcher d'eau.
4.  **🔒 Sécurité Critique (RBAC)** : Hiérarchie de contrôle stricte garantissant que seul le **Directeur du Barrage** peut autoriser ou forcer des actions d'urgence.

---

## ⚙️ Stack Technique

| Couche | Technologie | Notes |
|--------|------------|-------|
| 🖥️ **Frontend** | React 18 + Vite + JavaScript (JSX) | Dashboard avec Recharts, Leaflet, TailwindCSS |
| 🔌 **Backend API** | FastAPI (Python 3.12) | REST API avec JWT auth, RBAC |
| 🗄️ **Base de Données** | MySQL 8.0 | Triggers, procédures stockées, RBAC natif |
| 🐳 **Containerisation** | Docker + Docker Compose | 4 services (Backend, Frontend, MySQL, phpMyAdmin) |
| 💬 **Communication** | Slack | Canaux dédiés par pôle (Audit, Dev, QA) |
| 📦 **Versioning** | Git + GitHub | Workflow strict (PR + Approval) |

---

## 📂 Architecture du Projet

```
barrage-flow-manager/
│
├── README.md                          ← CE FICHIER
├── .gitignore
├── docker-compose.yml
│
├── 📁 backend/                        ← FastAPI Backend (Python 3.12)
│   ├── Dockerfile                     ← Image Python 3.12-slim
│   ├── requirements.txt               ← Dépendances Python
│   ├── README.md                      ← Guide outils + structure
│   └── app/
│       ├── main.py                    ← Point d'entrée FastAPI + CORS
│       ├── core/                      ← Config, DB, Security (JWT + bcrypt)
│       ├── middleware/                ← RBAC (role_checker)
│       ├── models/                    ← 7 Modèles SQLAlchemy
│       ├── schemas/                   ← Schémas Pydantic (validation)
│       ├── routes/                    ← 7 modules API REST
│       ├── services/                  ← Logique métier
│       └── utils/                     ← Helpers
│
├── 📁 database/                       ← Conception & Scripts SQL
│   ├── README.md                      ← Guide équipe + outils
│   ├── conception/                    ← MERISE : MCD, MLD, MPD
│   └── sql/                           ← Scripts SQL (MySQL)
│
├── 📁 frontend/                       ← React 18 + Vite + JSX
│   ├── Dockerfile                     ← Multi-stage (Node 20 → serve)
│   ├── package.json                   ← Dépendances NPM
│   ├── vite.config.js
│   ├── tailwind.config.js             ← Thème AquaFlow custom
│   ├── README.md                      ← Guide outils + frameworks
│   └── src/
│       ├── App.jsx                    ← Routeur + routes protégées
│       ├── main.jsx                   ← Point d'entrée (Providers)
│       ├── components/                ← Sidebar, ProtectedRoute, ReleaseForm...
│       ├── pages/                     ← Login, Dashboard, Demands, Releases...
│       ├── context/                   ← AuthContext, ThemeContext
│       ├── layouts/                   ← MainLayout (sidebar + content)
│       ├── hooks/                     ← Hooks personnalisés
│       ├── services/                  ← api.js (client HTTP fetch natif)
│       └── assets/
│
├── 📁 docs/                           ← Documentation Centrale
│   ├── README.md                      ← Index des guides
│   ├── DOCKER_GUIDE.md                ← Comment utiliser Docker
│   ├── GITHUB_WORKFLOW.md             ← Branches, commits, PRs
│   ├── TOOLS_REFERENCE.md             ← Tous les outils du projet
│   ├── rapport_projet.pdf             ← Rapport Final (Développement)
│   ├── rapport_projet_ia.pdf          ← Rapport Final (Version assistée par IA)
│   ├── 📁 conception/                 ← Diagrammes officiels
│
├── 📁 security/                       ← Pôle Sécurité
│   ├── 📁 red-team/                   ← 🔴 Attaque / Audit
│   │   ├── GUIDE.md                   ← Guide débutant Red Team
│   │   └── 📁 reports/                ← Rapports d'audit
│   │       └── RedTeam_Report.pdf
│   └── 📁 blue-team/                  ← 🔵 Défense / Durcissement
│       ├── GUIDE.md                   ← Guide débutant Blue Team
│       └── 📁 reports/                ← Rapports de défense
│           └── blueTeam_Report.pdf
│
└── 📁 quality/                        ← QA
    ├── GUIDE.md                       ← Guide débutant QA
    └── 📁 reports/                    ← Rapports QA
        └── QA_report.pdf
```

---

## 👥 Équipe — Version Manuelle

> 🖊️ Ce projet est réalisé **entièrement à la main**, sans assistance IA.

### 🔧 Développement (Collaboration Full-Stack)

Les équipes travaillent en **partenariat total** sur l'ensemble des couches techniques.

| Membres | Focus |
| :--- | :--- |
| **Hassan (PM), Yassine, Aabir** | Conception MERISE, Backend FastAPI, Frontend React |
| **Samia, Oussama, Mouad** | Version IA (Architecture & Code généré) |

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
| 🤖 **IA** | INAK Samia, IRHIL Oussama, ISLAOUINE Mouad | [Barrage-Flow-Manager-AI-version](https://github.com/HassanIghil/barrage-flow-manager-ai-version) |

---

## 👨‍💻 Membres de l'Équipe Complète

### 🎓 Filière SDBDIA (Sciences des Données, Big Data et Intelligence Artificielle)

| Membre | Rôle | Équipe | GitHub |
| :--- | :--- | :--- | :--- |
| **IGHIL Hassan** | Chef de Projet (PM) | 🖊️ Manuelle | [@HassanIghil](https://github.com/HassanIghil) |
| **IFQUIRNE Yassine** | Développeur Full-Stack | 🖊️ Manuelle | [@yassine-ifquirne](https://github.com/yassine-ifquirne) |
| **BOULAID Aabir** | Développeuse Full-Stack | 🖊️ Manuelle | [@aabirid](https://github.com/aabirid) |
| **INAK Samia** | Développeuse (IA) | 🤖 IA | [@Samia-i](https://github.com/Samia-i) |
| **IRHIL Oussama** | Développeur (IA) | 🤖 IA | [@IrhilOussama](https://github.com/IrhilOussama) |
| **ISLAOUINE Mouad** | Développeur (IA) | 🤖 IA | [@MOUADISLAOUINE](https://github.com/MOUADISLAOUINE) |

### 🛡️ Filière SITCN (Sécurité Informatique et Technologies de Communication Numérique)

| Membre | Rôle | Pôle | GitHub |
| :--- | :--- | :--- | :--- |
| **HARBECH M.** | Pentester | 🔴 Red Team | *en attente* |
| **HARBOUS Moncif** | Pentester | 🔴 Red Team | [@Moncif977](https://github.com/Moncif977) |
| **HRIMICH Reda** | Défense & Durcissement | 🔵 Blue Team | [@Hr-reda](https://github.com/Hr-reda) |
| **IGHRANE Imane** | Défense & Durcissement | 🔵 Blue Team | [@IMANE-10](https://github.com/IMANE-10) |
| **ISKANDER El Mahdi** | QA Tester | 🧪 QA | [@Mehdi23-bit](https://github.com/Mehdi23-bit) |
| **JAIT Reda** | QA Tester | 🧪 QA | [@RedaJait](https://github.com/RedaJait) |

---

## 🎬 Démo Vidéo

<p align="center">
  <a href="https://youtu.be/agdu-NjDP54">
    <img src="https://img.youtube.com/vi/agdu-NjDP54/maxresdefault.jpg" alt="Démo Vidéo — Barrage-Flow Manager" width="700"/>
  </a>
  <br/><br/>
  <b>▶️ Cliquez sur l'image pour voir la démo complète sur YouTube</b>
</p>

---

## 📄 Rapports du Projet

| Document | Équipe | Lien |
|----------|--------|------|
| 📝 Rapport Final — Développement | 🖊️ Architects (SDBDIA) | [rapport_projet.pdf](docs/rapport_projet.pdf) |
| 🤖 Rapport Final — Assistants IA | 🤖 Augmenteds (SDBDIA) | [rapport_projet_ia.pdf](docs/rapport_projet_ia.pdf) |
| 🔴 Rapport Red Team — Tests d'intrusion | 🛡️ SITCN | [RedTeam_Report.pdf](security/red-team/reports/RedTeam_Report.pdf) |
| 🔵 Rapport Blue Team — Défense & Durcissement | 🛡️ SITCN | [blueTeam_Report.pdf](security/blue-team/reports/blueTeam_Report.pdf) |
| 🧪 Rapport QA — Tests fonctionnels | 🧪 SITCN | [QA_report.pdf](quality/reports/QA_report.pdf) |
---

## 🗓️ Phases

1.  **Conception** : MERISE (MCD → MLD → MPD).
2.  **Base de Données** : Scripts SQL (Triggers & Procédures).
3.  **Développement** : Backend FastAPI & Frontend React.
4.  **Audit & Qualité** : Tests de sécurité et fonctionnels.
5.  **Livraison** : Avril 2026.

## 💬 Communication (Slack Refactor)

| Canal | Usage | Membres |
| :--- | :--- | :--- |
| **`#announcements`** | Communications officielles & Deadlines | Tout le monde |
| **`#manual-dev-team`** | Discussion technique Version Manuelle | Hassan, Yassine, Aabir |
| **`#ai-dev-team`** | Coordination avec l'équipe IA | Samia, Oussama, Mouad |
| **`#pr-reviews`** | Validation des Pull Requests (Hassan) | PM + Devs |
| **`#security-audit`** | Pôle Sécurité (Red/Blue Team) | SITCN Team |
| **`#qa-testing`** | Rapports de bugs & Tests | QA Team |

---

## 🌿 Workflow Git

| Branche | Usage |
| :--- | :--- |
| `main` | Production & Merges officiels |
| `feat/conception-*` | Travaux de conception MERISE |
| `feat/backend-*` | Développement de l'API |
| `feat/frontend-*` | Développement de l'interface |
| `security/*` | Audits et correctifs de sécurité |

> 📖 Voir `docs/GITHUB_WORKFLOW.md` pour les détails.

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
