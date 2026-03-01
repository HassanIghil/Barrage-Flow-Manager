# ⚛️ Frontend — React + Vite (TypeScript)

> **Équipe responsable :** Augmenteds (INAK Samia, IRHIL Oussama, ISLAOUINE Mouad)
> **Branche GitHub :** `feat/frontend-dashboard`

Ce dossier contient le **Dashboard Web** pour visualiser et contrôler les lâchers d'eau du Barrage Youssef Ibn Tachfine.

---

## ⚙️ Outils & Technologies

| Outil | Version | Rôle |
|-------|---------|------|
| **React** | 18+ | Librairie UI (composants) |
| **Vite** | 5+ | Build tool ultra-rapide (remplace Webpack) |
| **TypeScript** | 5+ | Typage fort pour moins de bugs |
| **TailwindCSS** | 3+ | Framework CSS utility-first pour un design moderne |
| **Shadcn/UI** | — | Composants UI pré-stylés et accessibles (boutons, modals, tables) |
| **Recharts** | 2+ | Graphiques : niveau du barrage, historique des lâchers |
| **Leaflet.js** | 1.9+ | Carte interactive : position des coopératives agricoles |
| **React Router** | 6+ | Navigation entre les pages (Dashboard, Login, etc.) |
| **Axios** | 1+ | Appels HTTP vers l'API FastAPI |
| **React Hook Form** | 7+ | Gestion des formulaires (demande de lâcher, login) |

### Installation rapide

```bash
cd frontend/

# Initialiser le projet (première fois seulement)
npm create vite@latest . --template react-ts
npm install

# Installer les dépendances du projet
npm install tailwindcss @tailwindcss/vite
npm install recharts leaflet react-leaflet @types/leaflet
npm install react-router-dom axios react-hook-form
npm install lucide-react             # Icônes modernes

# Lancer le serveur de développement
npm run dev
```

> 🌐 Le frontend sera accessible sur `http://localhost:5173`

---

## 📂 Structure des Dossiers

```
frontend/
├── README.md              ← CE FICHIER
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── index.html
│
├── public/                ← Fichiers statiques (favicon, etc.)
│
└── src/
    ├── App.tsx            ← Composant racine + Router
    ├── main.tsx           ← Point d'entrée React
    │
    ├── components/        ← 🧩 Composants réutilisables
    │   ├── Sidebar.tsx    ← Menu latéral
    │   ├── AlertBanner.tsx ← Bandeau d'alerte critique
    │   ├── WaterLevelChart.tsx  ← Graphique Recharts
    │   └── CooperativeMap.tsx   ← Carte Leaflet
    │
    ├── pages/             ← 📄 Pages de l'app
    │   ├── LoginPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── ReleasesPage.tsx    ← Formulaire de lâcher
    │   └── AlertsPage.tsx
    │
    ├── hooks/             ← 🪝 Custom Hooks
    │   ├── useAuth.ts     ← Gestion token JWT
    │   └── useDashboard.ts ← Fetch données dashboard
    │
    ├── services/          ← 📡 Appels API
    │   ├── api.ts         ← Axios instance (baseURL + token)
    │   ├── authService.ts ← login(), register()
    │   └── releaseService.ts ← getReleases(), createRelease()
    │
    ├── types/             ← 📐 Types TypeScript
    │   ├── User.ts
    │   ├── WaterRelease.ts
    │   └── Alert.ts
    │
    └── assets/            ← 🖼️ Images, icônes
```

---

## 🎨 Conseils Design

Pour obtenir un **dashboard professionnel et clean** :

1. **TailwindCSS** — Utilisez les classes utilitaires pour un design responsive sans écrire de CSS custom.
2. **Shadcn/UI** — Composants pré-faits professionnels (DataTable, Dialog, Card, Button).
3. **Dark Mode** — Ajoutez un toggle dark/light mode avec TailwindCSS (`dark:bg-gray-900`).
4. **Recharts** — Graphiques lisses pour le niveau du barrage (LineChart, AreaChart, BarChart).
5. **Couleurs suggérées** :
   - 🔵 Bleu eau : `#0EA5E9` — couleur principale
   - 🔴 Rouge alerte : `#EF4444` — alertes critiques
   - 🟢 Vert OK : `#22C55E` — statuts validés
   - 🟡 Jaune warning : `#F59E0B` — seuils proches

---

## 🚨 Règles pour l'Équipe

1. **Ne touchez JAMAIS** aux dossiers `database/`, `security/`, ou `quality/`.
2. **Créez des petites branches** : `feat/frontend-login`, `feat/frontend-dashboard`, `feat/frontend-releases`.
3. **Un composant = un fichier** : Ne mettez pas tout dans `App.tsx`.
4. **TypeScript strict** : Pas de `any` — typer toutes les props et réponses API.
5. **Responsive** : Le dashboard doit fonctionner sur mobile ET desktop.
