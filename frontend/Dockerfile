# Étape 1 : Build de l'application
FROM node:20-alpine AS build

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copie du code et build
COPY . .
RUN npm run build

# Étape 2 : Service avec Node.js (package 'serve')
FROM node:20-alpine

WORKDIR /app

# Installation globale du serveur 'serve'
RUN npm install -g serve

# Copie des fichiers compilés depuis l'étape de build
COPY --from=build /app/dist ./dist

# Exposition du port 5173 (votre port habituel)
EXPOSE 5173

# Lancement du serveur en mode SPA (-s) sur le port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
