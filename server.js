// Server.js
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const cors=require('cors');
// routes
const customer = require('./routes/customer.route');
const auth = require('./routes/auth.route')
let port = 3000;

app.use(cors({origin:true,credentials: true}));
// database
// const database = require('./modules/database.module');

// request for json body
app.use(express.urlencoded());
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
// customer route
app.use('/main', validateUser, customer);
app.use('/user', auth);

app.listen(port, () => {
    console.log('server is up', port)
})
