const knex = require('../../db/knex');
const {
  handleInternalServerError,
  checkForUndefined,
} = require('../errors/errorController');
const ERROR = require('../errors/errorConstants');

/**
 * Respond to a GET request to API_URL/vote/:eventid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an array of vote table objects containing
 * { [ { username, vote } ], numOfYesVotes, numOfNoVotes, numNotVoted }
 */

async function getVotes(req, res) {
  try {
    const { eventid } = req.params;
    const { tripid } = req.body;

    if (checkForUndefined(eventid, tripid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const voteArray = await knex('users_events_vote')
      .join('users', 'user_id', 'users.id')
      .where('trips_events_id', eventid)
      .select(['username', 'email', 'vote']);

    const numUsersInTrip = (
      await knex('users_trips').where('trip_id', tripid).count()
    )[0].count;

    const numYesVotes = voteArray.filter(object => object.vote).length;

    const numNoVotes = voteArray.filter(object => !object.vote).length;

    const numNotVoted = numUsersInTrip - numYesVotes - numNoVotes;

    if (!voteArray.length) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res
      .status(200)
      .json({ voteArray, numYesVotes, numNoVotes, numNotVoted });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a GET request to API_URL/tripVotes/:eventid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an array of vote table objects containing
 * { tripVoteArray, numYesVotes, numNoVotes, numNotVoted }
 */

async function getTripVotes(req, res) {
  try {
    const { tripid } = req.params;
    if (checkForUndefined(tripid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const tripVoteArray = await knex('users_events_vote')
      .join('trips_events', 'trips_events_id', 'trips_events.id')
      .select(['users_events_vote.id', 'vote', 'trips_events_id'])
      .where({ 'trips_events.trip_id': tripid });

    if (!tripVoteArray.length) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res
      .status(200)
      .json({ tripVoteArray, numYesVotes, numNoVotes, numNotVoted });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a GET request to API_URL/vote/:eventid/user
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns the users vote info for the selected event
 * {vote, voteid}
 */

async function getUserVote(req, res) {
  try {
    const { eventid } = req.params;
    const { userid } = req.body;

    if (checkForUndefined(eventid, userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const userVoteArray = await knex('users_events_vote')
      .select(['id', 'vote'])
      .where({ trips_events_id: eventid, user_id: userid });

    if (!userVoteArray.length) {
      return res.status(200).json([{ id: null, vote: null }]);
    }

    return res.status(200).json(userVoteArray);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a POST request to API_URL/vote/yes/:eventid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http 201 status
 */

async function createYesVote(req, res) {
  try {
    const { eventid } = req.params;
    const { userid } = req.body;

    if (checkForUndefined(eventid, userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const newVoteId = await knex('users_events_vote').insert(
      {
        user_id: userid,
        trips_events_id: eventid,
        vote: true,
      },
      ['id']
    )[0].id;

    if (!newVoteId) {
      return res.status(500).json(ERROR.INTERNAL_SERVER_ERROR);
    }

    return res.sendStatus(201);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a POST request to API_URL/vote/no/:eventid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http 201 status
 */

async function createNoVote(req, res) {
  try {
    const { eventid } = req.params;
    const { userid } = req.body;

    if (checkForUndefined(eventid, userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const newVoteId = (
      await knex('users_events_vote').insert(
        {
          user_id: userid,
          trips_events_id: eventid,
          vote: false,
        }['id']
      )
    )[0].id;

    if (!newVoteId) {
      return res.status(500).json(ERROR.INTERNAL_SERVER_ERROR);
    }

    return res.sendStatus(201);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a PUT request to API_URL/vote/yes/:voteid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http 200 status
 */

async function updateToYesVote(req, res) {
  try {
    const { voteid } = req.params;

    if (checkForUndefined(voteid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const updatedVoteId = (
      await knex('users_events_vote').where({ id: voteid }).update(
        {
          vote: true,
        },
        ['id']
      )
    )[0].id;

    if (!updatedVoteId) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a PUT request to API_URL/vote/no/:voteid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http 200 status
 */

async function updateToNoVote(req, res) {
  try {
    const { voteid } = req.params;

    if (checkForUndefined(voteid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const updatedVoteId = (
      await knex('users_events_vote').where({ id: voteid }).update(
        {
          vote: false,
        },
        ['id']
      )
    )[0].id;

    if (!updatedVoteId) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a DELETE request to API_URL/vote/:voteid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http 200 status
 */

async function deleteVote(req, res) {
  try {
    const { voteid } = req.params;

    if (checkForUndefined(voteid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const numDeleted = await knex('users_events_vote')
      .where({ id: voteid })
      .del();

    if (!numDeleted) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }
    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

module.exports = {
  getVotes,
  getUserVote,
  getTripVotes,
  createYesVote,
  createNoVote,
  updateToYesVote,
  updateToNoVote,
  deleteVote,
};
