// JWT verification
require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');

// CREATE TOKEN

const createToken = user => {
  const accessToken = sign(
    { username: user.username, userid: user.id },
    process.env.ACCESS_TOKEN_SECRET
  );
  return { accessToken: accessToken };
};

// AUTHENTICATE TOKEN

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  // if token is not present user is not authorized
  if (!token) {
    return res.status(401).send('token not found');
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = { createToken, authenticateToken };
