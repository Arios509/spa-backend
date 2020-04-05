const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const customer_controller = require('../controllers/customer.controller');
const user_controller = require('../controllers/user.controller')
// a simple test url to check that all of our files are communicating correctly.
router.get('/customer', customer_controller.getData);
router.post('/customer', customer_controller.createData);
router.put('/customer', customer_controller.updateData);
router.delete('/customer', customer_controller.deleteData);




// User
router.post('/register', user_controller.registerUser);
router.post('/login', user_controller.loginUser);
module.exports = router;