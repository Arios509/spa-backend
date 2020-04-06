const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const config = require('../configs/config');
const customer_controller = require('../controllers/customer.controller');
const user_controller = require('../controllers/user.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/customer', customer_controller.getData);
router.post('/customer', customer_controller.createData);
router.put('/customer', customer_controller.updateData);
router.delete('/customer', customer_controller.deleteData);




// User
router.post('/register', user_controller.registerUser);
router.post('/login', user_controller.loginUser);

// Verify token
// AUthorization : Bearer <token>
validateUser = (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    // check the bearer is undefined
    const bearerToken = bearerHeader && bearerHeader.split(' ')[1];
    if(bearerToken === null) return res.sendStatus(401);
    jwt.verify(bearerToken, config.ACCESS_TOKEN, (err, user)=> {
        if(err) return res.status(403).send({message:err})
        req.user = user;
        next()
    })

}

module.exports = router;