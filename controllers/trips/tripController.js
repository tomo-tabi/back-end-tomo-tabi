const knex = require('../../db/knex');

/**
 * Respond to a GET request to API_URL/trip/
 * @todo #63 add limit version
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response Object containing an array of trips associated with the userid
 */

const getTrips = async function (req, res) {
  try {
    // extract userid from req.body
    const { userid } = req.body;

    // confirm userid is not undefined
    if (!userid) { return res.status(500).json({ message: 'user id is not defined' }); }

    // retrieve all trip information using users_trips join table
    const data = await knex
      .select('trips.id', 'start_date', 'end_date', 'name')
      .from('trips')
      .join('users_trips', 'trips.id', 'users_trips.trip_id')
      .where('users_trips.user_id', userid)
      .orderBy('start_date', 'asc');

    // if there is no data send 404
    if (!data.length) return res.status(404).json({ message: 'not found' });

    // send the data
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getTripUsers = async function (req, res) {
  // using a table join, extract and send back username
  // and email of all users tied to the requested trip in users_trips table
  try {
    // extract userid from req.body
    const { tripid } = req.params;
    const { userid } = req.body;

    // confirm userid is not undefined
    if (!tripid || !userid) { return res.status(500).json({ message: 'user id is not defined' }); }

    // retrieve user email and name using users and users_trips join table
    const data = await knex('users_trips')
      .join('users', 'users.id', 'user_id')
      .select('users.email', 'users.username')
      .where({ trip_id: tripid });

    // if there is no data send 404
    if (!data.length) return res.status(404).json({ message: 'not found' });

    // send data
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Respond to a POST request to API_URL/trip/
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response Object containing the posted trip
 */

const createTrip = async function (req, res) {
  try {
    // extract required information from req.body
    const {
      startDate, endDate, userid, name,
    } = req.body;

    // verify all required data is defined
    if (!userid || !startDate || !endDate || !name) { return res.status(500).json({ message: 'required info is not defined' }); }

    // insert the data into trips
    const trip = await knex('trips')
      .insert({
        start_date: startDate,
        end_date: endDate,
        name,
      })
      .returning('*');

    // if trip insert fails, send status code 500 and exit function
    if (!trip.length) { return res.status(500).json({ message: 'Internal Server Error' }); }

    // link the user to the trip on the users_trips join table
    const join = await knex('users_trips')
      .returning('*')
      .insert({ user_id: userid, trip_id: trip[0].id });

    // if join insert fails send status code 500
    if (!join.length) { return res.status(500).json({ message: 'Internal Server Error' }); }

    // send the trip info to the front end
    return res.status(200).json(trip[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a PUT request to API_URL/trip/:tripID
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response Object containing the updated trip
 */

const updateTrip = async function (req, res) {
  try {
    // extract information from req.params and req.body
    const { tripid } = req.params;
    const { startDate, endDate, name } = req.body;

    // verify all needed data is defined
    if (!tripid || !startDate || !endDate || !name) { return res.status(500).json({ message: 'required info is not defined' }); }

    // Update the trip using the trip ID
    const data = await knex('trips')
      .where({ id: tripid })
      .update({
        start_date: startDate,
        end_date: endDate,
        name,
      })
      .returning('*');

    // if trips insert fails, send status code 404
    if (!data.length) { return res.status(404).json({ message: 'item not found' }); }

    // send the new data back
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a DELETE request to API_URL/trip/tripID by removing
 * the users_trips join table item connecting them.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} response status 200
 */
const deleteTrip = async function (req, res) {
  try {
    // extract data from req.params and req.body
    const { tripid } = req.params;
    const { userid } = req.body;

    // confirm all needed data is defined
    if (!tripid || !userid) { return res.status(500).json({ message: 'required info is not defined' }); }

    const data = await knex('users_trips')
      .where({ trip_id: tripid, user_id: userid })
      .del(['id']);

    // confirm an item has been deleted
    if (!data.length) { return res.status(404).json({ message: 'item not found' }); }

    console.log(`users_trips id: ${data[0].id} deleted`);

    // send status 200
    return res.status(200).json({ message: 'item deleted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripUsers,
};
