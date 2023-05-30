-- SQLBook: Code
-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : dim. 28 mai 2023 à 22:43
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `groupomania`
--

-- --------------------------------------------------------

--
-- Structure de la table `commentaires`
--

DROP TABLE IF EXISTS `commentaires`;
CREATE TABLE IF NOT EXISTS `commentaires` (
  `idComment` int NOT NULL AUTO_INCREMENT,
  `idMessage` int NOT NULL,
  `PostTexte` varchar(230) DEFAULT NULL,
  `PostImg` varchar(255) DEFAULT NULL,
  `PostDate` datetime DEFAULT NULL,
  `idUser` int NOT NULL,
  PRIMARY KEY (`idComment`),
  KEY `idUser` (`idUser`),
  KEY `idMessage` (`idMessage`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `commentaires`
--

INSERT INTO `commentaires` (`idComment`, `idMessage`, `PostTexte`, `PostImg`, `PostDate`, `idUser`) VALUES
(1, 2, 'On Dit Oui Chef !', NULL, '2023-05-29 00:00:00', 1),
(2, 2, 'Et on touche pas a l\'index !', NULL, '2023-05-29 00:00:00', 1);

-- --------------------------------------------------------

--
-- Structure de la table `dislikes`
--

DROP TABLE IF EXISTS `dislikes`;
CREATE TABLE IF NOT EXISTS `dislikes` (
  `idDislike` int NOT NULL AUTO_INCREMENT,
  `UserDislike` int DEFAULT NULL,
  `PostDislike` int DEFAULT NULL,
  PRIMARY KEY (`idDislike`),
  KEY `UserDislike` (`UserDislike`),
  KEY `PostDislike` (`PostDislike`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `idLike` int NOT NULL AUTO_INCREMENT,
  `UserLike` int DEFAULT NULL,
  `PostLike` int DEFAULT NULL,
  PRIMARY KEY (`idLike`),
  KEY `UserLike` (`UserLike`),
  KEY `PostLike` (`PostLike`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messagedislikes`
--

DROP TABLE IF EXISTS `messagedislikes`;
CREATE TABLE IF NOT EXISTS `messagedislikes` (
  `idDislike` int NOT NULL AUTO_INCREMENT,
  `UserDislike` int DEFAULT NULL,
  `MessageDislike` int DEFAULT NULL,
  PRIMARY KEY (`idDislike`),
  KEY `UserDislike` (`UserDislike`),
  KEY `MessageDislike` (`MessageDislike`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messagelikes`
--

DROP TABLE IF EXISTS `messagelikes`;
CREATE TABLE IF NOT EXISTS `messagelikes` (
  `idLike` int NOT NULL AUTO_INCREMENT,
  `UserLike` int DEFAULT NULL,
  `MessageLike` int DEFAULT NULL,
  PRIMARY KEY (`idLike`),
  KEY `UserLike` (`UserLike`),
  KEY `MessageLike` (`MessageLike`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `idMessage` int NOT NULL AUTO_INCREMENT,
  `MessageText` varchar(230) DEFAULT NULL,
  `MessageDate` datetime DEFAULT NULL,
  `idUser` int NOT NULL,
  `MessageImage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idMessage`),
  KEY `idUser` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`idMessage`, `MessageText`, `MessageDate`, `idUser`, `MessageImage`) VALUES
(2, 'Bienvenue Petit Kenzo N\'oublie pas de faire l\'update sépare les controleurs de l\'update email & password de celui de l\'image de l\'utilisateur . Je serais dispo dans la soirée si tu veut pas avant malheureusement💻 ', '2023-05-29 00:28:29', 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `UserName` varchar(45) NOT NULL,
  `UserEmail` varchar(150) NOT NULL,
  `UserPassword` varchar(150) NOT NULL,
  `UserProfileImage` varchar(255) DEFAULT NULL,
  `UserRoles` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `UserEmail_UNIQUE` (`UserEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`idUser`, `UserName`, `UserEmail`, `UserPassword`, `UserProfileImage`, `UserRoles`) VALUES
(1, 'Aymerick', 'aymericksh@gmail.com', '$2a$08$zgE52.aKmtZ.K3BbmzimPu7rAtAFIRuxuibhuiz7gRyLJqHoSeGde', 'images.jpg', 'admin'),
(2, 'Kenzo', 'splatoon92000@gmail.com', '$2a$08$c8MuAxWwrSCfMe9MKDs4a.5d.gl0HV/94zGoBKfzuOINt8wt1qBqa', 'Kenzo.jpg', NULL);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD CONSTRAINT `fk_commentaires_messages` FOREIGN KEY (`idMessage`) REFERENCES `messages` (`idMessage`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_commentaires_users` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;

--
-- Contraintes pour la table `dislikes`
--
ALTER TABLE `dislikes`
  ADD CONSTRAINT `fk_dislikes_commentaires` FOREIGN KEY (`PostDislike`) REFERENCES `commentaires` (`idComment`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dislikes_users` FOREIGN KEY (`UserDislike`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `fk_likes_commentaires` FOREIGN KEY (`PostLike`) REFERENCES `commentaires` (`idComment`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_likes_users` FOREIGN KEY (`UserLike`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messagedislikes`
--
ALTER TABLE `messagedislikes`
  ADD CONSTRAINT `fk_messagedislikes_messages` FOREIGN KEY (`MessageDislike`) REFERENCES `messages` (`idMessage`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_messagedislikes_users` FOREIGN KEY (`UserDislike`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messagelikes`
--
ALTER TABLE `messagelikes`
  ADD CONSTRAINT `fk_messagelikes_messages` FOREIGN KEY (`MessageLike`) REFERENCES `messages` (`idMessage`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_messagelikes_users` FOREIGN KEY (`UserLike`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_messages_users` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
