const knex = require('../../db/knex');
const {
  handleInternalServerError,
  checkForUndefined,
} = require('../errors/errorController');
const ERROR = require('../errors/errorConstants');
const [LOCKED, UNLOCKED] = [true, false];

/**
 * Respond to a GET request to API_URL/trip/
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response Object containing an array of trips associated with the userid
 */

async function getTrips(req, res) {
  try {
    const { userid } = req.body;

    if (checkForUndefined(userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const tripArray = await knex
      .select('trips.id', 'start_date', 'end_date', 'name')
      .from('trips')
      .join('users_trips', 'trips.id', 'users_trips.trip_id')
      .where('users_trips.user_id', userid)
      .orderBy('start_date', 'asc');

    if (!tripArray.length) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.status(200).json(tripArray);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

async function getTripUsers(req, res) {
  try {
    const { tripid } = req.params;
    const { userid } = req.body;

    if (checkForUndefined(tripid, userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const usersInTrip = await knex('users_trips')
      .join('users', 'users.id', 'user_id')
      .select('users.email', 'users.username')
      .where({ trip_id: tripid });

    if (!usersInTrip.length) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.status(200).json(usersInTrip);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a POST request to API_URL/trip/
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response Object containing the posted trip
 */

async function createTrip(req, res) {
  try {
    const { startDate, endDate, userid, name } = req.body;

    if (checkForUndefined(userid, startDate, endDate, name)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    await knex.transaction(async trx => {
      const tripid = (
        await knex('trips')
          .insert(
            {
              start_date: startDate,
              end_date: endDate,
              name,
              owner_id: userid,
            },
            ['id']
          )
          .transacting(trx)
      )[0].id;

      await knex('users_trips')
        .insert({ user_id: userid, trip_id: tripid })
        .transacting(trx);
    });

    return res.sendStatus(201);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a PUT request to API_URL/trip/:tripID
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response Object containing the updated trip
 */

async function updateTrip(req, res) {
  try {
    const { tripid } = req.params;
    const { startDate, endDate, name } = req.body;

    if (checkForUndefined(tripid, startDate, endDate, name)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const updatedTripId = (
      await knex('trips').where({ id: tripid }).update(
        {
          start_date: startDate,
          end_date: endDate,
          name,
        },
        ['id']
      )
    )[0].id;

    if (!updatedTripId) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a DELETE request to API_URL/trip/tripID by removing
 * the users_trips join table item connecting them.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response status 200
 */
async function deleteTripFromUser(req, res) {
  try {
    const { tripid } = req.params;
    const { userid } = req.body;

    if (checkForUndefined(tripid, userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const numDeleted = await knex('users_trips')
      .where({ trip_id: tripid, user_id: userid })
      .del();

    if (!numDeleted) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a PUT request to API_URL/trip/:tripid/lock
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response status 200
 */

async function lockTrip(req, res) {
  try {
    const { tripid } = req.params;
    const { userid } = req.body;

    if (checkForUndefined(tripid, userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const lockedId = (
      await knex('trips')
        .where({ id: tripid })
        .update({ is_locked: LOCKED }, ['id'])
    )[0].id;

    if (!lockedId) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a PUT request to API_URL/trip/:tripid/unlock
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response status 200
 */

async function unlockTrip(req, res) {
  try {
    const { tripid } = req.params;
    const { userid } = req.body;

    if (checkForUndefined(tripid, userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const lockedId = (
      await knex('trips')
        .where({ id: tripid })
        .update({ is_locked: UNLOCKED }, ['id'])
    )[0].id;

    if (!lockedId) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a GET request to API_URL/trip/:tripid/locked
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response status 200
 */

async function getIsLockedForUser(req, res) {
  try {
    const { userid } = req.body;
    const { tripid } = req.body.tripid ? req.body : req.params;

    if (checkForUndefined(userid, tripid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const { owner_id, is_locked, id } = (
      await knex('trips')
        .where({ id: tripid })
        .select(['owner_id', 'is_locked'])
    )[0];

    if (!id) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    if (owner_id === userid) {
      return res.status(200).json(UNLOCKED);
    }

    if (!is_locked) {
      return res.status(200).json(UNLOCKED);
    }

    return res.status(200).json(LOCKED);
  } catch (error) {
    console.error(error);
    handleInternalServerError(error, res);
  }
}

module.exports = {
  getTrips,
  getTripUsers,
  createTrip,
  updateTrip,
  deleteTripFromUser,
  lockTrip,
  unlockTrip,
  getIsLockedForUser,
};
