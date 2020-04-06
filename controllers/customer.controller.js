const dbs = require('../modules/database.module')

// Get the data and push in array and return to the route

get = () => {
    return new Promise((resolve, reject) => {
        dbs.all("SELECT * FROM customer_tbl", function (err, rows) {
            console.log('Connected to database')
            resolve(rows);
        });
    })

}

//Write data into database
const insertSQL = `INSERT INTO customer_tbl(lastname, firstname, company, address, city, postcode, country, joineddate) VALUES (?,?,?,?,?,?,?,?)`;
create = (data) => {
    const datas = [
        data.lastname,
        data.firstname,
        data.company,
        data.address,
        data.city,
        data.postcode,
        data.country,
        data.joineddate
    ]
    return new Promise((resolve, reject) => {
        dbs.run(insertSQL, datas, (res) => {
            if (res) {
                reject(new Error('Failed to add data'))
            }
            resolve('Success')
        })
    })
}

// Update table
const updateSQL = `UPDATE customer_tbl SET lastname= ?, firstname=?, company=?, address=?, city=?, postcode=?, country=?, joineddate=? WHERE id = ?`;
update = (data) => {
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
    return new Promise((resolve, reject) => {
        dbs.run(updateSQL, datas, (res) => {
            if (res) {
                console.log(res)
                reject(new Error('Failed to updatee data'))
            }
            resolve('Success update data')
        })
    })
}

// delete sql
const deleteSQL = `DELETE FROM customer_tbl WHERE id =?`;
remove = (data) => {
    return new Promise((resolve, reject) => {
        dbs.run(deleteSQL, data.id, (res) => {
            if (res) {
                reject(new Error('Failed to delete data'))
            }
            resolve('Success delete data')
        })
    })
}
// async


exports.getData = async (req, res) => {
    const customers = await get();
    res.json(customers)
}

exports.createData = async (req, res) => {
    try {
        const createCustomer = await create(req.body);
        res.status(201).send({ message: 'Success create customer' })

    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

exports.updateData = async (req, res) => {
    try {
        const updateCustomer = await update(req.body);
        res.status(201).send({ message: 'Success update data' })
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}
exports.deleteData = async (req, res) => {
    try {
        const deleteCustomer = await remove(req.body);
        res.status(201).send({ message: deleteCustomer })
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}