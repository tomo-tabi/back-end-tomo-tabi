const knex = require('../../db/knex');
const {
  handleInternalServerError,
  checkForUndefined,
} = require('../errors/errorController');
const ERROR = require('../errors/errorConstants');

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

    if (checkForUndefined(userid, tripid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
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
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a POST request to API_URL/timeline/create
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http 201 status
 */

async function createEvent(req, res) {
  try {
    const { userid, tripid, eventName, eventDate, description } = req.body;

    if (checkForUndefined(userid, tripid, eventName, eventDate)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const eventArray = await knex('trips_events')
      .returning(['id', 'event_name', 'event_date', 'description'])
      .insert({
        trip_id: tripid,
        event_name: eventName,
        event_date: eventDate,
        description,
      });

    if (!eventArray.length) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.sendStatus(201);
  } catch (error) {
    return handleInternalServerError(error, res);
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

    if (checkForUndefined(userid, tripid, eventid, eventName, eventDate)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const eventArray = await knex('trips_events')
      .returning(['id', 'event_name', 'event_date', 'description'])
      .where('id', eventid)
      .update({
        event_name: eventName,
        event_date: eventDate,
        description,
      });

    if (!eventArray.length) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
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

    if (checkForUndefined(userid, tripid, eventid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const deleted = await knex('trips_events').where('id', eventid).del(['id']);

    if (!deleted) {
      return res.status(404).json({ message: 'item not found' });
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
