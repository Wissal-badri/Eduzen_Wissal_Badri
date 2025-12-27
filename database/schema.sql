-- Database Selection/Creation
CREATE DATABASE IF NOT EXISTS eduzen_db;
USE eduzen_db;

-- ==========================================
-- 1. Authentication & Users
-- ==========================================

-- Roles Table
-- Stores the available roles: ADMIN, FORMATEUR, ASSISTANT
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users Table
-- Central authentication table. 
-- 'role_id' links to the roles table.
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 2. Core Entities (Trainers, Trainings)
-- ==========================================

-- Formateurs Table
-- Extends the User entity. Contains specific trainer info.
-- 'user_id' links back to the users table.
CREATE TABLE IF NOT EXISTS formateurs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    competences TEXT, -- Stores keywords like "Java, React, Management"
    remarques TEXT,   -- Internal notes for Admin
    CONSTRAINT fk_formateurs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Formations Table
-- Catalog of available training courses.
CREATE TABLE IF NOT EXISTS formations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    nombre_heures INT NOT NULL,
    cout DECIMAL(10,2) NOT NULL, -- Cost in MAD
    objectifs TEXT,
    programme_detaille TEXT,
    categorie VARCHAR(100), -- e.g., "IT", "Soft Skills"
    ville VARCHAR(100)      -- e.g., "Casablanca", "Rabat"
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 3. External Entities (Companies, Public)
-- ==========================================

-- Entreprises Table
-- Partner companies or client companies.
CREATE TABLE IF NOT EXISTS entreprises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse VARCHAR(255),
    telephone VARCHAR(50),
    url VARCHAR(255),
    email VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Individus Table (Students/Participants)
-- Independent learners registering via the public form.
CREATE TABLE IF NOT EXISTS individus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    ville VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    telephone VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 4. Planning & Scheduling (Sessions)
-- ==========================================

-- Planifications/Sessions Table
-- Represents a specific instance of a Formation (e.g., "October React Class").
-- Links a Formation to a Trainer and optionally a Company.
CREATE TABLE IF NOT EXISTS planifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    formation_id BIGINT NOT NULL,
    formateur_id BIGINT,         -- Assigned trainer
    entreprise_id BIGINT,        -- Optional: if this session is dedicated to a specific company
    nom_groupe VARCHAR(255),     -- e.g. "Dev Group A"
    status VARCHAR(50) DEFAULT 'PLANIFIE', -- PLANIFIE, EN_COURS, TERMINE, ANNULE
    CONSTRAINT fk_planif_formation FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
    CONSTRAINT fk_planif_formateur FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE SET NULL,
    CONSTRAINT fk_planif_entreprise FOREIGN KEY (entreprise_id) REFERENCES entreprises(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Calendar Table for Sessions
-- Handles the "Set of dates" requirement. 
-- A single session can run on multiple non-contiguous dates.
CREATE TABLE IF NOT EXISTS calendrier_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    planification_id BIGINT NOT NULL,
    date_jour DATE NOT NULL,
    heure_debut TIME,
    heure_fin TIME,
    lieu VARCHAR(255),
    CONSTRAINT fk_cal_planif FOREIGN KEY (planification_id) REFERENCES planifications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 5. Registration & Evaluation
-- ==========================================

-- Inscriptions Table
-- Links an Individual to a Session.
CREATE TABLE IF NOT EXISTS inscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    individu_id BIGINT NOT NULL,
    planification_id BIGINT NOT NULL,
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inscr_individu FOREIGN KEY (individu_id) REFERENCES individus(id) ON DELETE CASCADE,
    CONSTRAINT fk_inscr_planif FOREIGN KEY (planification_id) REFERENCES planifications(id) ON DELETE CASCADE,
    UNIQUE KEY unique_inscription (individu_id, planification_id) -- Prevent double booking
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Evaluations Table
-- Feedback from students.
CREATE TABLE IF NOT EXISTS evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inscription_id BIGINT NOT NULL UNIQUE, -- One evaluation per student per session
    note_pedagogie INT CHECK (note_pedagogie BETWEEN 1 AND 5),
    note_rythme INT CHECK (note_rythme BETWEEN 1 AND 5),
    note_support INT CHECK (note_support BETWEEN 1 AND 5),
    note_maitrise INT CHECK (note_maitrise BETWEEN 1 AND 5),
    commentaire TEXT,
    date_eval DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_eval_inscr FOREIGN KEY (inscription_id) REFERENCES inscriptions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 6. Initial Data Seeding
-- ==========================================

-- Insert Roles
INSERT INTO roles (id, name) VALUES (1, 'ADMIN') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (id, name) VALUES (2, 'FORMATEUR') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (id, name) VALUES (3, 'ASSISTANT') ON DUPLICATE KEY UPDATE name=name;

-- Note: Users are typically created by the Application's DataInitializer to ensure 
-- password hashing matches the specific BCrypt version used by Spring Security.
