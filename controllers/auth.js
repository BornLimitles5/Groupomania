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
            return res.status(400).render('login', {
                message: 'Please fill in all fields',
            });
        }

        db.query('SELECT * FROM users WHERE UserEmail = ?', [email], async (error, results) => {
            if (!results || results.length === 0) {
                res.status(401).render('login', {
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

                    // Redirect to the index page
                    res.status(200).redirect('/');
                } else {
                    res.status(401).render('login', {
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

exports.logout = (req, res) => {
    // Clear the session token
    req.session.token = null;

    // Redirect to the homepage or any desired route
    res.redirect('/');
};


