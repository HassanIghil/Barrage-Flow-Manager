# 🗄️ Database — Conception & Scripts SQL

> **Équipe responsable :** Architects (Hassan IGHIL, Yassin IFQUIRNE, Abir ID BOULAID)
> **Branche GitHub :** `feat/database-architects`

Ce dossier contient **toute la partie Base de Données** du projet : la conception MERISE et les scripts SQL.

---

## 📂 Structure

```
database/
├── README.md                      ← CE FICHIER
│
├── conception/                    ← 🎨 Travail MERISE (MCD, MLD, MPD, UML)
│   ├── TASKS_HASSAN.md            ← Tâches de Hassan
│   ├── TASKS_YASSIN.md            ← Tâches de Yassin
│   ├── TASKS_ABIR.md              ← Tâches de Abir
│   └── (vos diagrammes ici : .png, .pdf, .drawio)
│
└── sql/                           ← 💾 Scripts SQL (MySQL)
    ├── 01_schema.sql              ← CREATE TABLE, types, contraintes
    ├── 02_triggers.sql            ← Triggers (blocage sécurité, audit)
    ├── 03_procedures.sql          ← Procédures stockées (répartition eau)
    ├── 04_rbac.sql                ← Rôles et permissions
    └── 05_seed.sql                ← Données de test réalistes
```

---

## ⚙️ Outils de Conception

| Outil | Utilisation | Lien |
|-------|-------------|------|
| **Draw.io (diagrams.net)** | MCD, MLD, MPD, Diagrammes UML | [app.diagrams.net](https://app.diagrams.net) |
| **Looping** | Alternative pour MCD/MLD (MERISE) | [looping-mcd.fr](https://www.looping-mcd.fr) |
| **MySQL Workbench** | Écriture et test des scripts SQL | [mysql.com/workbench](https://dev.mysql.com/downloads/workbench/) |
| **phpMyAdmin** | Interface web pour gérer MySQL (via Docker) | Inclus dans Docker |
| **StarUML** ou **PlantUML** | Diagrammes UML (Cas d'utilisation, Séquence) | [staruml.io](https://staruml.io) |

---

## 🔧 Base de Données : MySQL

> Le projet utilise **MySQL** comme système de gestion de base de données.

### Lancer MySQL avec Docker (le plus simple)

```bash
# Depuis la racine du projet
docker-compose up -d db
```

### Se connecter à MySQL

```bash
# Via la ligne de commande
mysql -u root -p barrage_flow_db

# Ou via MySQL Workbench : host=localhost, port=3306, user=root
```

---

## 📐 Méthodologie MERISE — Rappel

La conception se fait en **4 étapes dans l'ordre** :

| Étape | Modèle | Description |
|-------|--------|-------------|
| 1️⃣ | **MCD** (Modèle Conceptuel de Données) | Entités, associations, cardinalités |
| 2️⃣ | **MLD** (Modèle Logique de Données) | Traduction en tables relationnelles |
| 3️⃣ | **MPD** (Modèle Physique de Données) | Adaptation pour MySQL (types, index) |
| 4️⃣ | **Scripts SQL** | CREATE TABLE, Triggers, Procédures |

> **UML** peut être utilisé en complément pour les diagrammes de Cas d'Utilisation et de Séquence (le « métier » du projet).

---

## 🚨 Règles pour l'Équipe Architects

1. **Travaillez UNIQUEMENT** dans `database/conception/` et `database/sql/`.
2. **Chaque membre** a son fichier de tâches : `TASKS_HASSAN.md`, `TASKS_YASSIN.md`, `TASKS_ABIR.md`.
3. **Exportez vos diagrammes** en `.png` ou `.pdf` dans `database/conception/`.
4. **Nommez vos fichiers clairement** : `MCD_v1.png`, `MLD_final.pdf`, etc.
5. **Prévenez sur Slack** (`#barrage-architects`) quand un livrable est prêt.
