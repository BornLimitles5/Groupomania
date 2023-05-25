const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { Users } = require('../models/models');

//~Jolie Regex~
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{12,}$/;

exports.register = async (req, res) => {
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

    try {
    const duplicateUser = await Users.findOne({
        where: {
        UserEmail: email,
        },
      attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclure les champs createdAt et updatedAt
    });

    if (duplicateUser) {
        return res.render('index', {
        message: 'Cet e-mail est déjà utilisé',
        });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await Users.create(
        {
        UserName: name,
        UserEmail: email,
        UserPassword: hashedPassword,
    },
      { raw: true } // Option raw: true pour exclure les champs supplémentaires
    );

    return res.render('index', {
        messages: 'Utilisateur enregistré',
    });
    } catch (error) {
    console.log(error);
    return res.render('index', {
    message: 'Erreur lors de l\'enregistrement de l\'utilisateur',
    });
}
};
