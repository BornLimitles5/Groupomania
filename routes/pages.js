const express = require('express');
const { isLoggedIn } = require('../controllers/auth');
const router = express.Router();
const { fetchMessages } = require('../controllers/auth');

// Route handler for the homepage
router.get('/', isLoggedIn , fetchMessages, (req, res) => {
  const messages = req.session.messages;
  req.session.messages = null; // Reset the message after retrieving it
  const message = req.session.message;
  req.session.message = null; // Reset the message after retrieving it
  const socketmessages = req.session.socketmessages;
  req.session.socketmessages = null;
  const user = req.user;
  res.render('index', { socketmessages ,message ,messages, user});
});

// Gg Kenzo Revoie la fonction IsLoggedIn Indice Ligne 2
router.get('/profile', isLoggedIn,(req, res) => {
  const messages = req.session.messages;
  req.session.messages = null; // Reset the message after retrieving it

  const user = req.user;
  if (user) {
    res.render('profile', { messages, user });
  } else {
    res.redirect('/');
  }
});


// C'est Magique
router.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = router;
