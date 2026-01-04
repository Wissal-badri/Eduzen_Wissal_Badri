-- ========================================
-- SCRIPT DE RÉINITIALISATION COMPLÈTE EDUZEN
-- ========================================
-- Ce script va nettoyer toute la base de données et créer les utilisateurs par défaut
-- ATTENTION: Toutes les données existantes seront SUPPRIMÉES !

-- Désactiver les vérifications de clés étrangères temporairement
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================
-- ÉTAPE 1: SUPPRESSION DE TOUTES LES DONNÉES
-- ========================================

TRUNCATE TABLE `evaluations`;
TRUNCATE TABLE `inscriptions`;
TRUNCATE TABLE `ressources`;
TRUNCATE TABLE `memos`;
TRUNCATE TABLE `notifications`;
TRUNCATE TABLE `calendrier_sessions`;
TRUNCATE TABLE `planifications`;
TRUNCATE TABLE `plannings`;
TRUNCATE TABLE `individus`;
TRUNCATE TABLE `formateurs`;
TRUNCATE TABLE `formations`;
TRUNCATE TABLE `entreprises`;
TRUNCATE TABLE `users`;

-- ========================================
-- ÉTAPE 2: RÉINITIALISATION DES AUTO_INCREMENT
-- ========================================

ALTER TABLE `calendrier_sessions` AUTO_INCREMENT = 1;
ALTER TABLE `entreprises` AUTO_INCREMENT = 1;
ALTER TABLE `evaluations` AUTO_INCREMENT = 1;
ALTER TABLE `formateurs` AUTO_INCREMENT = 1;
ALTER TABLE `formations` AUTO_INCREMENT = 1;
ALTER TABLE `individus` AUTO_INCREMENT = 1;
ALTER TABLE `inscriptions` AUTO_INCREMENT = 1;
ALTER TABLE `memos` AUTO_INCREMENT = 1;
ALTER TABLE `notifications` AUTO_INCREMENT = 1;
ALTER TABLE `planifications` AUTO_INCREMENT = 1;
ALTER TABLE `plannings` AUTO_INCREMENT = 1;
ALTER TABLE `ressources` AUTO_INCREMENT = 1;
ALTER TABLE `users` AUTO_INCREMENT = 1;

-- ========================================
-- ÉTAPE 3: CRÉATION DES UTILISATEURS PAR DÉFAUT
-- ========================================

-- Hash BCrypt pour "admin" = $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- Hash BCrypt pour "assistant" = $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Utilisateur ADMIN (username: admin, password: admin)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role_id`, `enabled`, `profile_completed`, `email_alerts`, `newsletters`, `first_name`, `last_name`) 
VALUES (
    1, 
    'admin', 
    'admin@eduzen.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    1, 
    b'1', 
    b'1', 
    b'0', 
    b'0',
    'Admin',
    'EduZen'
);

-- Utilisateur ASSISTANT (username: assistant, password: assistant)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role_id`, `enabled`, `profile_completed`, `email_alerts`, `newsletters`, `first_name`, `last_name`) 
VALUES (
    2, 
    'assistant', 
    'assistant@eduzen.com', 
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cyhWhk7qQ5f9kxwLtGGvJLoH4qa36', 
    3, 
    b'1', 
    b'1', 
    b'0', 
    b'0',
    'Assistant',
    'EduZen'
);

-- Réactiver les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- VÉRIFICATION
-- ========================================

SELECT 
    id, 
    username, 
    email, 
    CASE role_id
        WHEN 1 THEN 'ADMIN'
        WHEN 2 THEN 'FORMATEUR'
        WHEN 3 THEN 'ASSISTANT'
        WHEN 4 THEN 'ETUDIANT'
        WHEN 5 THEN 'INDIVIDU'
        ELSE 'UNKNOWN'
    END as role,
    enabled,
    profile_completed,
    LEFT(password, 30) as password_hash
FROM users
ORDER BY id;

-- ========================================
-- RÉSULTAT ATTENDU
-- ========================================
-- Vous devriez voir 2 utilisateurs:
-- 1. admin (ADMIN) - enabled=1, profile_completed=1
-- 2. assistant (ASSISTANT) - enabled=1, profile_completed=1
--
-- Les mots de passe doivent commencer par: $2a$10$
--
-- IDENTIFIANTS DE CONNEXION:
-- - Username: admin     | Password: admin
-- - Username: assistant | Password: assistant
-- ========================================
