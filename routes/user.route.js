const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user.controller')

// User
router.post('/register', user_controller.registerUser);
router.post('/login', user_controller.loginUser);
router.post('/token', user_controller.token);
router.delete('/logout', user_controller.logout);
module.exports = router;