-- Create the 'groupomania' database
CREATE DATABASE IF NOT EXISTS groupomania;

-- Use the 'groupomania' database
USE groupomania;

-- Create the 'users' table
CREATE TABLE IF NOT EXISTS users (
  idUser INT NOT NULL AUTO_INCREMENT,
  UserName VARCHAR(45) NOT NULL,
  UserEmail VARCHAR(150) NOT NULL,
  UserPassword VARCHAR(150) NOT NULL,
  UserProfileImage VARCHAR(255) DEFAULT NULL,
  UserRoles VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (idUser),
  UNIQUE KEY UserEmail_UNIQUE (UserEmail)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- Create the 'commentaires' table
CREATE TABLE IF NOT EXISTS commentaires (
  idPost INT NOT NULL AUTO_INCREMENT,
  PostTexte VARCHAR(230) DEFAULT NULL,
  PostImg VARCHAR(255) DEFAULT NULL,
  PostDate DATE DEFAULT NULL,
  idUser INT NOT NULL,
  PRIMARY KEY (idPost),
  FOREIGN KEY (idUser) REFERENCES users (idUser) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the 'messages' table
CREATE TABLE IF NOT EXISTS messages (
  idMessage INT NOT NULL AUTO_INCREMENT,
  MessageText VARCHAR(230) DEFAULT NULL,
  MessageDate DATE DEFAULT NULL,
  idUser INT NOT NULL,
  MessageImage VARCHAR(255) NOT NULL,
  PRIMARY KEY (idMessage),
  FOREIGN KEY (idUser) REFERENCES users (idUser) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Create the 'dislikes' table
CREATE TABLE IF NOT EXISTS dislikes (
  idDislike INT NOT NULL AUTO_INCREMENT,
  UserDislike INT DEFAULT NULL,
  PostDislike INT DEFAULT NULL,
  PRIMARY KEY (idDislike),
  FOREIGN KEY (UserDislike) REFERENCES users (idUser) ON DELETE CASCADE,
  FOREIGN KEY (PostDislike) REFERENCES commentaires (idPost) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the 'likes' table
CREATE TABLE IF NOT EXISTS likes (
  idLike INT NOT NULL AUTO_INCREMENT,
  UserLike INT DEFAULT NULL,
  PostLike INT DEFAULT NULL,
  PRIMARY KEY (idLike),
  FOREIGN KEY (UserLike) REFERENCES users (idUser) ON DELETE CASCADE,
  FOREIGN KEY (PostLike) REFERENCES commentaires (idPost) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the 'messagedislikes' table
CREATE TABLE IF NOT EXISTS messagedislikes (
  idDislike INT NOT NULL AUTO_INCREMENT,
  UserDislike INT DEFAULT NULL,
  MessageDislike INT DEFAULT NULL,
  PRIMARY KEY (idDislike),
  FOREIGN KEY (UserDislike) REFERENCES users (idUser) ON DELETE CASCADE,
  FOREIGN KEY (MessageDislike) REFERENCES messages (idMessage) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the 'messagelikes' table
CREATE TABLE IF NOT EXISTS messagelikes (
  idLike INT NOT NULL AUTO_INCREMENT,
  UserLike INT DEFAULT NULL,
  MessageLike INT DEFAULT NULL,
  PRIMARY KEY (idLike),
  FOREIGN KEY (UserLike) REFERENCES users (idUser) ON DELETE CASCADE,
  FOREIGN KEY (MessageLike) REFERENCES messages (idMessage) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
