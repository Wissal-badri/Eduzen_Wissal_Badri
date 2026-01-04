-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 03 jan. 2026 à 13:10
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `eduzen_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `calendrier_sessions`
--

CREATE TABLE `calendrier_sessions` (
  `id` bigint(20) NOT NULL,
  `planification_id` bigint(20) NOT NULL,
  `date_jour` date NOT NULL,
  `heure_debut` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `lieu` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `entreprises`
--

CREATE TABLE `entreprises` (
  `id` bigint(20) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` bigint(20) NOT NULL,
  `inscription_id` bigint(20) NOT NULL,
  `note_pedagogie` int(11) DEFAULT NULL CHECK (`note_pedagogie` between 1 and 5),
  `note_rythme` int(11) DEFAULT NULL CHECK (`note_rythme` between 1 and 5),
  `note_support` int(11) DEFAULT NULL CHECK (`note_support` between 1 and 5),
  `note_maitrise` int(11) DEFAULT NULL CHECK (`note_maitrise` between 1 and 5),
  `commentaire` text DEFAULT NULL,
  `date_eval` datetime DEFAULT current_timestamp(),
  `commentaires` text DEFAULT NULL,
  `date_evaluation` datetime(6) DEFAULT NULL,
  `maitrise_sujet` int(11) DEFAULT NULL,
  `qualite_pedagogique` int(11) DEFAULT NULL,
  `rythme` int(11) DEFAULT NULL,
  `support_cours` int(11) DEFAULT NULL,
  `formation_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `formateurs`
--

CREATE TABLE `formateurs` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `competences` text DEFAULT NULL,
  `remarques` text DEFAULT NULL,
  `approuve` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `formations`
--

CREATE TABLE `formations` (
  `id` bigint(20) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `nombre_heures` int(11) NOT NULL,
  `cout` decimal(38,2) DEFAULT NULL,
  `objectifs` text DEFAULT NULL,
  `programme_detaille` text DEFAULT NULL,
  `categorie` varchar(100) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `formateur_id` bigint(20) DEFAULT NULL,
  `pour_individus` bit(1) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `statut` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `individus`
--

CREATE TABLE `individus` (
  `id` bigint(20) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `formation_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `inscriptions`
--

CREATE TABLE `inscriptions` (
  `id` bigint(20) NOT NULL,
  `individu_id` bigint(20) NOT NULL,
  `planification_id` bigint(20) DEFAULT NULL,
  `date_inscription` datetime DEFAULT current_timestamp(),
  `statut` varchar(255) DEFAULT NULL,
  `formation_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `memos`
--

CREATE TABLE `memos` (
  `id` bigint(20) NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `formation_id` bigint(20) DEFAULT NULL,
  `is_read` bit(1) NOT NULL,
  `message` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `planifications`
--

CREATE TABLE `planifications` (
  `id` bigint(20) NOT NULL,
  `formation_id` bigint(20) NOT NULL,
  `formateur_id` bigint(20) DEFAULT NULL,
  `entreprise_id` bigint(20) DEFAULT NULL,
  `nom_groupe` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'PLANIFIE',
  `all_day` tinyint(1) DEFAULT 0,
  `date_debut` datetime(6) NOT NULL,
  `date_fin` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `plannings`
--

CREATE TABLE `plannings` (
  `id` bigint(20) NOT NULL,
  `date_debut` datetime(6) NOT NULL,
  `date_fin` datetime(6) NOT NULL,
  `entreprise_id` bigint(20) NOT NULL,
  `formateur_id` bigint(20) NOT NULL,
  `formation_id` bigint(20) NOT NULL,
  `all_day` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ressources`
--

CREATE TABLE `ressources` (
  `id` bigint(20) NOT NULL,
  `date_creation` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `lien_externe` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `nombre_telechargements` int(11) DEFAULT NULL,
  `taille_fichier` bigint(20) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `url_fichier` varchar(255) DEFAULT NULL,
  `formateur_id` bigint(20) DEFAULT NULL,
  `formation_id` bigint(20) NOT NULL,
  `archived` bit(1) DEFAULT NULL,
  `content_type` varchar(255) DEFAULT NULL,
  `nom_fichier_original` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'ADMIN'),
(3, 'ASSISTANT'),
(4, 'ETUDIANT'),
(2, 'FORMATEUR'),
(5, 'INDIVIDU');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `email_alerts` bit(1) DEFAULT NULL,
  `last_password_change` datetime(6) DEFAULT NULL,
  `newsletters` bit(1) DEFAULT NULL,
  `entreprise` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profile_completed` bit(1) DEFAULT NULL,
  `enabled` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `calendrier_sessions`
--
ALTER TABLE `calendrier_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cal_planif` (`planification_id`);

--
-- Index pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inscription_id` (`inscription_id`),
  ADD KEY `FKtgudj3fk64udn1jbmfyy2b7dh` (`formation_id`),
  ADD KEY `FK4prhys5t43v3cce1q09qcljhe` (`user_id`);

--
-- Index pour la table `formateurs`
--
ALTER TABLE `formateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Index pour la table `formations`
--
ALTER TABLE `formations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKo433eh8ybpb75eb26exmovdfm` (`formateur_id`);

--
-- Index pour la table `individus`
--
ALTER TABLE `individus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `FKe32q8k2uwvssihr7bfg0eqksi` (`formation_id`);

--
-- Index pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_inscription` (`individu_id`,`planification_id`),
  ADD KEY `FK8ip4yxmv05y8ci40w1we1egc1` (`formation_id`),
  ADD KEY `FK1vjrmgbufa849ni4pgcjqnl5d` (`user_id`),
  ADD KEY `fk_inscriptions_planifications` (`planification_id`);

--
-- Index pour la table `memos`
--
ALTER TABLE `memos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKjfl1v48y7d1vlk2jw1qqm3x42` (`user_id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `planifications`
--
ALTER TABLE `planifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_planif_formation` (`formation_id`),
  ADD KEY `fk_planif_formateur` (`formateur_id`),
  ADD KEY `fk_planif_entreprise` (`entreprise_id`);

--
-- Index pour la table `plannings`
--
ALTER TABLE `plannings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2wo3jj52ih92dgcb4gwe02k27` (`entreprise_id`),
  ADD KEY `FKrct7n212sd7tjm09n368roqqa` (`formateur_id`),
  ADD KEY `FK76lm8563wjdim3lgv1t59j126` (`formation_id`);

--
-- Index pour la table `ressources`
--
ALTER TABLE `ressources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6aeriftgkgjpnh5nfmfye5eof` (`formateur_id`),
  ADD KEY `FKbxrcw1mi3w48m0ouyhpdcodk` (`formation_id`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_users_role` (`role_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `calendrier_sessions`
--
ALTER TABLE `calendrier_sessions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `entreprises`
--
ALTER TABLE `entreprises`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `formateurs`
--
ALTER TABLE `formateurs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `formations`
--
ALTER TABLE `formations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `individus`
--
ALTER TABLE `individus`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `memos`
--
ALTER TABLE `memos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `planifications`
--
ALTER TABLE `planifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `plannings`
--
ALTER TABLE `plannings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `ressources`
--
ALTER TABLE `ressources`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `calendrier_sessions`
--
ALTER TABLE `calendrier_sessions`
  ADD CONSTRAINT `fk_cal_planif` FOREIGN KEY (`planification_id`) REFERENCES `planifications` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `FK4prhys5t43v3cce1q09qcljhe` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKtgudj3fk64udn1jbmfyy2b7dh` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`),
  ADD CONSTRAINT `fk_eval_inscr` FOREIGN KEY (`inscription_id`) REFERENCES `inscriptions` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `formateurs`
--
ALTER TABLE `formateurs`
  ADD CONSTRAINT `fk_formateurs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `formations`
--
ALTER TABLE `formations`
  ADD CONSTRAINT `FKo433eh8ybpb75eb26exmovdfm` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs` (`id`);

--
-- Contraintes pour la table `individus`
--
ALTER TABLE `individus`
  ADD CONSTRAINT `FKe32q8k2uwvssihr7bfg0eqksi` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`);

--
-- Contraintes pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  ADD CONSTRAINT `FK1vjrmgbufa849ni4pgcjqnl5d` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK8ip4yxmv05y8ci40w1we1egc1` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`),
  ADD CONSTRAINT `fk_inscr_individu` FOREIGN KEY (`individu_id`) REFERENCES `individus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_inscr_planif` FOREIGN KEY (`planification_id`) REFERENCES `planifications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_inscriptions_planifications` FOREIGN KEY (`planification_id`) REFERENCES `planifications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `memos`
--
ALTER TABLE `memos`
  ADD CONSTRAINT `FKjfl1v48y7d1vlk2jw1qqm3x42` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `planifications`
--
ALTER TABLE `planifications`
  ADD CONSTRAINT `fk_planif_entreprise` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_planif_formateur` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_planif_formation` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `plannings`
--
ALTER TABLE `plannings`
  ADD CONSTRAINT `FK2wo3jj52ih92dgcb4gwe02k27` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`),
  ADD CONSTRAINT `FK76lm8563wjdim3lgv1t59j126` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`),
  ADD CONSTRAINT `FKrct7n212sd7tjm09n368roqqa` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs` (`id`);

--
-- Contraintes pour la table `ressources`
--
ALTER TABLE `ressources`
  ADD CONSTRAINT `FK6aeriftgkgjpnh5nfmfye5eof` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs` (`id`),
  ADD CONSTRAINT `FKbxrcw1mi3w48m0ouyhpdcodk` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
