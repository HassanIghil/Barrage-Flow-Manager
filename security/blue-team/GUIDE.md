# 🔵 Guide Blue Team (Défense) — Pour Débutants

> **Équipe Blue Team :** HRIMICH Reda, IGHRANE Imane
> **Branche GitHub :** `security/blue-team-defense`
> **Dossier de travail :** `security/blue-team/`

Bienvenue dans la Blue Team ! Votre rôle est de **défendre l'application** contre les attaques trouvées par la Red Team, et de mettre en place des protections proactives.

---

## 🤔 C'est quoi la Blue Team ?

La Blue Team est responsable de la **sécurité défensive** : protéger l'application, corriger les failles trouvées, et s'assurer que le système est robuste contre les attaques.

Votre mission :
1. **Mettre en place des défenses** proactives (avant les attaques)
2. **Recevoir les rapports de la Red Team** et corriger les failles
3. **Documenter les corrections** dans un rapport post-fix

---

## 🛠️ Outils à Utiliser

| Outil | Rôle | Lien |
|-------|------|------|
| **Postman** | Tester que les corrections fonctionnent | [postman.com](https://www.postman.com/downloads/) |
| **MySQL Workbench** | Vérifier les permissions en base | [mysql.com](https://dev.mysql.com/downloads/workbench/) |
| **VS Code** | Lire et comprendre le code backend | [code.visualstudio.com](https://code.visualstudio.com) |
| **OWASP Top 10** | Référence des 10 vulnérabilités web les plus courantes | [owasp.org](https://owasp.org/www-project-top-ten/) |

---

## 📋 Défenses à Mettre en Place — Étape par Étape

### 🛡️ Défense 1 : Protection contre l'Injection SQL

**Problème :** Si l'API construit des requêtes SQL avec des strings concaténées, un hacker peut injecter du code.

**Solution :** Vérifier que l'équipe backend utilise des **requêtes paramétrées** (via SQLAlchemy).

```python
# ❌ MAUVAIS — Vulnérable à l'injection SQL
query = f"SELECT * FROM utilisateur WHERE email = '{email}'"

# ✅ BON — Requête paramétrée avec SQLAlchemy
user = db.query(User).filter(User.email == email).first()
```

**Votre action :**
- [ ] Lire le code dans `backend/app/routes/` et vérifier qu'aucune requête SQL n'est construite avec des f-strings
- [ ] Si vous trouvez une requête vulnérable, signalez-la sur `#barrage-security`

---

### 🛡️ Défense 2 : Validation des Données (Pydantic)

**Problème :** L'API doit rejeter les données invalides (volume négatif, email mal formaté...).

**Solution :** Vérifier que les schémas Pydantic ont des **validateurs** :

```python
# ✅ BON — Pydantic valide les données automatiquement
from pydantic import BaseModel, Field, EmailStr

class ReleaseRequest(BaseModel):
    volume_m3: float = Field(..., gt=0, description="Volume en m³, doit être positif")
    id_barrage: int = Field(..., gt=0)

class UserLogin(BaseModel):
    email: EmailStr           # Vérifie le format email automatiquement
    password: str = Field(..., min_length=8)
```

**Votre action :**
- [ ] Vérifier dans `backend/app/schemas/` que les contraintes sont présentes (`gt=0`, `min_length`, `EmailStr`)
- [ ] Tester avec Postman : envoyer `{"volume_m3": -100}` doit retourner une erreur 422

---

### 🛡️ Défense 3 : CORS (Cross-Origin Resource Sharing)

**Problème :** Sans configuration CORS, n'importe quel site web pourrait appeler votre API.

**Solution :** Vérifier que le `main.py` du backend configure CORS correctement :

```python
# ✅ BON — Autoriser uniquement le frontend React
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend uniquement
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

**Votre action :**
- [ ] Vérifier dans `backend/app/main.py` que CORS est configuré
- [ ] S'assurer que `allow_origins` ne contient PAS `"*"` (ça autoriserait tout le monde)

---

### 🛡️ Défense 4 : RBAC (Contrôle d'Accès par Rôle)

**Problème :** Un Ingénieur ne doit PAS pouvoir accéder aux routes du Directeur.

**Solution :** Vérifier que le middleware RBAC protège les routes sensibles :

```python
# ✅ BON — Seul le Directeur peut forcer un lâcher
@router.post("/releases/force")
async def force_release(
    request: ReleaseRequest,
    current_user: User = Depends(get_current_user)  # Vérifie le JWT
):
    if current_user.role != "directeur":
        raise HTTPException(status_code=403, detail="Accès réservé au Directeur")
    # ... logique
```

**Votre action :**
- [ ] Vérifier chaque route dans `backend/app/routes/` pour confirmer que les rôles sont vérifiés
- [ ] Tester avec un token d'Ingénieur sur les routes du Directeur

---

### 🛡️ Défense 5 : Rate Limiting (Optionnel mais recommandé)

**Problème :** Un hacker peut bombarder l'API de requêtes (brute-force sur le login).

**Solution :** Limiter le nombre de requêtes par minute :

```python
# Avec slowapi
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/auth/login")
@limiter.limit("5/minute")  # Max 5 tentatives de login par minute
async def login(request: Request, ...):
```

---

## 📝 Comment Écrire le Rapport Post-Fix

Après avoir reçu le rapport de la Red Team, créez le fichier `security/blue-team/rapport_post_fix.md` :

```markdown
# 🔵 Rapport Blue Team — Corrections Post-Fix

**Date :** [DATE]
**Défenseurs :** HRIMICH Reda, IGHRANE Imane

## Résumé des Corrections

| Faille (Red Team) | Correction Appliquée | Vérifié |
|--------------------|-----------------------|---------|
| Injection SQL sur /login | SQLAlchemy ORM utilisé, pas de SQL brut | ✅ / ❌ |
| Bypass JWT | Token vérifié sur chaque route protégée | ✅ / ❌ |
| Escalade RBAC | Rôle vérifié dans le middleware | ✅ / ❌ |
| Volume négatif accepté | Pydantic Field(gt=0) ajouté | ✅ / ❌ |

## Détails

### Correction 1 : [Nom]
- **Faille originale :** [Description de la Red Team]
- **Fichier modifié :** `backend/app/routes/auth.py`
- **Avant :** [Code vulnérable]
- **Après :** [Code corrigé]
- **Test de vérification :** [Requête Postman qui prouve que c'est corrigé]
```

---

## 🚨 Règles pour la Blue Team

1. **Travaillez UNIQUEMENT** dans `security/blue-team/` pour vos rapports.
2. **Si vous devez corriger du code** dans `backend/`, faites-le sur la branche `security/blue-team-defense` et ouvrez une PR.
3. **Testez chaque correction** avec Postman avant de dire que la faille est corrigée.
4. **Communiquez** vos corrections sur `#barrage-security`.
