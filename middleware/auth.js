// JWT verification
require('dotenv').config({ path: '../../.env' });
const jwt = require('jsonwebtoken');
const {
  handleInternalServerError,
  checkForUndefined,
} = require('../controllers/errors/errorController');
const ERROR = require('../controllers/errors/errorConstants');

function createToken(userid) {
  const token = jwt.sign(
    { userid },
    process.env.ACCESS_TOKEN_SECRET || 'my secret',
    { expiresIn: '7d' }
  );
  return token;
}

function authenticateToken(req, res, next) {
  try {
    if (checkForUndefined(req.headers.authorization)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }
    const token = req.headers.authorization.split(' ')[1];

    const { userid } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (userid) {
      req.body.userid = userid;
      return next();
    }

    return res.sendStatus(401);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

module.exports = {
  createToken,
  authenticateToken,
};
