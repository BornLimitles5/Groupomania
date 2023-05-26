const express = require('express');
const { isLoggedIn } = require('../controllers/auth');
const router = express.Router();

// Route handler for the homepage
router.get('/', isLoggedIn, (req, res) => {
  const messages = req.session.messages;
  req.session.messages = null; // Reset the message after retrieving it

    const user = req.user;
    res.render('index', { messages, user });
    console.log(user);
});

// Other routes...
router.get('/profile', isLoggedIn, (req, res) => {
  // Access req.user here
  
    res.render('profile');
   
});

module.exports = router;
