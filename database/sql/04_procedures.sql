DELIMITER $$

-- Procédure pour répartir un volume d'eau entre les coopératives actives
CREATE PROCEDURE sp_repartir_eau(IN p_id_lacher INT)
BEGIN
    -- Variables de stockage
    DECLARE v_volume_total FLOAT;       -- Volume total du lâcher d'eau
    DECLARE v_surface_totale FLOAT;     -- Somme des surfaces de toutes les coopératives actives
    DECLARE v_surface FLOAT;            -- Surface d'une coopérative
    DECLARE v_id_coop INT;              -- ID d'une coopérative
    DECLARE done INT DEFAULT 0;         -- Indicateur de fin de curseur

    -- Déclaration du curseur pour parcourir les coopératives actives
    DECLARE coop_cursor CURSOR FOR 
        SELECT id_coop, surface_hectares FROM cooperative WHERE actif = 1;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Récupérer le volume total du lâcher d'eau
    SELECT volume_m3 INTO v_volume_total FROM lacher_eau WHERE id_lacher = p_id_lacher;

    -- Calcul de la surface totale des coopératives actives
    SELECT SUM(surface_hectares) INTO v_surface_totale FROM cooperative WHERE actif = 1;

    OPEN coop_cursor;
    read_loop: LOOP
        FETCH coop_cursor INTO v_id_coop, v_surface;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Insertion de la répartition proportionnelle
        INSERT INTO repartition (id_lacher, id_coop, volume_attribue_m3)
        SELECT p_id_lacher, v_id_coop, v_volume_total * (v_surface / v_surface_totale)
        WHERE NOT EXISTS (
            SELECT 1 FROM repartition 
            WHERE id_lacher = p_id_lacher AND id_coop = v_id_coop
        );
    END LOOP;

    CLOSE coop_cursor;
END$$

-- Procédure pour afficher les statistiques du tableau de bord
CREATE PROCEDURE sp_dashboard_stats()
BEGIN
    SELECT 
        b.nom AS barrage,
        b.niveau_eau_m3,
        b.capacite_max_m3,
        -- Pourcentage de remplissage du barrage
        ROUND((b.niveau_eau_m3 / b.capacite_max_m3) * 100, 2) AS pourcentage_remplissage,
        -- Nombre total d'alertes critiques
        (SELECT COUNT(*) FROM alerte WHERE type='critique') AS nb_alertes_critiques,
        -- Nombre de demandes d'irrigation en attente
        (SELECT COUNT(*) FROM demande_irrigation WHERE status='en_attente') AS nb_demandes_en_attente
    FROM barrage b;
END$$

DELIMITER ;