// JWT verification
require("dotenv").config({ path: "../.env" });
const jwt = require("jsonwebtoken");

// CREATE TOKEN

const createTokens = (user) => {
    const accessToken = sign({ username: user.username, id: user.id }, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
}

// AUTHENTICATE TOKEN

const authenticateToken = (req, res, next) => {
    const header = req.headers['authorization']
    // if header exist return token portion, otherwise return undefined
    const token = header && header.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = { createTokens, authenticateToken }