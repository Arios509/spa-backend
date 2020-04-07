const dbs = require('../modules/database.module')


// Check data exist 
const checkData = (id) => {
    return new Promise((resolve, reject) => {
        dbs.all("SELECT * FROM customer_tbl where id =?", [id], (err, rows) => {
            resolve(rows)
        });
    })
}

// Get the data and push in array and return to the route
get = (req) => {
    const userId = req.user.id;
    console.log('get request ', req.user)
    console.log(req.user)
    return new Promise((resolve, reject) => {
        dbs.all("SELECT * FROM customer_tbl WHERE createdbyid = ?", [userId], ((err, rows) => {
            console.log('Connected to database')
            resolve(rows);
        }));
    })

}

// Write data into database
// Create data with creator name and ID
const insertSQL = `INSERT INTO customer_tbl
(lastname, firstname, company, address, city, postcode, country, joineddate, createdbyid, createdbyname) 
VALUES (?,?,?,?,?,?,?,?,?,?)`;
create = (req) => {
    const datas = [
        req.body.lastname,
        req.body.firstname,
        req.body.company,
        req.body.address,
        req.body.city,
        req.body.postcode,
        req.body.country,
        req.body.joineddate,
        req.user.id,
        req.user.name
    ]
    return new Promise((resolve, reject) => {
        dbs.all(insertSQL, datas, ((err, rows) => {
            console.log(rows)
            if (err) {
                reject(new Error(err))
            }
            resolve('Success')
        }))
    })
}

// Update table
const updateSQL = `UPDATE customer_tbl SET 
lastname= ?, firstname=?, company=?, address=?,
 city=?, postcode=?, country=?, joineddate=? WHERE id = ?`;
update = async (data, res) => {
    console.log('This is data ', data)
    const datas = [
        data.lastname,
        data.firstname,
        data.company,
        data.address,
        data.city,
        data.postcode,
        data.country,
        data.joineddate,
        data.id
    ]
    console.log(datas)
    const checkCustomer = await checkData(data.id);
    console.log('found data', checkCustomer)
    if (checkCustomer.length === 0) { res.sendStatus(400) }
    else {
        return new Promise((resolve, reject) => {
            dbs.all(updateSQL, datas, ((err, rows) => {

                if (err) {
                    res.status(400).send({ message: 'Failed to updatee data' })
                }
                res.status(201).send({ message: 'Success upddate data' })
            }))
        })
    }

}

// delete sql
const deleteSQL = `DELETE FROM customer_tbl WHERE id =?`;
remove = (data) => {
    return new Promise((resolve, reject) => {
        dbs.run(deleteSQL, data.params.id, (res) => {
            if (res) {
                reject(new Error('Failed to delete data'))
            }
            resolve('Success delete data')
        })
    })
}
// async


exports.getData = async (req, res) => {
    const customers = await get(req);
    res.status(201).send(customers)
}

exports.createData = async (req, res) => {
    try {
        const createCustomer = await create(req);
        res.status(201).send({ message: 'Success create customer' })

    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

exports.updateData = async (req, res) => {
    const updateCustomer = await update(req.body, res);

}
exports.deleteData = async (req, res) => {
    console.log(req)
    try {
        const deleteCustomer = await remove(req);
        res.status(201).send({ message: deleteCustomer })
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}