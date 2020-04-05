// Server.js
const express = require('express');
const customer = require('./routes/customer.route');
const app = express();
let port = 3000;

// database
const database = require('./modules/database.module');

// request for json body
app.use(express.urlencoded());
app.use(express.json());

// customer route
app.use('/main', customer)
 
app.listen(port, () => {
    console.log('server is up', port)
})
