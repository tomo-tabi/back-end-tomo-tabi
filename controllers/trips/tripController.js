const knex = require('../../db/knex');

/**
 * Respond to a GET request to API_URL/trip/
 * @todo #63 add limit version
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response Object containing an array of trips associated with the userid
 */

async function getTrips(req, res) {
  try {
    const { userid } = req.body;

    if (!userid) {
      return res.status(500).json({ message: 'user id is not defined' });
    }

    const tripArray = await knex
      .select('trips.id', 'start_date', 'end_date', 'name')
      .from('trips')
      .join('users_trips', 'trips.id', 'users_trips.trip_id')
      .where('users_trips.user_id', userid)
      .orderBy('start_date', 'asc');

    if (!tripArray.length) {
      return res.status(404).json({ message: 'not found' });
    }

    return res.status(200).json(tripArray);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getTripUsers(req, res) {
  try {
    const { tripid } = req.params;
    const { userid } = req.body;

    if (!tripid || !userid) {
      return res.status(500).json({ message: 'user id is not defined' });
    }

    const usersInTrip = await knex('users_trips')
      .join('users', 'users.id', 'user_id')
      .select('users.email', 'users.username')
      .where({ trip_id: tripid });

    if (!usersInTrip.length) {
      return res.status(404).json({ message: 'not found' });
    }

    return res.status(200).json(usersInTrip);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
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

    if (!userid || !startDate || !endDate || !name) {
      return res.status(500).json({ message: 'required info is not defined' });
    }

    const tripArray = await knex.transaction(async trx => {
      const tripInsert = await knex('trips')
        .insert({
          start_date: startDate,
          end_date: endDate,
          name,
        })
        .returning('*')
        .transacting(trx);

      await knex('users_trips')
        .returning('*')
        .insert({ user_id: userid, trip_id: tripInsert[0].id })
        .transacting(trx);

      return tripInsert;
    });

    if (!tripArray.length) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.sendStatus(201);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
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

    if (!tripid || !startDate || !endDate || !name) {
      return res.status(500).json({ message: 'required info is not defined' });
    }

    const tripArray = await knex('trips')
      .where({ id: tripid })
      .update({
        start_date: startDate,
        end_date: endDate,
        name,
      })
      .returning('*');

    if (!tripArray.length) {
      return res.status(404).json({ message: 'item not found' });
    }

    return res.sendStatus(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * Respond to a DELETE request to API_URL/trip/tripID by removing
 * the users_trips join table item connecting them.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response status 200
 */
async function deleteTrip(req, res) {
  try {
    const { tripid } = req.params;
    const { userid } = req.body;

    if (!tripid || !userid) {
      return res.status(500).json({ message: 'required info is not defined' });
    }

    const data = await knex('users_trips')
      .where({ trip_id: tripid, user_id: userid })
      .del(['id']);

    if (!data.length) {
      return res.status(404).json({ message: 'item not found' });
    }

    return res.sendStatus(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getTrips,
  getTripUsers,
  createTrip,
  updateTrip,
  deleteTrip,
};
