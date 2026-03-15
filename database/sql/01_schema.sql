-- ============================================================
-- BARRAGE-FLOW MANAGER — Schema SQL (MySQL 8.0)
-- Fichier : 01_schema.sql
-- Auteur  : Hassan IGHIL
-- ============================================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS barrage_flow_manager
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE barrage_flow_manager;

-- ============================================================ 
-- TABLE 1 : utilisateur
-- Utilisateurs du système (Directeur, Ingénieur, Opérateur)
-- ============================================================
CREATE TABLE utilisateur (
  id_user        INT           NOT NULL AUTO_INCREMENT,
  nom            VARCHAR(100)  NOT NULL,
  prenom         VARCHAR(100)  NOT NULL,
  email          VARCHAR(255)  NOT NULL,
  password       VARCHAR(255)  NOT NULL,
  role           VARCHAR(20)   NOT NULL,
  date_creation  DATE          NOT NULL DEFAULT (CURRENT_DATE),

  PRIMARY KEY (id_user),
  UNIQUE (email),
  CHECK (role IN ('directeur', 'ingenieur', 'operateur'))
);

-- ============================================================
-- TABLE 2 : barrage
-- Informations du barrage Youssef Ibn Tachfine
-- ============================================================
CREATE TABLE barrage (
  id_barrage        INT            NOT NULL AUTO_INCREMENT,
  nom               VARCHAR(100)   NOT NULL,
  localisation      VARCHAR(255)   NOT NULL,
  capacite_max_m3   FLOAT          NOT NULL,
  niveau_eau_m3     FLOAT          NOT NULL,
  seuil_securite_m3 FLOAT          NOT NULL,
  date_mise_service DATE           NOT NULL,

  PRIMARY KEY (id_barrage),
  CHECK (niveau_eau_m3 >= 0),
  CHECK (seuil_securite_m3 > 0),
  CHECK (capacite_max_m3 > seuil_securite_m3)
);

-- ============================================================
-- TABLE 3 : cooperative
-- Coopératives agricoles de la région Souss-Massa
-- ============================================================
CREATE TABLE cooperative (
  id_coop          INT            NOT NULL AUTO_INCREMENT,
  nom              VARCHAR(100)   NOT NULL,
  surface_hectares FLOAT          NOT NULL,
  localisation_gps VARCHAR(100),
  contact_email    VARCHAR(255),
  actif            TINYINT(1)     NOT NULL DEFAULT 1,

  PRIMARY KEY (id_coop),
  CHECK (surface_hectares > 0)
);

-- ============================================================
-- TABLE 4 : lacher_eau
-- Enregistrement des lâchers d'eau
-- FK → utilisateur (qui autorise) + barrage (quel barrage)
-- ============================================================
CREATE TABLE lacher_eau (
  id_lacher   INT           NOT NULL AUTO_INCREMENT,
  volume_m3   FLOAT         NOT NULL,
  date_lacher DATE          NOT NULL DEFAULT (CURRENT_DATE),
  type        VARCHAR(20)   NOT NULL DEFAULT 'normal',
  status      VARCHAR(20)   NOT NULL DEFAULT 'en_attente',
  motif       TEXT,
  id_user     INT           NOT NULL,
  id_barrage  INT           NOT NULL,

  PRIMARY KEY (id_lacher),
  CHECK (volume_m3 > 0),
  CHECK (type IN ('normal', 'urgence')),
  CHECK (status IN ('en_attente', 'approuve', 'refuse', 'execute')),

  FOREIGN KEY (id_user)    REFERENCES utilisateur(id_user)    ON DELETE RESTRICT,
  FOREIGN KEY (id_barrage) REFERENCES barrage(id_barrage) ON DELETE RESTRICT
);

-- ============================================================
-- TABLE 5 : repartition
-- Distribution de l'eau entre les coopératives (N,N)
-- Clé primaire composite (id_lacher + id_coop)
-- ============================================================
CREATE TABLE repartition (
  id_lacher          INT    NOT NULL,
  id_coop            INT    NOT NULL,
  volume_attribue_m3 FLOAT  NOT NULL,

  PRIMARY KEY (id_lacher, id_coop),
  CHECK (volume_attribue_m3 > 0),

  FOREIGN KEY (id_lacher) REFERENCES lacher_eau(id_lacher) ON DELETE CASCADE,
  FOREIGN KEY (id_coop)   REFERENCES cooperative(id_coop)  ON DELETE CASCADE
);

-- ============================================================
-- TABLE 6 : demande_irrigation
-- Demandes d'eau envoyées par les coopératives
-- FK → cooperative (qui envoie) + utilisateur (qui traite)
-- ============================================================
CREATE TABLE demande_irrigation (
  id_demande        INT           NOT NULL AUTO_INCREMENT,
  volume_demande_m3 FLOAT         NOT NULL,
  date_demande      DATE          NOT NULL DEFAULT (CURRENT_DATE),
  status            VARCHAR(20)   NOT NULL DEFAULT 'en_attente',
  priorite          INT           DEFAULT 1,
  id_coop           INT           NOT NULL,
  id_user           INT           NULL,

  PRIMARY KEY (id_demande),
  CHECK (volume_demande_m3 > 0),
  CHECK (status IN ('en_attente', 'approuve', 'refuse')),
  CHECK (priorite BETWEEN 1 AND 5),

  FOREIGN KEY (id_coop)  REFERENCES cooperative(id_coop) ON DELETE RESTRICT,
  FOREIGN KEY (id_user)  REFERENCES utilisateur(id_user)       ON DELETE SET NULL
);

-- ============================================================
-- TABLE 7 : alerte
-- Alertes générées par le système
-- FK → barrage (quel barrage concerne l'alerte)
-- ============================================================
CREATE TABLE alerte (
  id_alerte      INT           NOT NULL AUTO_INCREMENT,
  type           VARCHAR(20)   NOT NULL,
  message        TEXT          NOT NULL,
  date_creation  DATE          NOT NULL DEFAULT (CURRENT_DATE),
  id_barrage     INT           NOT NULL,

  PRIMARY KEY (id_alerte),
  CHECK (type IN ('critique', 'warning', 'info')),

  FOREIGN KEY (id_barrage) REFERENCES barrage(id_barrage) ON DELETE CASCADE
);
