const knex = require('../db/knex');
const { REGEX } = require('../utils/constants');

/**
 * checks req.body.email param for validity
 * @param  {Request}  req
 * @param  {Response} res
 * @param {function} next
 * @returns {undefined}
 */

function emailFormat(req, res, next) {
  try {
    const { email } = req.body;

    if (!email.match(REGEX.EMAIL)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    req.body.email = email.toLowerCase();

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * Exits route if email exists
 * @param  {Request}  req
 * @param  {Response} res
 * @param {function} next
 * @returns {undefined}
 */

async function exitOnEmailExists(req, res, next) {
  const { email } = req.body;

  try {
    const emailArray = await knex
      .select('email')
      .from('users')
      .where('email', email);
    if (emailArray.length) {
      return res.status(409).json({ message: 'email already exists' });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * Exits route if email does not exists
 * @param  {Request}  req
 * @param  {Response} res
 * @param {function} next
 * @returns {undefined}
 */

async function exitOnEmailNotExists(req, res, next) {
  const { email } = req.body;

  try {
    const emailArray = await knex
      .select('email')
      .from('users')
      .where('email', email);
    if (!emailArray.length) {
      return res.status(404).json({ message: 'email not found' });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function userToTrip(req, res, next) {
  try {
    const { userid } = req.body;
    const { tripid } = req.body.tripid ? req.body : req.params;

    const userToTripArray = await knex
      .select(null)
      .from('users_trips')
      .where({ user_id: userid, trip_id: tripid });

    if (!userToTripArray.length) {
      return res
        .status(403)
        .json({ message: 'user not authorized for this trip' });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  emailFormat,
  exitOnEmailExists,
  exitOnEmailNotExists,
  userToTrip,
};
