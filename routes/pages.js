const express = require('express');
const { isLoggedIn } = require('../controllers/auth');
const router = express.Router();

// Route handler for the homepage
router.get('/', isLoggedIn , (req, res) => {
  const messages = req.session.messages;
  req.session.messages = null; // Reset the message after retrieving it

  const user = req.user;
  res.render('index', { messages, user, SocketMessage: 'Your Socket.IO message' });
});

// Gg Kenzo Revoie la fonction IsLoggedIn Indice Ligne 2
router.get('/profile', isLoggedIn, (req, res) => {
  const messages = req.session.messages;
  req.session.messages = null; // Reset the message after retrieving it

  const user = req.user;
  if (user) {
    res.render('profile', { messages, user });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
