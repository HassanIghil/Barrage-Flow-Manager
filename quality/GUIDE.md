# 🧪 Guide QA (Quality Assurance) — Pour Débutants

> **Équipe QA :** ISKANDER El Mahdi, JAIT Reda
> **Branche GitHub :** `quality/tests`
> **Dossier de travail :** `quality/`

Bienvenue dans l'équipe QA ! C'est peut-être votre première expérience en Quality Assurance. Ce guide vous explique **étape par étape** ce que vous devez faire.

---

## 🤔 C'est quoi la QA ?

La QA (Quality Assurance) consiste à **vérifier que l'application fonctionne correctement** avant de la livrer. Vous êtes les derniers remparts avant la soutenance.

Votre mission :
1. **Tester l'application** comme si vous étiez un utilisateur réel
2. **Trouver des bugs** et les documenter
3. **Comparer** le SQL écrit manuellement (Architects) vs. celui généré par IA (Augmenteds)

---

## 🛠️ Outils à Utiliser

| Outil | Quand l'utiliser | Lien |
|-------|------------------|------|
| **Postman** | Tester les routes de l'API (sans le frontend) | [postman.com](https://www.postman.com/downloads/) |
| **Navigateur** (Chrome/Firefox) | Tester l'interface React | — |
| **DevTools** (F12 dans le navigateur) | Voir les erreurs JavaScript et les requêtes réseau | — |
| **MySQL Workbench** | Vérifier les données en base | [mysql.com](https://dev.mysql.com/downloads/workbench/) |

---

## 📋 Tâches Étape par Étape

### Étape 1 : Installer et Lancer le Projet (Semaine 3+)

```bash
# Cloner le repo
git clone https://github.com/VOTRE-ORG/barrage-flow-manager.git
cd barrage-flow-manager

# Lancer avec Docker
docker-compose up -d

# Ou lancer manuellement (voir docs/DOCKER_GUIDE.md)
```

Vérifiez que ces URLs fonctionnent :
- ✅ Frontend : `http://localhost:5173`
- ✅ API Swagger : `http://localhost:8000/docs`
- ✅ phpMyAdmin : `http://localhost:8080`

---

### Étape 2 : Tester les Fonctionnalités Critiques

Créez un fichier `quality/test_report.md` avec ce template :

```markdown
# Rapport de Tests QA

| # | Test | Résultat | Commentaire |
|---|------|----------|-------------|
| 1 | Login avec bon mot de passe | ✅ / ❌ | |
| 2 | Login avec mauvais mot de passe | ✅ / ❌ | Doit afficher une erreur |
| 3 | Accéder au dashboard sans être connecté | ✅ / ❌ | Doit rediriger vers login |
| 4 | Demander un lâcher d'eau (role Ingénieur) | ✅ / ❌ | |
| 5 | Forcer un lâcher (role Ingénieur) | ✅ / ❌ | DOIT être refusé (seul le Directeur peut) |
| 6 | Forcer un lâcher (role Directeur) | ✅ / ❌ | |
| 7 | Lâcher qui descend sous le seuil de sécurité | ✅ / ❌ | DOIT être bloqué par le trigger |
| 8 | Conversion m³ → litres sur le dashboard | ✅ / ❌ | 1 m³ = 1000 litres, vérifier le calcul |
| 9 | Graphique du niveau d'eau | ✅ / ❌ | Les données doivent être cohérentes |
| 10 | Carte des coopératives | ✅ / ❌ | Les marqueurs doivent apparaître |
```

---

### Étape 3 : Comparer SQL Architects vs Augmenteds

C'est la tâche **la plus importante pour la soutenance**. Comparez les deux approches :

Créez le fichier `quality/comparaison_sql.md` :

```markdown
# Comparaison : SQL Manuel (Architects) vs SQL IA (Augmenteds)

## 1. Structure des Tables
| Critère | Architects | Augmenteds | Meilleur |
|---------|-----------|-----------|----------|
| Types de données cohérents | Oui/Non | Oui/Non | |
| Clés étrangères bien définies | Oui/Non | Oui/Non | |
| Contraintes CHECK présentes | Oui/Non | Oui/Non | |
| Nommage clair des tables/colonnes | Oui/Non | Oui/Non | |

## 2. Triggers
| Critère | Architects | Augmenteds | Meilleur |
|---------|-----------|-----------|----------|
| Trigger de blocage de sécurité | Oui/Non | Oui/Non | |
| Trigger d'audit (log des actions) | Oui/Non | Oui/Non | |
| Gestion d'erreurs (SIGNAL) | Oui/Non | Oui/Non | |

## 3. Temps Passé
| Équipe | Temps estimé | Commentaire |
|--------|-------------|-------------|
| Architects (manuel) | X heures | |
| Augmenteds (IA) | X heures | |

## Conclusion
(Qui a fait le meilleur SQL et pourquoi ?)
```

---

### Étape 4 : Tester avec Postman

1. **Ouvrez Postman** ([téléchargez ici](https://www.postman.com/downloads/))
2. **Créez une nouvelle Collection** nommée "Barrage-Flow Tests"
3. **Ajoutez ces requêtes** :

```
POST http://localhost:8000/api/auth/login
Body (JSON) :
{
    "email": "directeur@barrage.ma",
    "password": "MotDePasse123"
}
→ Copiez le token JWT de la réponse

GET http://localhost:8000/api/dashboard/overview
Headers : Authorization: Bearer <votre-token>
→ Doit retourner les données du dashboard

POST http://localhost:8000/api/releases
Headers : Authorization: Bearer <token-ingenieur>
Body (JSON) :
{
    "volume_m3": 5000,
    "id_barrage": 1
}
→ Doit fonctionner si seuil OK, sinon erreur
```

---

## 🚨 Règles pour l'Équipe QA

1. **Travaillez UNIQUEMENT** dans le dossier `quality/`.
2. **Ne modifiez JAMAIS** le code de l'API ou du Frontend — signalez les bugs sur Slack.
3. **Documentez TOUT** : chaque test passé ou échoué, avec des captures d'écran si possible.
4. **Communiquez** vos résultats sur `#barrage-qa` et `#barrage-general`.
