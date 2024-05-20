const express = require('express');
const passport = require('../config/passport');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    res.json({ success: true, userId: user.id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, user });
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({ success: true });
});

module.exports = router;
