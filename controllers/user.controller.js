const db = require('../modules/database.module')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../configs/config.js');
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
    if (checkNewUser.length !== 0) {
        try {

            db.each(`SELECT * FROM user_tbl WHERE username = ?`, [data.username], (async (err, rows) => {
                const username = data.username;

                if (await bcrypt.compare(data.password, rows.password)) {
                    const accessToken = generateAccessToken(username)
                    const refreshToken = jwt.sign({ username }, config.REFRESH_TOKEN)
                    db.run(`INSERT INTO token_tbl (refreshtoken) VALUES (?)`, [refreshToken]);
                    res.status(201).send({ message: 'Login successfull', accessToken, refreshToken })
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

// Generate token
generateAccessToken = (user) => {
    return jwt.sign({ user }, config.ACCESS_TOKEN, { expiresIn: '10m' });
}

// Refresh token function
refreshToken = (req, res) => {

    const refreshToken = req.body.token;
    if (refreshToken === null) return res.sendStatus(401)
    db.all(`SELECT * FROM token_tbl WHERE refreshtoken = ?`, [refreshToken], ((err, rows) => {
        if (rows.length === 0) {
            return res.sendStatus(403)
        } else {
            jwt.verify(refreshToken, config.REFRESH_TOKEN, (err, user) => {
                if (err) return res.status(403).send(err)
                const accessToken = generateAccessToken({ name: user.username });
                res.json({ accessToken })
            })
        }
    }))
}

// Logout user
logoutUser = (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) return res.sendStatus(401)
    db.all(`DELETE FROM token_tbl WHERE refreshtoken = ?`, [refreshToken], ((err, rows) => {
        if (err) return res.sendStatus(403)
        res.status(204).send({ message: 'Success logout' })

    }))
}

// Export function
exports.registerUser = async (req, res) => {
    const registerFunction = await register(req.body, res);
}

exports.loginUser = async (req, res) => {
    const loginFunction = await login(req.body, res)
}

// Refresh token
exports.token = (req, res) => {
    const refreshTokenFunction = refreshToken(req, res)
    //    console.log('here')
}

exports.logout = (req, res) => {
    const logoutFunction = logoutUser(req, res);
}