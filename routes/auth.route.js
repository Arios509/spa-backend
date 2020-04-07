const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth.controller')

// User
router.post('/register', auth_controller.registerUser);
router.post('/login', auth_controller.loginUser);
router.post('/token', auth_controller.token);
router.post('/logout', auth_controller.logout);
module.exports = router;