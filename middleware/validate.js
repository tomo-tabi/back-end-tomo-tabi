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
    // extract email to check from req.body
    const { email } = req.body;

    // Check for a valid email address
    if (!email.match(REGEX.EMAIL)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // convert email to lowercase
    req.body.email = email.toLowerCase();

    // else move on to next function
    next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * checks if email exists and exits the route if it does.
 * @param  {Request}  req
 * @param  {Response} res
 * @param {function} next
 * @returns {undefined}
 */

async function emailNotExists(req, res, next) {
  // extract email to check from req.body
  const { email } = req.body;

  try {
    // Check if the email already exists in the database
    const data = await knex.select('email').from('users').where('email', email);
    if (data.length) {
      return res.status(409).json({ message: 'email already exists' });
    }

    // else move on to the next function
    next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * checks if email exists and exits the route if it does not.
 * @param  {Request}  req
 * @param  {Response} res
 * @param {function} next
 * @returns {undefined}
 */

async function emailExists(req, res, next) {
  // extract email to check from req.body
  const { email } = req.body;

  try {
    // Check if the email already exists in the database
    const data = await knex.select('email').from('users').where('email', email);
    if (!data.length) {
      return res.status(404).json({ message: 'email not found' });
    }

    // else move on to the next function
    next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function userToTrip(req, res, next) {
  try {
    // extract user and trip from req.body or req.params
    const { userid } = req.body;
    const { tripid } = req.body.tripid ? req.body : req.params;

    // check if pair exists
    const exists = await knex
      .select(null)
      .from('users_trips')
      .where({ user_id: userid, trip_id: tripid });

    // if no connection response with status code 403
    if (!exists.length) {
      return res
        .status(403)
        .json({ message: 'user not authorized for this trip' });
    }

    // all is well
    next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  emailFormat,
  emailNotExists,
  emailExists,
  userToTrip,
};
