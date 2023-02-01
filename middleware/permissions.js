require('dotenv').config({ path: '../../.env' });
const {
  handleInternalServerError,
  checkForUndefined,
} = require('../controllers/errors/errorController');
const ERROR = require('../controllers/errors/errorConstants');
const knex = require('../db/knex');

async function exitOnLocked(req, res, next) {
  try {
    const { userid } = req.body;
    const { tripid } = req.body.tripid ? req.body : req.params;

    if (checkForUndefined(userid, tripid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const { owner_id, is_locked } = (
      await knex('trips')
        .where({ id: tripid })
        .select(['is_locked', 'owner_id'])
    )[0];

    if (owner_id === userid) {
      return next();
    }

    if (!is_locked) {
      return next();
    }

    return res.status(403).json({ message: 'not authorized to edit trip' });
  } catch (error) {
    console.error(error);
    handleInternalServerError(error, res);
  }
}

async function isOwner(req, res, next) {
  try {
    const { userid } = req.body;
    const { tripid } = req.body.tripid ? req.body : req.params;

    if (checkForUndefined(userid, tripid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const { owner_id } = (
      await knex('trips').where({ id: tripid }).select(['owner_id'])
    )[0];

    if (owner_id === userid) {
      return next();
    }

    return res.status(403).json({ message: 'not authorized' });
  } catch (error) {
    console.error(error);
    handleInternalServerError(error, res);
  }
}

module.exports = {
  exitOnLocked,
  isOwner,
};
