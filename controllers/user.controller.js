const db = require('../modules/database.module')

const bcrypt = require('bcrypt');
// check user exist 
const checkUser = (user) => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM user_tbl where username =?", user, (err, rows) => {
            resolve(rows)
        });
    })
}

// register users
register = async (data, res) => {
    const checkNewUser = await checkUser(data.username);
    if (checkNewUser.length === 0) {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10)
            db.run(`INSERT INTO user_tbl (username, password) VALUES (?,?) `, [data.username, hashedPassword]);
            res.status(201).send({ message: 'Success' })

        } catch (err) {
            res.status(500).send({ message: err })

        }
    }
    res.status(400).send({ message: 'User existed' })

}

login = async (data, res) => {
    const checkNewUser = await checkUser(data.username);
    const loggedInData = []
    if (checkNewUser.length !== 0) {
        try {
           
            db.each(`SELECT * FROM user_tbl WHERE username = ?`, [data.username], (async(err, rows) => {
                console.log('this is rows', rows.password)
                console.log('this is data', data)
                if (await bcrypt.compare( data.password, rows.password)) {
                    res.send('Login success')
                } else {
                    res.send('Not allowed')
                }
            }));

        } catch (err) {
            res.status(500).send()
        }
    } else {
        res.status(400).send({ message: 'User not found' })
    }

}

exports.registerUser = async (req, res) => {
    const user = await register(req.body, res);
}

exports.loginUser = async (req, res) => {
    const loginUser = await login(req.body, res)
}