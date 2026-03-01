# 🐳 Guide Docker — Barrage-Flow Manager

> Ce guide explique comment lancer le projet complet (Backend + Base de données + Frontend) avec Docker.

---

## 📦 Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé sur votre machine
- [Docker Compose](https://docs.docker.com/compose/) (inclus avec Docker Desktop)

---

## 🚀 Lancer le Projet

### Tout lancer en une seule commande

```bash
# Depuis la racine du projet
docker-compose up -d
```

Cela va :
1. ✅ Démarrer **MySQL** sur le port `3306`
2. ✅ Démarrer le **Backend FastAPI** sur le port `8000`
3. ✅ Démarrer le **Frontend React** sur le port `5173`

### Vérifier que tout tourne

```bash
docker-compose ps
```

Résultat attendu :
```
NAME                    STATUS
barrage-db              running (port 3306)
barrage-api             running (port 8000)
barrage-frontend        running (port 5173)
```

---

## 📝 Le fichier `docker-compose.yml`

Voici le fichier Docker Compose à placer **à la racine** du projet :

```yaml
version: '3.8'

services:
  # ---- Base de données MySQL ----
  db:
    image: mysql:8.0
    container_name: barrage-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: barrage_flow_db
      MYSQL_USER: barrage_user
      MYSQL_PASSWORD: barrage_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/sql:/docker-entrypoint-initdb.d  # Auto-exécute les scripts SQL
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ---- phpMyAdmin (interface web pour MySQL) ----
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: barrage-phpmyadmin
    restart: always
    environment:
      PMA_HOST: db
      PMA_USER: root
      PMA_PASSWORD: rootpassword
    ports:
      - "8080:80"
    depends_on:
      - db

  # ---- Backend FastAPI ----
  api:
    build: ./backend
    container_name: barrage-api
    restart: always
    environment:
      DATABASE_URL: mysql+pymysql://barrage_user:barrage_pass@db:3306/barrage_flow_db
      SECRET_KEY: your-secret-key-change-in-production
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./backend:/app  # Hot reload

  # ---- Frontend React ----
  frontend:
    build: ./frontend
    container_name: barrage-frontend
    restart: always
    ports:
      - "5173:5173"
    depends_on:
      - api
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  mysql_data:
```

---

## 💡 Commandes Utiles

| Commande | Action |
|----------|--------|
| `docker-compose up -d` | Lancer tous les services en arrière-plan |
| `docker-compose down` | Arrêter tous les services |
| `docker-compose logs api` | Voir les logs du backend |
| `docker-compose logs db` | Voir les logs MySQL |
| `docker-compose exec db mysql -u root -p` | Se connecter à MySQL en CLI |
| `docker-compose down -v` | ⚠️ Tout supprimer (y compris les données) |

### Accéder aux services

| Service | URL |
|---------|-----|
| Frontend React | `http://localhost:5173` |
| API FastAPI (Swagger) | `http://localhost:8000/docs` |
| phpMyAdmin | `http://localhost:8080` |
| MySQL (direct) | `localhost:3306` |

---

## 🔧 Sans Docker (développement local)

Si vous préférez lancer les services sans Docker :

### MySQL
```bash
# Installer MySQL localement puis :
mysql -u root -p
CREATE DATABASE barrage_flow_db;
SOURCE database/sql/01_schema.sql;
```

### Backend
```bash
cd backend/
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend/
npm install
npm run dev
```
