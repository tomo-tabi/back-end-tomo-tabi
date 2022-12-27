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
  if (!email.match(REGEX.EMAIL)) return res.status(400).send('Invalid email');

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
    if (data.length) return res.status(409).send('email already exists');

    // else move on to the next function
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  emailFormat,
  emailNotExists,
};