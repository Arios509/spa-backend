// Server.js
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
// routes
const customer = require('./routes/customer.route');
const user = require('./routes/user.route')
let port = 3000;

// database
// const database = require('./modules/database.module');

// request for json body
app.use(express.urlencoded());
app.use(express.json());

// customer route
app.use('/main',validateUser, customer);
app.use('/user', user);


app.listen(port, () => {
    console.log('server is up', port)
})
