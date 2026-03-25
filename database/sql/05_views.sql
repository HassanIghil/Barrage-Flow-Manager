-- Vue 1 : Historique des lâchers d’eau
CREATE VIEW v_historique_lachers AS
SELECT 
    l.date_lacher,
    l.volume_m3,
    l.type,
    l.status,
    l.motif,
    CONCAT(u.nom, ' ', u.prenom) AS nom_utilisateur,
    b.nom AS nom_barrage
FROM lacher_eau l
JOIN utilisateur u ON l.id_user = u.id_user
JOIN barrage b ON l.id_barrage = b.id_barrage
ORDER BY l.date_lacher DESC;

-- Vue 2 : Demandes d’irrigation actives (en attente)
CREATE VIEW v_demandes_actives AS
SELECT 
    d.date_demande,
    d.volume_demande_m3,
    d.priorite,
    d.status,
    c.nom AS nom_cooperative,
    CONCAT(u.nom, ' ', u.prenom) AS nom_utilisateur_traite
FROM demande_irrigation d
JOIN cooperative c ON d.id_coop = c.id_coop
LEFT JOIN utilisateur u ON d.id_user = u.id_user
WHERE d.status = 'en_attente';

-- Vue 3 : Détail de la répartition de l’eau
CREATE VIEW v_repartition_detail AS
SELECT 
    l.date_lacher,
    l.volume_m3 AS volume_total,
    c.nom AS nom_cooperative,
    r.volume_attribue_m3,
    c.surface_hectares
FROM repartition r
JOIN lacher_eau l ON r.id_lacher = l.id_lacher
JOIN cooperative c ON r.id_coop = c.id_coop;