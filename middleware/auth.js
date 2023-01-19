// JWT verification
require('dotenv').config({ path: '../../.env' });
const jwt = require('jsonwebtoken');

// CREATE TOKEN

const createToken = (userid) => {
  const token = jwt.sign(
    { userid },
    process.env.ACCESS_TOKEN_SECRET || 'my secret',
    { expiresIn: '7d' },
  );
  return token;
};

// AUTHENTICATE TOKEN

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  // if token is not present user is not authorized
  if (!token) {
    return res.status(401).json({ message: 'token not found' });
  }

  try {
    const { userid } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.userid = userid;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: 'invalid or expired token' });
  }
};

module.exports = {
  createToken,
  authenticateToken,
};
