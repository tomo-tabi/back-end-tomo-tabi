const knex = require('../../db/knex');

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
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createEvent,
};
