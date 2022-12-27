const knex = require('../../db/knex');
require('dotenv').config();

/**
 * Respond to a GET request to API_URL/user/ with the email and username associated
 * with the userid contained in the req.body.
 * @todo add limit version
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an array of trip's associated with the userid
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

const createTrip = async function (req, res) {
  try {
    const { startDate, endDate, userid } = req.body;

    if (!userid) {
      return res.status(500).json({ message: 'user id is not defined' });
    }

    const data = await knex('trips')
      .insert({
        start_date: startDate,
        end_date: endDate,
        user_id: userid,
      })
      .returning('*');

    //If the trip is created, send back the information of the trip to the frontend
    if (data.length > 0) {
      res.status(200).json(data);
      return;
    }
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
