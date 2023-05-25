const express = require('express');

const router = express.Router();

router.get('/' , (req,res) =>{
    const messages = req.session.messages;
    req.session.messages = null; // Réinitialise le message après l'avoir récupéré

    res.render('index', { messages });
});




module.exports = router;