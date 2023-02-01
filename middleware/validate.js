const knex = require('../db/knex');
const { REGEX } = require('../utils/constants');
const {
  handleInternalServerError,
  checkForUndefined,
} = require('../controllers/errors/errorController');
const ERROR = require('../controllers/errors/errorConstants');

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

    if (checkForUndefined(email)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    if (!email.match(REGEX.EMAIL)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    req.body.email = email.toLowerCase();

    next();
  } catch (error) {
    return handleInternalServerError(error, res);
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
  try {
    const { email } = req.body;
    const userid = req.body.userid ? req.body.userid : null;

    if (checkForUndefined(email)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const emailUserId = (
      await knex.select('id').from('users').where('email', email)
    )[0].id;

    if (emailUserId === userid) {
      return next();
    }

    if (emailUserId) {
      return res.status(409).json({ message: 'email already exists' });
    }
    return next();
  } catch (error) {
    return handleInternalServerError(error, res);
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
  try {
    const { email } = req.body;

    if (checkForUndefined(email)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }
    const emailArray = await knex
      .select('email')
      .from('users')
      .where('email', email);
    if (!emailArray.length) {
      return res.status(404).json({ message: 'email not found' });
    }

    next();
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

async function userToTrip(req, res, next) {
  try {
    const { userid } = req.body;
    const { tripid } = req.body.tripid ? req.body : req.params;

    if (checkForUndefined(userid, tripid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const userToTripArray = await knex
      .select(null)
      .from('users_trips')
      .where({ user_id: userid, trip_id: tripid });

    if (!userToTripArray.length) {
      return res
        .status(403)
        .json({ message: 'user not authorized for this trip' });
    }

    return next();
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

async function getTripIdFromEventId(req, res, next) {
  try {
    const { eventid } = req.params;

    if (checkForUndefined(eventid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const tripid = await knex('trips_events')
      .select('trip_id')
      .where('id', eventid);

    req.body.tripid = tripid[0].trip_id;

    next();
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

async function userToVote(req, res, next) {
  try {
    const { userid } = req.body;
    const { voteid } = req.params;

    if (checkForUndefined(userid, voteid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const valid = (
      await knex('users_events_vote')
        .select(['id', 'vote'])
        .where({ id: voteid, user_id: userid })
    ).length;

    if (!valid) {
      return res.status(403).json({ message: 'unauthorized' });
    }

    next();
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

module.exports = {
  emailFormat,
  exitOnEmailExists,
  exitOnEmailNotExists,
  userToTrip,
  getTripIdFromEventId,
  userToVote,
};
