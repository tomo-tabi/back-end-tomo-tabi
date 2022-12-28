const knex = require('../../db/knex');
require('dotenv').config();

/**
 * Respond to a GET request to API_URL/trip/
 * @todo add limit version
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response Object containing an array of trips associated with the userid
 */

const getTrips = async function (req, res) {
  try {
    // extract userid from req.body
    const { userid } = req.body;

    // confirm userid is not undefined
    if (!userid)
      return res.status(500).json({ message: 'user id is not defined' });

    // retrieve all trip information using users_trips join table
    const data = await knex
      .select('trips.id', 'start_date', 'end_date', 'name')
      .from('trips')
      .join('users_trips', 'trips.id', 'users_trips.trip_id')
      .where('users_trips.user_id', userid);

    // if there is no data send 204
    if (!data.length) return res.status(204).json({ message: 'no data' });

    // send the data
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a POST request to API_URL/trip/
 * @todo add limit version
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response Object containing the posted trip
 */

const createTrip = async function (req, res) {
  try {
    // extract required information from req.body
    const { startDate, endDate, userid, name } = req.body;

    // verify all required data is defined
    if (!userid || !startDate || !endDate || !name)
      return res.status(500).json({ message: 'required info is not defined' });

    // insert the data into trips
    const trip = await knex('trips')
      .insert({
        start_date: startDate,
        end_date: endDate,
        name: name,
      })
      .returning('*');

    // if trip insert fails, send status code 500 and exit function
    if (!trip.length) return res.status(500);

    // link the user to the trip on the users_trips join table
    const join = await knex('users_trips')
      .returning('*')
      .insert({ user_id: userid, trip_id: trip[0].id });

    // if join insert fails send status code 500
    if (!join.length) return res.status(500);

    // send the trip info to the front end
    return res.status(200).json(trip[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateTrip = async function (req, res) {
  try {
    const { tripID } = req.params;
    const { startDate, endDate, userid } = req.body;
    // console.log(exerciseid);
    if (userid === undefined) {
      res.status(500).json({ message: 'user id is undefined' });
      return;
    }
    //Update the trip using the trip ID
    const data = await knex('trips')
      .where({ id: tripID })
      .update({
        start_date: startDate,
        end_date: endDate,
        user_id: userid,
      })
      .returning('*');

    // If the trip is updated correctly, send back the information from the trip
    if (data.length > 0) {
      res.status(200).json(data);
      return;
    }
    res.status(404).json({ message: 'Trip not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// Delete the trip from the DB for that user
const deleteTrip = async function (req, res) {
  try {
    const { tripID, userID } = req.body;

    if (tripID === undefined) {
      res.status(500).json({ message: 'trip id is not defined' });
      return;
    }

    await knex('trips')
      .where({ id: tripID })
      .andWhere({ user_id: userID })
      .del();

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
};
