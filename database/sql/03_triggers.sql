-- ============================================================
-- BARRAGE-FLOW MANAGER — Triggers SQL (MySQL 8.0)
-- Fichier : 03_triggers.sql
-- ============================================================

USE barrage_flow_manager;

DELIMITER //

-- ============================================================
-- Trigger 1 : trg_before_lacher_check_seuil
-- Empêche un lâcher d'eau si le niveau descend sous le seuil
-- ============================================================
CREATE TRIGGER trg_before_lacher_check_seuil
BEFORE INSERT ON lacher_eau
FOR EACH ROW
BEGIN
    DECLARE v_niveau FLOAT;
    DECLARE v_seuil FLOAT;

    SELECT niveau_eau_m3, seuil_securite_m3 INTO v_niveau, v_seuil
    FROM barrage
    WHERE id_barrage = NEW.id_barrage;

    IF (v_niveau - NEW.volume_m3) < v_seuil THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lâcher refusé : le niveau passerait sous le seuil de sécurité';
    END IF;
END //

-- ============================================================
-- Trigger 2 : trg_after_lacher_update_niveau
-- Met à jour le niveau d'eau du barrage après un lâcher exécuté
-- ============================================================
CREATE TRIGGER trg_after_lacher_update_niveau
AFTER INSERT ON lacher_eau
FOR EACH ROW
BEGIN
    IF NEW.status = 'execute' THEN
        UPDATE barrage 
        SET niveau_eau_m3 = niveau_eau_m3 - NEW.volume_m3 
        WHERE id_barrage = NEW.id_barrage;
    END IF;
END //

-- ============================================================
-- Trigger 2.5 : trg_after_lacher_update_status
-- Si on approuve/exécute un lâcher qui était en attente
-- ============================================================
CREATE TRIGGER trg_after_lacher_update_status
AFTER UPDATE ON lacher_eau
FOR EACH ROW
BEGIN
    IF NEW.status = 'execute' AND OLD.status != 'execute' THEN
        UPDATE barrage 
        SET niveau_eau_m3 = niveau_eau_m3 - NEW.volume_m3 
        WHERE id_barrage = NEW.id_barrage;
    END IF;
END //

-- ============================================================
-- Trigger 3 : trg_after_barrage_genere_alerte
-- Génère une alerte si le niveau d'eau devient trop bas
-- ============================================================
CREATE TRIGGER trg_after_barrage_genere_alerte
AFTER UPDATE ON barrage
FOR EACH ROW
BEGIN
    -- Alerte critique si sous le seuil
    IF NEW.niveau_eau_m3 < NEW.seuil_securite_m3 THEN
        INSERT INTO alerte (type, message, id_barrage) 
        VALUES ('critique', CONCAT('Alerte CRITIQUE : Le niveau d\'eau (', NEW.niveau_eau_m3, ' m3) est inférieur au seuil de sécurité !'), NEW.id_barrage);
    
    -- Alerte warning si proche du seuil (1.2 * seuil)
    ELSEIF NEW.niveau_eau_m3 < (NEW.seuil_securite_m3 * 1.2) THEN
        INSERT INTO alerte (type, message, id_barrage) 
        VALUES ('warning', CONCAT('Alerte WARNING : Le niveau d\'eau (', NEW.niveau_eau_m3, ' m3) approche du seuil de sécurité.'), NEW.id_barrage);
    END IF;
END //

-- ============================================================
-- Trigger 4 : trg_before_demande_check_coop
-- Vérifie que la coopérative est active avant d'accepter une demande
-- ============================================================
CREATE TRIGGER trg_before_demande_check_coop
BEFORE INSERT ON demande_irrigation
FOR EACH ROW
BEGIN
    DECLARE v_actif TINYINT;

    SELECT actif INTO v_actif
    FROM cooperative
    WHERE id_coop = NEW.id_coop;

    IF v_actif = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Coopérative inactive';
    END IF;
END //

DELIMITER ;
