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
| 🖥️ **Frontend** | React + Vite + TypeScript | Dashboard avec Recharts, Leaflet, TailwindCSS |
| 🔌 **Backend API** | FastAPI (Python 3.11+) | REST API avec JWT auth, RBAC |
| 🗄️ **Base de Données** | MySQL 8.0 | Triggers, procédures stockées, RBAC natif |
| 🐳 **Containerisation** | Docker + Docker Compose | Environnement de développement unifié |
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
