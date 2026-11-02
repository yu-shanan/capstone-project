const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const { registerUser, loginUser, getMe } = require('../controllers/userController');

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected
router.get('/me', protect, getMe);

module.exports = router;
