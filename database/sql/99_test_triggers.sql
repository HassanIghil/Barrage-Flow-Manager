-- ============================================================
-- BARRAGE-FLOW MANAGER — Test des Triggers
-- Fichier : 99_test_triggers.sql
-- ============================================================

USE barrage_flow_manager;

-- 1. Tester un lâcher normal (doit passer et mettre à jour le niveau)
-- Niveau initial : 180,000,000 m3
-- Lâcher de 10,000,000 m3
-- Nouveau niveau attendu : 170,000,000 m3
INSERT INTO lacher_eau (volume_m3, date_lacher, type, status, motif, id_user, id_barrage) 
VALUES (10000000, '2026-03-20', 'normal', 'execute', 'Test lâcher normal', 1, 1);

SELECT niveau_eau_m3 FROM barrage WHERE id_barrage = 1;


-- 2. Tester un lâcher qui dépasse le seuil (doit être bloqué)
-- Seuil : 50,000,000 m3
-- Niveau actuel (après test 1) : 170,000,000 m3
-- Tentative de lâcher de 130,000,000 m3 (170 - 130 = 40 < 50)
-- Doit retourner une erreur : "Lâcher refusé : le niveau passerait sous le seuil de sécurité"
-- INSERT INTO lacher_eau (volume_m3, date_lacher, type, status, motif, id_user, id_barrage) 
-- VALUES (130000000, '2026-03-21', 'normal', 'execute', 'Test dépassement seuil', 1, 1);


-- 3. Vérifier la génération d'alerte (Update direct du niveau pour forcer l'alerte)
-- Alerte Warning si < 60,000,000 (1.2 * 50M)
UPDATE barrage SET niveau_eau_m3 = 55000000 WHERE id_barrage = 1;
SELECT * FROM alerte ORDER BY id_alerte DESC LIMIT 1;

-- Alerte Critique si < 50,000,000
UPDATE barrage SET niveau_eau_m3 = 45000000 WHERE id_barrage = 1;
SELECT * FROM alerte ORDER BY id_alerte DESC LIMIT 1;


-- 4. Vérifier blocage coopérative inactive
-- Coop Massa Irriguée (id_coop = 5) est inactive (actif = 0)
-- Doit retourner une erreur : "Coopérative inactive"
-- INSERT INTO demande_irrigation (volume_demande_m3, date_demande, status, priorite, id_coop, id_user)
-- VALUES (500000, '2026-03-22', 'en_attente', 3, 5, NULL);
