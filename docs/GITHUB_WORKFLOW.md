# 🌿 Guide GitHub Workflow — Barrage-Flow Manager

> Ce guide explique comment utiliser Git et GitHub pour que le **PM (Hassan)** puisse merger sans conflits. Chaque équipe travaille dans sa propre branche et ses propres dossiers.

---

## 🏗️ Architecture des Branches

```
main                              ← Code stable, prêt pour la soutenance
├── develop                       ← Branche d'intégration
│   ├── feat/database-architects  ← Architects UNIQUEMENT
│   ├── feat/backend-api          ← Augmenteds — Backend
│   ├── feat/frontend-dashboard   ← Augmenteds — Frontend
│   ├── security/red-team-audit   ← Red Team UNIQUEMENT
│   ├── security/blue-team-defense ← Blue Team UNIQUEMENT
│   └── quality/tests             ← QA UNIQUEMENT
```

---

## 📋 Règle Anti-Conflit : Qui Touche à Quoi

| Équipe | Dossiers autorisés | Branche |
|--------|--------------------|---------|
| **Architects** | `database/conception/`, `database/sql/` | `feat/database-architects` |
| **Augmenteds (Backend)** | `backend/` | `feat/backend-api` |
| **Augmenteds (Frontend)** | `frontend/` | `feat/frontend-dashboard` |
| **Red Team** | `security/red-team/` | `security/red-team-audit` |
| **Blue Team** | `security/blue-team/` | `security/blue-team-defense` |
| **QA** | `quality/` | `quality/tests` |

> ⚠️ **Ne touchez JAMAIS** au dossier d'une autre équipe. C'est la règle n°1 pour zéro conflit.

---

## 🚀 Workflow Quotidien (pour chaque membre)

### 1. Créer sa branche la première fois

```bash
# Cloner le repo
git clone https://github.com/VOTRE-ORG/barrage-flow-manager.git
cd barrage-flow-manager

# Se placer sur develop
git checkout develop

# Créer sa branche d'équipe
git checkout -b feat/database-architects    # Exemple pour Architects
```

### 2. Travailler et commiter

```bash
# Vérifier son statut
git status

# Ajouter ses fichiers modifiés
git add database/conception/MCD_v1.png
git add database/sql/01_schema.sql

# Faire un commit clair
git commit -m "feat: ajouter le MCD v1 avec 7 entités"

# Pousser vers GitHub
git push origin feat/database-architects
```

### 3. Ouvrir une Pull Request (PR)

1. Aller sur GitHub → votre repo
2. Cliquer sur **"Compare & pull request"**
3. Base : `develop` ← Compare : `feat/database-architects`
4. Titre clair : `feat: MCD + MLD conception complète`
5. Description : ce que vous avez fait et pourquoi
6. Demander une review à **Hassan (PM)**

---

## 📝 Conventions de Commit

Utilisez ce format pour que l'historique soit lisible :

```
type: description courte en français
```

| Type | Quand l'utiliser | Exemple |
|------|-----------------|---------|
| `feat` | Nouvelle fonctionnalité | `feat: ajouter le trigger de blocage sécurité` |
| `fix` | Correction de bug | `fix: corriger le calcul de répartition en m³` |
| `docs` | Documentation | `docs: ajouter le MCD v1 dans conception/` |
| `test` | Tests | `test: ajouter test de conversion m³/litres` |
| `security` | Sécurité | `security: paramétrer les requêtes SQL` |
| `refactor` | Refactoring | `refactor: restructurer les routes API` |

---

## 🔀 Guide du PM (Hassan) — Comment Merger

### Quand une PR arrive :

1. **Vérifier** que la PR ne touche QUE les dossiers autorisés de l'équipe
2. **Lire les fichiers** changés (onglet "Files Changed" sur GitHub)
3. **Approuver** ou **demander des corrections** via les commentaires
4. **Merger** dans `develop` (bouton "Merge pull request")
5. **Ne merger dans `main`** qu'en fin de sprint, avec tout testé

### Commandes utiles pour le PM :

```bash
# Récupérer les dernières modifications de tout le monde
git checkout develop
git pull origin develop

# Vérifier qu'il n'y a pas de conflit avant de merger
git merge --no-commit --no-ff feat/database-architects
# Si tout va bien :
git merge --abort    # Annuler le test
# Puis merger via GitHub PR pour garder l'historique propre
```

---

## ⚠️ En Cas de Conflit

Si Git détecte un conflit :

1. **Ne paniquez pas** — c'est qu'un fichier a été modifié par 2 personnes
2. **Identifiez** le fichier en conflit (Git vous le dit)
3. **Regardez** si c'est un fichier qui devait être touché uniquement par votre équipe
4. **Prévenez Hassan** sur `#barrage-general` — c'est le PM qui résout les conflits

```bash
# Voir les fichiers en conflit
git status

# Après résolution manuelle
git add <fichier_résolu>
git commit -m "fix: résoudre conflit dans schema.sql"
```
