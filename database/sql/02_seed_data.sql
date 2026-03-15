-- ============================================================
-- BARRAGE-FLOW MANAGER — Seed Data (MySQL 8.0)
-- Fichier : 02_seed_data.sql
-- Auteur  : Hassan IGHIL
-- ============================================================

USE barrage_flow_manager;

-- ============================================================
-- BARRAGE — Youssef Ibn Tachfine
-- ============================================================
INSERT INTO barrage (nom, localisation, capacite_max_m3, niveau_eau_m3, seuil_securite_m3, date_mise_service)
VALUES ('Youssef Ibn Tachfine', 'Province de Tiznit, Souss-Massa', 300000000, 180000000, 50000000, '1972-01-01');

-- ============================================================
-- UTILISATEURS (4 comptes)
-- Mots de passe hashés avec bcrypt (valeur = "password123")
-- ============================================================
INSERT INTO utilisateur (nom, prenom, email, password, role) VALUES
('IGHIL',    'Hassan',   'directeur@barrage-yt.ma',  '$2b$12$LJ3m9X5z0Yq8K1v2W7sXxO3nR4tP6wA8zC0dF2gH4jK6lN8pQ0rS', 'directeur'),
('IFQUIRNE', 'Yassine',  'yassine@barrage-yt.ma',    '$2b$12$LJ3m9X5z0Yq8K1v2W7sXxO3nR4tP6wA8zC0dF2gH4jK6lN8pQ0rS', 'ingenieur'),
('BOULAID',  'Aabir',    'aabir@barrage-yt.ma',      '$2b$12$LJ3m9X5z0Yq8K1v2W7sXxO3nR4tP6wA8zC0dF2gH4jK6lN8pQ0rS', 'operateur'),

-- ============================================================
-- COOPERATIVES AGRICOLES (5 coopératives Souss-Massa)
-- ============================================================
INSERT INTO cooperative (nom, surface_hectares, localisation_gps, contact_email, actif) VALUES
('Coop Al Amal',        1200, '29.7500,-9.8000', 'contact@al-amal.ma',        1),
('Coop Souss Natura',    850, '30.4200,-9.6000', 'info@souss-natura.ma',       1),
('Coop Argane Dor',      600, '29.5100,-9.7500', 'direction@argane-dor.ma',    1),
('Coop Tiznit Verte',   1500, '29.6900,-9.8100', 'admin@tiznit-verte.ma',     1),
('Coop Massa Irriguée',  450, '29.4500,-9.6300', 'contact@massa-irriguee.ma',  0);

-- ============================================================
-- LACHERS D'EAU (3 lâchers)
-- ============================================================
INSERT INTO lacher_eau (volume_m3, date_lacher, type, status, motif, id_user, id_barrage) VALUES
(5000000,  '2026-03-01', 'normal',  'execute',    'Irrigation mensuelle — Mars',               1, 1),
(2000000,  '2026-03-08', 'normal',  'execute',    'Complément irrigation zone Est',             2, 1),
(8000000,  '2026-03-15', 'urgence', 'en_attente', 'Demande urgente sécheresse prolongée',       1, 1);

-- ============================================================
-- REPARTITION (Distribution des lâchers exécutés)
-- ============================================================
-- Lâcher 1 : 5M m³ répartis entre 4 coopératives actives
INSERT INTO repartition (id_lacher, id_coop, volume_attribue_m3) VALUES
(1, 1, 1445783),   -- Al Amal (1200 ha)
(1, 2, 1024096),   -- Souss Natura (850 ha)
(1, 3,  722892),   -- Argane Dor (600 ha)
(1, 4, 1807229);   -- Tiznit Verte (1500 ha)

-- Lâcher 2 : 2M m³ répartis
INSERT INTO repartition (id_lacher, id_coop, volume_attribue_m3) VALUES
(2, 1, 578313),
(2, 2, 409639),
(2, 3, 289157),
(2, 4, 722891);

-- ============================================================
-- DEMANDES D'IRRIGATION (4 demandes)
-- ============================================================
INSERT INTO demande_irrigation (volume_demande_m3, date_demande, status, priorite, id_coop, id_user) VALUES
(3000000, '2026-02-28', 'approuve',   3, 1, 1),
(1500000, '2026-03-02', 'approuve',   2, 2, 2),
(4000000, '2026-03-10', 'en_attente', 5, 4, NULL),
(1000000, '2026-03-12', 'refuse',     1, 3, 2);

-- ============================================================
-- ALERTES (3 alertes)
-- ============================================================
INSERT INTO alerte (type, message, date_creation, id_barrage) VALUES
('info',     'Niveau du barrage stable à 60% de la capacité.',                         '2026-03-01', 1),
('warning',  'Niveau du barrage en baisse — 55% de la capacité. Surveiller.',          '2026-03-08', 1),
('critique', 'Niveau critique atteint — approche du seuil de sécurité AEP.',           '2026-03-14', 1);
