const express = require('express');
const { isLoggedIn, fetchComments } = require('../controllers/auth');
const router = express.Router();
const { fetchMessages } = require('../controllers/auth');

// Route handler for the homepage
router.get('/', isLoggedIn , fetchMessages, fetchComments, (req, res) => {
  const messages = req.session.messages;
  req.session.messages = null; 
  const message = req.session.message;
  req.session.message = null; 
  const socketmessages = req.session.socketmessages;
  req.session.socketmessages = null;
  const socketComments = req.session.socketComments;
  req.session.socketComments = null;
  const user = req.user;
  res.render('index', { socketComments , socketmessages , message ,messages, user});
});

// 
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

// 
router.get('/edit', isLoggedIn,(req, res) => {
  const messages = req.session.messages;
  req.session.messages = null; // Reset the message after retrieving it

  const user = req.user;
  if (user) {
    res.render('edit', { messages, user });
  } else {
    res.redirect('/');
  }
});


// C'est Magique
router.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = router;
