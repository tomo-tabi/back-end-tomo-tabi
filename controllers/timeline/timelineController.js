const knex = require('../../db/knex');

/**
 * Respond to a GET request to API_URL/timeline/:tripid with all events associated with the trip
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing an array of events
 */

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
 * the new event.
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

    // insert the new event object into trips_events table
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

/**
 * Respond to a PUT request to API_URL/timeline/update/eventid with info on how to
 * update the events
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing the updated expense object
 */

const updateEvent = async function (req, res) {
  try {
    // extract required information from req.body
    const { eventid } = req.params;
    const { userid, tripid, eventName, eventDate } = req.body;

    // confirm all required information is defined
    if (!userid || !tripid || !eventid || !eventName || !eventDate)
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

    // update the event row
    const data = await knex('trips_events')
      .returning(['id', 'event_name', 'event_date'])
      .where('id', eventid)
      .update({
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

/**
 * Respond to a PUT request to API_URL/timeline/create with info on how to
 * update the events
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing the updated expense object
 */

const deleteEvent = async function (req, res) {
  try {
    // extract required information from req.body
    const { eventid } = req.params;
    const { userid, tripid } = req.body;

    // confirm all required information is defined
    if (!userid || !tripid || !eventid)
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

    // delete the event
    const data = await knex('trips_events').where('id', eventid).del(['id']);

    // confirm the new data has been saved in data
    if (!data.length)
      return res.status(500).json({ message: 'Internal Server Error' });
    console.log(`event id: ${data[0].id} deleted`);

    // send the data
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
