const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const { validationResult } = require('express-validator');
const { log } = require("console");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

//~Jolie Regex~
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{12,}$/;

exports.register = async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('index', {
            message: 'Erreur de validation',
            errors: errors.array()
        });
    }

    // Valider le format de l'e-mail en utilisant une expression régulière
    if (!emailRegex.test(email)) {
        return res.status(422).render('index', {
            message: 'Format d\'e-mail invalide',
        });
    }

    // Valider la force du mot de passe en utilisant une expression régulière
    if (!passwordRegex.test(password)) {
        return res.status(422).render('index', {
            message: 'Le mot de passe doit contenir au moins 12 caractères, une lettre majuscule, une lettre minuscule, un caractère spécial et un chiffre',
        });
    }

    // Valider si le mot de passe et la confirmation du mot de passe correspondent
    if (password !== passwordConfirm) {
        return res.status(422).render('index', {
            message: 'Les mots de passe ne correspondent pas',
        });
    }

    try {
        const duplicateUser = await db.query('SELECT UserEmail FROM user WHERE UserEmail = ?', [email]);
        if (duplicateUser.length > 0) {
            return res.status(422).render('index', {
                message: 'Cet e-mail est déjà utilisé',
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 8);

        const newUser = {
            UserName: name,
            UserEmail: email,
            Userpassword: hashedPassword,
        };

        try {
            const result = await db.query('INSERT INTO user SET ?', newUser);
            req.session.messages = 'Compte enregistré avec succès';
            return res.redirect('/');
        } catch (error) {
            console.log(error);
            return res.status(500).render('index', {
                message: 'Erreur',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).render('index', {
            message: 'Erreur',
        });
    }
};
