# 🛠️ Référence Outils — Barrage-Flow Manager

> Liste complète de tous les outils, librairies et services utilisés dans le projet.

---

## 🖥️ Backend (Python / FastAPI)

| Outil | Rôle | Documentation |
|-------|------|---------------|
| Python 3.12 | Langage principal | [python.org](https://python.org) |
| FastAPI | Framework API REST async | [fastapi.tiangolo.com](https://fastapi.tiangolo.com) |
| Uvicorn | Serveur ASGI | [uvicorn.org](https://www.uvicorn.org) |
| SQLAlchemy | ORM (modèles de tables) | [sqlalchemy.org](https://www.sqlalchemy.org) |
| Pydantic + pydantic-settings | Validation des données + configuration .env | [docs.pydantic.dev](https://docs.pydantic.dev) |
| PyJWT | Génération et vérification des tokens JWT | [pypi.org/project/PyJWT](https://pypi.org/project/PyJWT/) |
| bcrypt | Hashing sécurisé des mots de passe (OWASP) | [pypi.org/project/bcrypt](https://pypi.org/project/bcrypt/) |
| PyMySQL | Connecteur MySQL natif pour Python | [pypi.org/project/PyMySQL](https://pypi.org/project/PyMySQL/) |
| cryptography | Opérations cryptographiques bas niveau | [pypi.org/project/cryptography](https://pypi.org/project/cryptography/) |
| email-validator | Validation des adresses email | [pypi.org/project/email-validator](https://pypi.org/project/email-validator/) |

---

## ⚛️ Frontend (React / Vite / JavaScript JSX)

| Outil | Rôle | Documentation |
|-------|------|---------------|
| React 18 | Librairie UI (composants JSX) | [react.dev](https://react.dev) |
| Vite 8 | Build tool ultra-rapide avec HMR | [vite.dev](https://vite.dev) |
| TailwindCSS 3.4 | Framework CSS utility-first | [tailwindcss.com](https://tailwindcss.com) |
| Recharts 2.12 | Graphiques interactifs (niveau eau, stats) | [recharts.org](https://recharts.org) |
| Chart.js 4.5 + react-chartjs-2 | Graphiques complémentaires | [chartjs.org](https://www.chartjs.org) |
| Leaflet 1.9 + React-Leaflet 4.2 | Carte interactive des coopératives | [leafletjs.com](https://leafletjs.com) |
| React Router DOM 6 | Navigation SPA | [reactrouter.com](https://reactrouter.com) |
| Axios | Client HTTP (installé, utilisé dans certaines pages) | [axios-http.com](https://axios-http.com) |
| fetch natif (api.js) | Client HTTP principal (zéro dépendance) | MDN Web API |
| Lucide React | Icônes SVG modernes | [lucide.dev](https://lucide.dev) |
| PostCSS + Autoprefixer | Traitement CSS + compatibilité navigateurs | [postcss.org](https://postcss.org) |

---

## 🗄️ Base de Données

| Outil | Rôle | Documentation |
|-------|------|---------------|
| MySQL 8.0 | SGBD relationnel | [dev.mysql.com](https://dev.mysql.com/doc/) |
| MySQL Workbench | GUI pour MySQL | [mysql.com/workbench](https://dev.mysql.com/downloads/workbench/) |
| phpMyAdmin | Interface web MySQL | [phpmyadmin.net](https://www.phpmyadmin.net) |

---

## 📐 Conception (Architects)

| Outil | Rôle | Documentation |
|-------|------|---------------|
| Draw.io (diagrams.net) | MCD, MLD, MPD | [app.diagrams.net](https://app.diagrams.net) |
| Looping | Alternative MERISE | [looping-mcd.fr](https://www.looping-mcd.fr) |


---

## 🐳 DevOps / Environnement

| Outil | Rôle | Documentation |
|-------|------|---------------|
| Docker | Containerisation | [docker.com](https://www.docker.com) |
| Docker Compose | Orchestration multi-containers | [docs.docker.com/compose](https://docs.docker.com/compose/) |
| Git | Versioning | [git-scm.com](https://git-scm.com) |
| GitHub | Hébergement du code, PRs | [github.com](https://github.com) |

---

## 🛡️ Sécurité (Red Team / Blue Team)

| Outil | Rôle | Documentation |
|-------|------|---------------|
| Postman | Test d'API (requêtes manuelles) | [postman.com](https://www.postman.com) |
| curl | Requêtes HTTP en CLI | [curl.se](https://curl.se) |
| Burp Suite (Community) | Proxy d'interception HTTP | [portswigger.net](https://portswigger.net/burp) |
| OWASP ZAP | Scanner de vulnérabilités | [zaproxy.org](https://www.zaproxy.org) |

---

## 💬 Communication

| Outil | Rôle |
|-------|------|
| Slack | Communication d'équipe |
| GitHub Issues | Suivi des tâches et bugs |
| GitHub Projects | Tableau Kanban |
