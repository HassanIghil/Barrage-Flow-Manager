DELIMITER $$

-- Procédure pour répartir un volume d'eau entre les coopératives actives
CREATE PROCEDURE sp_repartir_eau(IN p_id_lacher INT)
BEGIN
    -- Variables de stockage
    DECLARE v_volume_total FLOAT;       -- Volume total du lâcher d'eau
    DECLARE v_surface_totale FLOAT;     -- Somme des surfaces de toutes les coopératives actives
    DECLARE v_surface FLOAT;            -- Surface d'une coopérative
    DECLARE v_id_coop INT;              -- ID d'une coopérative
    DECLARE v_total_demande FLOAT;     -- Somme des besoins approuvés pour cette coop
    DECLARE done INT DEFAULT 0;         -- Indicateur de fin de curseur

    -- Déclaration du curseur : Surface + Somme des volumes demandés ET approuvés
    DECLARE coop_cursor CURSOR FOR 
        SELECT 
            c.id_coop, 
            c.surface_hectares, 
            IFNULL(SUM(d.volume_demande_m3), 0) as total_demande
        FROM cooperative c
        LEFT JOIN demande_irrigation d ON c.id_coop = d.id_coop AND d.status = 'approuve'
        WHERE c.actif = 1
        GROUP BY c.id_coop, c.surface_hectares;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Récupérer le volume total du lâcher d'eau technique
    SELECT volume_m3 INTO v_volume_total FROM lacher_eau WHERE id_lacher = p_id_lacher;

    -- Calcul de la surface totale de base pour le ratio
    SELECT SUM(surface_hectares) INTO v_surface_totale FROM cooperative WHERE actif = 1;

    OPEN coop_cursor;
    read_loop: LOOP
        FETCH coop_cursor INTO v_id_coop, v_surface, v_total_demande;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Attribution : on prend le minimum entre (Part proportionnelle à la surface) et (Besoins réels demandés)
        -- Si v_total_demande est 0, la coop ne reçoit rien (évite de gaspiller l'eau si pas de besoin)
        INSERT IGNORE INTO repartition (id_lacher, id_coop, volume_attribue_m3)
        VALUES (
            p_id_lacher, 
            v_id_coop, 
            LEAST(v_volume_total * (v_surface / v_surface_totale), v_total_demande + 0.000001)
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
