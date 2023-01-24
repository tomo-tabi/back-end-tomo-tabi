const knex = require('../../db/knex');

/**
 * Respond to a GET request to API_URL/timeline/:tripid with all events associated with the trip
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing an array of events
 */

async function getEvents(req, res) {
  try {
    const { tripid } = req.params;
    const { userid } = req.body;

    if (!userid || !tripid) {
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });
    }

    const eventArray = await knex
      .select('*')
      .from('trips_events')
      .where('trip_id', tripid)
      .orderBy('event_date', 'asc');

    if (!eventArray.length) {
      return res.status(404).json({ message: 'item not found' });
    }

    return res.status(200).json(eventArray);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * Respond to a POST request to API_URL/timeline/create with all information regarding
 * the new event.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing the new expense object
 */

async function createEvent(req, res) {
  try {
    const { userid, tripid, eventName, eventDate, description } = req.body;

    if (!userid || !tripid || !eventName || !eventDate || !description) {
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });
    }

    const eventArray = await knex('trips_events')
      .returning(['id', 'event_name', 'event_date', 'description'])
      .insert({
        trip_id: tripid,
        event_name: eventName,
        event_date: eventDate,
        description: description
      });

    if (!eventArray.length) {
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
 * Respond to a PUT request to API_URL/timeline/update/eventid with info on how to
 * update the events
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing the updated expense object
 */

async function updateEvent(req, res) {
  try {
    const { eventid } = req.params;
    const { userid, tripid, eventName, eventDate, description } = req.body;

    if (!userid || !tripid || !eventid || !eventName || !eventDate || !description) {
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });
    }

    const eventArray = await knex('trips_events')
      .returning(['id', 'event_name', 'event_date', 'description'])
      .where('id', eventid)
      .update({
        event_name: eventName,
        event_date: eventDate,
        description: description
      });

    if (!eventArray.length) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.sendStatus(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * Respond to a PUT request to API_URL/timeline/create with info on how to
 * update the events
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing the updated expense object
 */

async function deleteEvent(req, res) {
  try {
    const { eventid } = req.params;
    const { userid, tripid } = req.body;

    if (!userid || !tripid || !eventid) {
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });
    }

    const deleted = await knex('trips_events').where('id', eventid).del(['id']);

    if (!deleted) {
      return res.status(404).json({ message: 'item not found' });
    }

    return res.sendStatus(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
