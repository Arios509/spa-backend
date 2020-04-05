const sqlite3 = require('sqlite3')

//database
let db = new sqlite3.Database('database/mydb.sqlite3', (err) => {
    if (err) {
        console.log('Error to connect database')
    } else {
        console.log('Database created')
        createTable()
    }
})

const createTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS user_tbl
    (id INTEGER PRIMARY KEY,username varchar(20), password varchar(255));`);
    db.run(`CREATE TABLE IF NOT EXISTS customer_tbl(id INTEGER PRIMARY KEY ,lastname varchar(20) NOT NULL,firstname varchar(20) NOT NULL,company varchar(20),address varchar(50),city varchar(20),postcode int(10),country varchar(20),joineddate varchar(20),date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);`);
}

module.exports = db;