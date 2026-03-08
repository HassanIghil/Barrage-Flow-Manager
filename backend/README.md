# 🐍 Backend — FastAPI (Python)

> **Équipe responsable :** Version Manuelle (IGHIL Hassan, IFQUIRNE Yassine, ID BOULAID Aabir)
> **Branche GitHub :** `feat/backend-api`

Ce dossier contient l'API REST qui connecte le Frontend React à la Base de Données.

---

## ⚙️ Outils & Technologies

| Outil | Version | Rôle |
|-------|---------|------|
| **Python** | 3.11+ | Langage principal |
| **FastAPI** | 0.100+ | Framework API (async, auto-docs Swagger) |
| **Uvicorn** | 0.23+ | Serveur ASGI pour lancer FastAPI |
| **SQLAlchemy** | 2.0+ | ORM — Modèles de tables Python ↔ SQL |
| **Pydantic** | 2.0+ | Validation des données entrantes (schemas) |
| **Alembic** | 1.12+ | Migrations de base de données |
| **python-jose** | 3.3+ | Génération et vérification des tokens JWT |
| **passlib + bcrypt** | — | Hashing sécurisé des mots de passe |
| **mysql-connector-python** | 8.0+ | Connecteur MySQL pour Python |
| **python-dotenv** | — | Variables d'environnement (`.env`) |

### Installation rapide

```bash
cd backend/
python -m venv venv
source venv/bin/activate          # Linux/Mac
# venv\Scripts\activate           # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

> 📖 L'API sera documentée automatiquement sur `http://localhost:8000/docs` (Swagger UI).

---

## 📂 Structure des Dossiers

```
backend/
├── README.md              ← CE FICHIER
├── requirements.txt       ← Dépendances Python
├── .env.example           ← Variables d'env (copier en .env)
├── Dockerfile             ← Container Docker
│
└── app/
    ├── main.py            ← Point d'entrée FastAPI (CORS, startup)
    │
    ├── core/              ← ⚙️ Configuration
    │   ├── config.py      ← Settings (DB_URL, SECRET_KEY, etc.)
    │   ├── database.py    ← Connexion SQLAlchemy à MySQL
    │   └── security.py    ← Fonctions JWT (create_token, verify_token)
    │
    ├── middleware/         ← 🛡️ Middleware
    │   ├── auth.py        ← Middleware d'authentification JWT
    │   └── rbac.py        ← Contrôle d'accès basé sur les rôles
    │
    ├── models/            ← 🗄️ Modèles SQLAlchemy (tables)
    │   ├── user.py        ← Table Users (Directeur, Ingénieur, etc.)
    │   ├── cooperative.py ← Table Coopératives agricoles
    │   ├── water_release.py ← Table Lâchers d'eau
    │   └── alert.py       ← Table Alertes
    │
    ├── schemas/           ← 📋 Schémas Pydantic (validation)
    │   ├── user.py        ← UserCreate, UserLogin, UserResponse
    │   ├── water_release.py ← ReleaseRequest, ReleaseResponse
    │   └── alert.py       ← AlertResponse
    │
    ├── routes/            ← 🔌 Endpoints API
    │   ├── auth.py        ← POST /api/auth/login, /register
    │   ├── dashboard.py   ← GET /api/dashboard/overview
    │   ├── releases.py    ← POST /api/releases, /releases/force
    │   └── cooperatives.py ← GET /api/cooperatives
    │
    ├── services/          ← 🧠 Logique métier
    │   ├── release_service.py   ← Calcul répartition eau
    │   ├── dashboard_service.py ← Agrégation données dashboard
    │   └── alert_service.py     ← Gestion alertes critiques
    │
    └── utils/             ← 🔧 Helpers
        ├── constants.py   ← Seuils critiques, unités
        └── helpers.py     ← Conversions m³/litres, etc.
```

---

## 🚨 Règles pour l'Équipe

1. **Ne touchez JAMAIS** aux dossiers `database/conception/`, `security/`, ou `quality/`.
2. **Créez des petites branches** : `feat/api-auth`, `feat/api-releases`, `feat/api-dashboard`.
3. **Testez chaque route** avec le Swagger UI (`/docs`) avant de faire un Pull Request.
4. **Protégez les secrets** : Ne commitez JAMAIS le fichier `.env`. Utilisez `.env.example` comme template.

---

## 🔗 Routes API Principales

| Méthode | Route | Rôle | Accès |
|---------|-------|------|-------|
| `POST` | `/api/auth/login` | Connexion utilisateur | Public |
| `POST` | `/api/auth/register` | Créer un compte | Admin |
| `GET` | `/api/dashboard/overview` | Données du dashboard | Authentifié |
| `POST` | `/api/releases` | Demander un lâcher d'eau | Ingénieur+ |
| `POST` | `/api/releases/force` | Forcer un lâcher (urgence) | **Directeur uniquement** |
| `GET` | `/api/cooperatives` | Liste des coopératives | Authentifié |
| `GET` | `/api/alerts` | Alertes critiques | Authentifié |
