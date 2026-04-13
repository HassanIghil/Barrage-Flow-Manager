-- Blue Team — Utilisateur applicatif avec droits minimaux
CREATE USER IF NOT EXISTS 'barrage_app'@'%' 
IDENTIFIED BY 'AppSecure2024!';

GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE 
ON barrage_flow_manager.* 
TO 'barrage_app'@'%';

FLUSH PRIVILEGES;