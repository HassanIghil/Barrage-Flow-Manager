# 🔴 Guide Red Team (Attaque) — Pour Débutants

> **Équipe Red Team :** HARBECH M., HARBOUS Moncif
> **Branche GitHub :** `security/red-team-audit`
> **Dossier de travail :** `security/red-team/`

Bienvenue dans la Red Team ! Votre rôle est de **jouer les hackers** et d'essayer de pirater l'application pour trouver ses failles de sécurité.

---

## 🤔 C'est quoi la Red Team ?

La Red Team simule des **attaques informatiques** pour trouver les vulnérabilités avant qu'un vrai hacker ne les trouve. Vous êtes les "méchants" du projet (mais pour la bonne cause !).

Votre mission :
1. **Attaquer l'API** pour trouver des failles
2. **Documenter chaque faille** dans un rapport
3. **Transmettre vos résultats** à la Blue Team pour qu'elle corrige

---

## 🛠️ Outils à Utiliser

| Outil | Rôle | Installation |
|-------|------|-------------|
| **Postman** | Envoyer des requêtes HTTP à l'API | [postman.com](https://www.postman.com/downloads/) |
| **curl** | Requêtes en ligne de commande | Déjà installé (Git Bash / terminal) |
| **Burp Suite Community** | Intercepter et modifier les requêtes | [portswigger.net](https://portswigger.net/burp/communitydownload) |
| **DevTools (F12)** | Inspecter les requêtes du navigateur | Inclus dans Chrome/Firefox |

---

## 📋 Attaques à Tester — Étape par Étape

### 🔓 Attaque 1 : Injection SQL

**Objectif :** Injecter du code SQL dans les champs de l'API pour accéder aux données.

1. Ouvrez Postman
2. Envoyez cette requête :

```
POST http://localhost:8000/api/auth/login
Body (JSON) :
{
    "email": "admin@barrage.ma' OR '1'='1",
    "password": "nimportequoi"
}
```

3. **Si ça fonctionne** → FAILLE CRITIQUE ! L'API ne filtre pas les entrées.
4. **Si ça échoue** (erreur 401/422) → L'API est protégée. Documentez-le quand même.

Autres tests SQLi :
```
email: "'; DROP TABLE utilisateur; --"
email: "admin@barrage.ma' UNION SELECT * FROM utilisateur --"
volume_m3: "0; DELETE FROM lacher_eau"
```

---

### 🔑 Attaque 2 : Bypass d'Authentification JWT

**Objectif :** Accéder aux routes protégées sans token valide.

1. **Sans token** :
```bash
curl http://localhost:8000/api/dashboard/overview
# → Doit retourner 401 Unauthorized
```

2. **Avec un faux token** :
```bash
curl -H "Authorization: Bearer faux.token.ici" http://localhost:8000/api/dashboard/overview
# → Doit retourner 401
```

3. **Avec un token expiré** (modifiez manuellement l'expiration) :
```bash
# Prenez un vrai token, décodez-le sur jwt.io, changez l'expiration, ré-encodez
curl -H "Authorization: Bearer TOKEN_MODIFIE" http://localhost:8000/api/dashboard/overview
# → Doit retourner 401
```

---

### 👑 Attaque 3 : Escalade de Privilèges RBAC

**Objectif :** Un Ingénieur ne doit PAS pouvoir faire les actions du Directeur.

1. **Connectez-vous en tant qu'Ingénieur** :
```
POST /api/auth/login
{
    "email": "ingenieur@barrage.ma",
    "password": "MotDePasse123"
}
→ Récupérez le token
```

2. **Essayez de forcer un lâcher d'eau** (action réservée au Directeur) :
```
POST /api/releases/force
Headers: Authorization: Bearer <token-ingenieur>
{
    "volume_m3": 10000,
    "id_barrage": 1,
    "raison": "test hacking"
}
```

3. **Si ça fonctionne** → FAILLE CRITIQUE ! Le RBAC ne vérifie pas le rôle.
4. **Si ça échoue** (403 Forbidden) → Le RBAC fonctionne correctement.

---

### 📊 Attaque 4 : Données Invalides

Envoyez des données aberrantes pour tester la validation :

```json
{ "volume_m3": -5000 }        // Volume négatif
{ "volume_m3": 999999999 }    // Volume impossible
{ "volume_m3": "texte" }      // Type invalide
{ "email": "" }                // Champ vide
{ "email": "pas-un-email" }   // Format invalide
```

---

## 📝 Comment Écrire le Rapport d'Attaque

Créez le fichier `security/red-team/rapport_pre_fix.md` :

```markdown
# 🔴 Rapport Red Team — Audit de Sécurité Pre-Fix

**Date :** [DATE]
**Testeurs :** HARBECH M., HARBOUS Moncif
**Application :** Barrage-Flow Manager API (FastAPI)

## Résumé

| Faille | Gravité | Statut |
|--------|---------|--------|
| Injection SQL sur /login | 🔴 Critique / 🟡 Moyen / 🟢 Aucune | Trouvée / Non trouvée |
| Bypass JWT | 🔴 / 🟡 / 🟢 | |
| Escalade RBAC | 🔴 / 🟡 / 🟢 | |
| Données invalides acceptées | 🔴 / 🟡 / 🟢 | |

## Détails

### Faille 1 : [Nom de la faille]
- **Route testée :** POST /api/auth/login
- **Payload :** `{"email": "admin' OR '1'='1"}`
- **Résultat :** [Ce qui s'est passé]
- **Preuve :** [Capture d'écran ou copie de la réponse]
- **Recommandation :** Utiliser des requêtes paramétrées
```

---

## 🚨 Règles pour la Red Team

1. **Travaillez UNIQUEMENT** dans `security/red-team/`.
2. **Ne cassez JAMAIS** la base de données en production — testez en local avec Docker.
3. **Documentez TOUT** : même les attaques qui échouent (ça prouve que la défense marche).
4. **Partagez vos résultats** avec la Blue Team sur `#barrage-security` pour qu'elle corrige.
