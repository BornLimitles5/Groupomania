const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const { validationResult } = require('express-validator');
const { log } = require("console");
const session = require('express-session');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    charset: 'utf8mb4'
});

//~Jolie Regex~
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{12,}$/;

// Register Et Regex Nickel
exports.register = (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    // Vérification de la validité de l'email
    if (!emailRegex.test(email)) {
        return res.render('index', {
            message: 'Format d\'e-mail invalide',
        });
    }

    // Vérification de la force du mot de passe
    if (!passwordRegex.test(password)) {
        return res.render('index', {
            message: 'Le mot de passe doit contenir au moins 12 caractères, une lettre majuscule, une lettre minuscule, un caractère spécial et un chiffre',
        });
    }

    // Vérification de la correspondance entre le mot de passe et sa confirmation
    if (password !== passwordConfirm) {
        return res.render('index', {
            message: 'Les mots de passe ne correspondent pas',
        });
    }

    db.query('SELECT UserEmail FROM users WHERE UserEmail = ?', email, async (error, results) => {
        if (error) {
            console.log(error);
            return res.render('index', {
                message: 'Erreur lors de la vérification de l\'e-mail',
            });
        }

        if (results.length > 0) {
            return res.render('index', {
                message: 'Cet e-mail est déjà utilisé',
            });
        } else {
            try {
                let hashedPassword = await bcryptjs.hash(password, 8);
                db.query('INSERT INTO users SET ?', { UserName: name, UserEmail: email, UserPassword: hashedPassword }, (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.render('index', {
                            message: 'Erreur lors de l\'enregistrement de l\'utilisateur',
                        });
                    }
                    return res.render('index', {
                        messages: 'Utilisateur enregistré',
                    });
                });
            } catch (error) {
                console.log(error);
                return res.render('index', {
                    message: 'Erreur lors du hachage du mot de passe',
                });
            }
        }
    });
};

//Login et Stockage dans la session
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('index', {
        message: 'Please fill in all fields',
      });
    }

    db.query('SELECT * FROM users WHERE UserEmail = ?', [email], async (error, results) => {
      if (!results || results.length === 0) {
        res.status(401).render('index', {
          message: 'Email or Password incorrect',
        });
      } else {
        const isPasswordMatch = await bcryptjs.compare(password, results[0].UserPassword);

        if (isPasswordMatch) {
          const id = results[0].idUser;

          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          // Store the token in the session
          req.session.token = token;

          // Store the success message in the session
          req.session.message = 'Login successful';

          // Redirect to the index page
          res.status(200).redirect('/');
        } else {
          res.status(401).render('index', {
            message: 'Email or Password incorrect',
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};


// Verification Du Stockage en Session du tokken
exports.isLoggedIn = async (req, res, next) => {
    if (req.session.token) {
        try {
            // Verify the token
            const decoded = await promisify(jwt.verify)(req.session.token, process.env.JWT_SECRET);

            // Find the user using your custom MySQL query
            db.query('SELECT * FROM users WHERE idUser = ?', [decoded.id], (error, result) => {
                if (!result || result.length === 0) {
                    return next();
                }

                // Set req.user to the user retrieved from the database
                req.user = result[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
};

// Logout via un Post de User
exports.logout = (req, res) => {
  // Clear the session token
  req.session.token = null;

  // Store the success message in the session
  req.session.message = 'Logout successful';

  // Redirect to the homepage or any desired route
  res.status(200).redirect('/');
};


//Meesage Without Socket.io
exports.postMessage = async (req, res) => {
    try {
      const { messageText } = req.body;
      const userId = req.query.userId;
      const imageFile = req.file;
  
      if (!userId) {
        req.session.message = 'Please provide a user ID';
        return res.redirect('/');
      }
  
      if (messageText && imageFile) {
        // Both text and image message
        // Save the message to the database with the user's ID, message text, and image filename
        db.query(
          'INSERT INTO messages (MessageText, MessageDate, idUser, MessageImage) VALUES (?, NOW(), ?, ?)',
          [messageText, userId, imageFile.filename],
          (error) => {
            if (error) {
              console.log(error);
              req.session.message = 'Error saving the message';
              return res.redirect('/');
            }
  
            req.session.message = 'Message posted successfully';
            res.status(200).redirect('/');
          }
        );
      } else if (messageText) {
        // Text message only
        // Save the message to the database with the user's ID and message text
        db.query(
          'INSERT INTO messages (MessageText, MessageDate, idUser) VALUES (?, NOW(), ?)',
          [messageText, userId],
          (error) => {
            if (error) {
              console.log(error);
              req.session.message = 'Error saving the message';
              return res.redirect('/');
            }
  
            req.session.messages = 'Message posted successfully';
            return res.redirect('/');
          }
        );
      } else if (imageFile) {
        // Image message only
        // Save the message to the database with the user's ID and image filename
        db.query(
          'INSERT INTO messages (MessageDate, idUser, MessageImage) VALUES (NOW(), ?, ?)',
          [userId, imageFile.filename],
          (error) => {
            if (error) {
              console.log(error);
              req.session.message = 'Error saving the message';
              return res.redirect('/');
            }
  
            req.session.messages = 'Message posted successfully';
            return res.redirect('/');
          }
        );
      } else {
        req.session.message = 'Please enter a message or upload an image';
        return res.redirect('/');
      }
    } catch (error) {
      console.log(error);
      req.session.message = 'Error posting the message';
      return res.redirect('/');
    }
};

exports.fetchMessages = async (req, res, next) => {
  try {
    // Fetch messages from the database with user information
    db.query(
      'SELECT m.idMessage, m.MessageText, m.MessageDate, m.MessageImage, u.UserName, u.UserProfileImage FROM messages m JOIN users u ON m.idUser = u.idUser ORDER BY m.idMessage DESC',
      (error, results) => {
        if (error) {
          console.log(error);
          req.session.message = 'Failed to fetch messages';
          return res.redirect('/');
        }

        // Store the fetched messages in the session
        const socketmessages = results.map((message) => {
          const currentDate = new Date();
          const messageDate = new Date(message.MessageDate);
          const timeDifference = currentDate.getTime() - messageDate.getTime();
          const seconds = Math.floor(timeDifference / 1000);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);
          const days = Math.floor(hours / 24);

          let formattedDate = '';

          if (days > 0) {
            formattedDate = `Envoyé le ${messageDate.toLocaleDateString()}`;
          } else if (hours > 0) {
            formattedDate = `Envoyé il y a ${hours} heure(s)`;
          } else if (minutes > 0) {
            formattedDate = `Envoyé il y a ${minutes} minute(s)`;
          } else {
            formattedDate = `Envoyé il y a ${seconds} seconde(s)`;
          }

          return {
            SocketMessage: message.MessageText,
            idMessage: message.idMessage,
            MessageDate: formattedDate,
            MessageImage: message.MessageImage,
            UserName: message.UserName,
            UserProfileImage: message.UserProfileImage,
          };
        });

        req.session.socketmessages = socketmessages;
        // console.log(req.session.socketmessages);
        next();
      }
    );
  } catch (error) {
    console.log(error);
    req.session.message = 'Failed to fetch messages';
    res.redirect('/');
  }
};




