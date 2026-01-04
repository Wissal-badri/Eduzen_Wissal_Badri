-- Script SQL pour ajouter les champs manquants à la table formations
-- Exécutez ce script dans votre base de données MySQL

-- Ajouter la colonne description
ALTER TABLE formations 
ADD COLUMN IF NOT EXISTS description TEXT AFTER titre;

-- Ajouter la colonne duree_en_heures
ALTER TABLE formations 
ADD COLUMN IF NOT EXISTS duree_en_heures INT AFTER nombre_heures;

-- Ajouter la colonne domaine
ALTER TABLE formations 
ADD COLUMN IF NOT EXISTS domaine VARCHAR(255) AFTER categorie;

-- Mettre à jour duree_en_heures avec les valeurs de nombre_heures si elles existent
UPDATE formations 
SET duree_en_heures = nombre_heures 
WHERE duree_en_heures IS NULL AND nombre_heures IS NOT NULL;

-- Ajouter quelques formations de test avec tous les champs
INSERT INTO formations (titre, description, nombre_heures, duree_en_heures, cout, objectifs, programme_detaille, categorie, domaine, ville, pour_individus, statut, date_debut, date_fin)
VALUES 
('Formation React Avancé', 'Maîtrisez React et ses concepts avancés pour créer des applications web modernes et performantes.', 40, 40, 2500.00, 'Maîtriser React, Redux, Hooks', 'Introduction, Components, State Management, Hooks, Performance', 'Développement', 'web', 'Casablanca', TRUE, 'OUVERTE', '2026-02-01', '2026-03-01'),
('Marketing Digital', 'Apprenez les stratégies de marketing digital pour booster votre présence en ligne.', 30, 30, 1800.00, 'SEO, SEM, Social Media Marketing', 'Stratégies digitales, SEO, Google Ads, Social Media', 'Marketing', 'marketing', 'Rabat', TRUE, 'OUVERTE', '2026-02-15', '2026-03-15'),
('Design Graphique Pro', 'Créez des designs professionnels avec Adobe Creative Suite.', 35, 35, 2200.00, 'Photoshop, Illustrator, InDesign', 'Bases du design, Photoshop, Illustrator, Projets réels', 'Design', 'design', 'Casablanca', TRUE, 'OUVERTE', '2026-03-01', '2026-04-01'),
('DevOps et CI/CD', 'Automatisez vos déploiements avec Docker, Kubernetes et Jenkins.', 45, 45, 3000.00, 'Docker, Kubernetes, Jenkins, GitLab CI', 'Introduction DevOps, Conteneurisation, Orchestration, CI/CD', 'DevOps', 'devops', 'Marrakech', TRUE, 'OUVERTE', '2026-02-20', '2026-04-20'),
('Communication Professionnelle', 'Améliorez vos compétences en communication pour réussir dans votre carrière.', 25, 25, 1500.00, 'Prise de parole, Présentation, Négociation', 'Communication verbale, non-verbale, Présentations efficaces', 'Soft Skills', 'communication', 'Rabat', TRUE, 'OUVERTE', '2026-03-10', '2026-04-10');

-- Vérifier les données
SELECT id, titre, domaine, duree_en_heures, cout, statut, pour_individus 
FROM formations 
WHERE pour_individus = TRUE OR statut = 'OUVERTE';
