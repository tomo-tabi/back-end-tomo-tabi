const knex = require('../../db/knex');

const getEvents = async function (req, res) {
  try {
    // extract required info from req.body and req.params
    const { tripid } = req.params;
    const { userid } = req.body;

    // confirm all required info is defined
    if (!userid || !tripid)
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

    // confirm user is connected to trip TODO: make this middleware?
    const authorized = await knex
      .select(null)
      .from('users_trips')
      .where({ user_id: userid, trip_id: tripid });

    if (!authorized.length) return res.sendStatus(403);

    // extract data from db
    const data = await knex
      .select('*')
      .from('trips_events')
      .where('trip_id', tripid);

    // confirm data exists
    if (!data.length) return res.sendStatus(500);

    // send the data
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

/**
 * Respond to a POST request to API_URL/timeline/create with all information regarding
 * the new expense.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing the new expense object
 */

const createEvent = async function (req, res) {
  try {
    // extract required information from req.body
    const { userid, tripid, eventName, eventDate } = req.body;

    // confirm all required information is defined
    if (!userid || !tripid || !eventName || !eventDate)
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

    // insert the new expense object into expenses table
    const data = await knex('trips_events')
      .returning(['id', 'event_name', 'event_date'])
      .insert({
        trip_id: tripid,
        event_name: eventName,
        event_date: eventDate,
      });

    // confirm the new data has been saved in data
    if (!data.length)
      return res.status(500).json({ message: 'Internal Server Error' });

    // send the data
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getEvents,
  createEvent,
};
