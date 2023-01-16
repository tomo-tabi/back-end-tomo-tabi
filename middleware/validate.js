const knex = require('../db/knex');
const { REGEX } = require('../utils/constants');

/**
 * checks req.body.email param for validity
 * @param  {Request}  req
 * @param  {Response} res
 * @param {function} next
 * @returns {undefined}
 */

const emailFormat = function (req, res, next) {
  // extract email to check from req.body
  const { email } = req.body;

  // Check for a valid email address
  if (!email.match(REGEX.EMAIL))
    return res.status(400).json({ message: 'Invalid email' });

  // else move on to next function
  next();
};

/**
 * checks if req.body.email already exists in the database
 * @param  {Request}  req
 * @param  {Response} res
 * @param {function} next
 * @returns {undefined}
 */

const emailNotExists = async function (req, res, next) {
  // extract email to check from req.body
  const { email } = req.body;

  try {
    // Check if the email already exists in the database
    const data = await knex.select('email').from('users').where('email', email);
    if (data.length)
      return res.status(409).json({ message: 'email already exists' });

    // else move on to the next function
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const emailExists = async function (req, res, next) {
  // extract email to check from req.body
  const { email } = req.body;

  try {
    // Check if the email already exists in the database
    const data = await knex.select('email').from('users').where('email', email);
    if (!data.length)
      return res.status(404).json({ message: 'email not found' });

    // else move on to the next function
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const userToTrip = async function (req, res, next) {
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
    if (!exists.length)
      return res
        .status(403)
        .json({ message: 'user not authorized for this trip' });

    // all is well
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  emailFormat,
  emailNotExists,
  emailExists,
  userToTrip,
};
