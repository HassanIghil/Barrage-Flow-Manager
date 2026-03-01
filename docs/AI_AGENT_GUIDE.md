# 🤖 Guide Agent IA — Pour l'Équipe Augmenteds

> Ce guide explique comment utiliser un agent IA (Copilot, ChatGPT, Claude, Gemini, etc.) pour coder vos tâches **sans créer de conflits** avec les autres membres de l'équipe.

---

## 🎯 Principe Fondamental

> **L'IA est un outil, pas un remplacement.** Vous devez COMPRENDRE chaque ligne de code que l'IA génère. Lors de la soutenance, vous devrez expliquer votre code.

---

## 📋 Règles d'Or pour Coder avec l'IA

### 1. Donnez du CONTEXTE à l'IA

Avant de demander quoi que ce soit, donnez à l'IA le contexte du projet :

```
Tu travailles sur le projet "Barrage-Flow Manager".
C'est une application web avec :
- Backend : FastAPI (Python) dans le dossier backend/
- Frontend : React + Vite + TypeScript dans le dossier frontend/
- Base de données : MySQL
- Auth : JWT tokens avec RBAC (Directeur, Ingénieur, Opérateur, Auditeur)

Le projet gère les lâchers d'eau du Barrage Youssef Ibn Tachfine à Souss-Massa.
```

### 2. Précisez EXACTEMENT quel fichier créer

Ne dites jamais : _"Crée-moi le backend"_

Dites plutôt :
```
Crée le fichier backend/app/routes/auth.py avec :
- Une route POST /api/auth/login qui accepte email + password
- Vérification du mot de passe avec passlib/bcrypt
- Retour d'un token JWT avec python-jose
- Le token contient : user_id, role, email
```

### 3. UN fichier à la fois = ZÉRO conflit

| ✅ BON | ❌ MAUVAIS |
|--------|-----------|
| "Crée `backend/app/routes/auth.py`" | "Crée tout le backend" |
| "Crée `frontend/src/pages/LoginPage.tsx`" | "Crée toutes les pages" |
| "Modifie UNIQUEMENT `releaseService.ts`" | "Refactore tout le frontend" |

### 4. Respectez la structure des dossiers

Quand vous demandez à l'IA de créer un fichier, précisez le **chemin exact** :

```
Crée le fichier à cet emplacement exact : backend/app/models/user.py
Ce fichier contient le modèle SQLAlchemy pour la table "utilisateur".
```

---

## 🔧 Workflow Recommandé

### Pour chaque tâche :

1. **Lisez** votre tâche dans le `README.md` du backend ou frontend
2. **Créez une branche** : `git checkout -b feat/backend-auth`
3. **Demandez à l'IA** de générer UN fichier à la fois
4. **Relisez** le code généré — comprenez chaque ligne
5. **Testez** localement (Swagger pour l'API, navigateur pour React)
6. **Commitez** : `git commit -m "feat: ajouter la route login JWT"`
7. **Poussez** : `git push origin feat/backend-auth`
8. **Ouvrez une PR** vers `develop`

### Répartition entre les 3 membres Augmenteds

Pour éviter les conflits, chaque membre travaille sur des **fichiers différents** :

| Membre | Backend | Frontend |
|--------|---------|----------|
| **Samia** | `routes/auth.py`, `middleware/` | `pages/LoginPage.tsx`, hooks |
| **Oussama** | `routes/releases.py`, `services/` | `pages/DashboardPage.tsx`, composants graphiques |
| **Mouad** | `routes/dashboard.py`, `models/` | `pages/ReleasesPage.tsx`, `services/` |

> ⚠️ **Ne modifiez JAMAIS un fichier assigné à un autre membre** sans le prévenir sur Slack.

---

## 💡 Exemples de Prompts Efficaces

### Backend — Créer un modèle SQLAlchemy
```
Crée le fichier backend/app/models/cooperative.py.

Utilise SQLAlchemy 2.0 avec le pattern Mapped.
Table : cooperative
Colonnes :
- id_coop (INT, Primary Key, auto-increment)
- nom (VARCHAR 100, not null)
- surface_hectares (DECIMAL 10,2, not null)
- localisation_gps (VARCHAR 50)
- contact_email (VARCHAR 255)
- actif (BOOLEAN, default True)
- date_creation (DATETIME, default now)

Base de données : MySQL (pas PostgreSQL).
```

### Frontend — Créer une page React
```
Crée le fichier frontend/src/pages/DashboardPage.tsx.

Utilise :
- React avec TypeScript
- TailwindCSS pour le style
- Recharts pour un graphique LineChart du niveau d'eau
- Axios pour fetcher GET /api/dashboard/overview
- Le composant reçoit les données : { niveau_eau_m3, capacite_max_m3, alertes[] }

Le design doit être dark mode, professionnel, avec des cartes.
```

---

## ⚠️ Pièges à Éviter

1. **Ne laissez pas l'IA inventer des dépendances** — Vérifiez que les librairies sont dans `requirements.txt` ou `package.json`
2. **Ne copiez pas du code sans le comprendre** — Le prof vous interrogera
3. **Ne générez pas tout d'un coup** — Fichier par fichier, commit par commit
4. **Vérifiez les imports** — L'IA fait souvent des erreurs sur les chemins d'import
