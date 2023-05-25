const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login' , (req,res) =>{
    res.render('index');
})

module.exports = router;