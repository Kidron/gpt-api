// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = {
  async register(req, res) {
    const { email, password } = req.body;
    console.log('Email:', email, 'Password:', password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { user, error } = await User.createUser({ email, password: hashedPassword });

    if (error) {
      return res.status(400).json({ message: 'Error registering user', error });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in after registration', err });
      }
      return res.status(201).json({ message: 'User registered and logged in', user });
    });
  },

  login(req, res) {
    res.status(200).json({ message: 'User logged in', user: req.user });
  },

  logout(req, res) {
    req.logout();
    res.status(200).json({ message: 'User logged out' });
  },
};
