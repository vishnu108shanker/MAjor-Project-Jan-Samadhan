const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route  /api/auth/register
router.post('/register', authController.register);

// Login route   /api/auth/login
router.post('/login', authController.login);

module.exports = router;
