// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');

// @route   POST /auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  User.findOne({ username })
    .then(user => {
      if (user) {
        return res.status(400).json({ error: 'Username already exists' });
      } else {
        const newUser = new User({
          username,
          password
        });

        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                // Create JWT payload
                const payload = { id: user.id, username: user.username };

                // Sign token
                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  { expiresIn: 3600 }, // 1 hour in seconds
                  (err, token) => {
                    res.json({
                      success: true,
                      token: 'Bearer ' + token
                    });
                  }
                );
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// @route   POST /auth/login
// @desc    Login user and return JWT token
// @access  Public
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  User.findOne({ username })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'Username not found' });
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User matched, create JWT payload
            const payload = { id: user.id, username: user.username };

            // Sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 }, // 1 hour in seconds
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              }
            );
          } else {
            return res.status(400).json({ error: 'Password incorrect' });
          }
        });
    });
});

module.exports = router;
