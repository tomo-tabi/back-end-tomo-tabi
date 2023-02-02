const knex = require('../../db/knex');

const [ACCEPTED, REJECTED, PENDING] = ['accepted', 'rejected', 'pending'];
const { getIdFromEmail } = require('../../utils/getID');
const { inviteExists } = require('../../utils/exists');
const {
  handleInternalServerError,
  checkForUndefined,
} = require('../errors/errorController');
const ERROR = require('../errors/errorConstants');

/**
 * Respond to a GET request to API_URL/invite/
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an array of invite objects where status is pending
 */

async function getInvites(req, res) {
  try {
    const { userid } = req.body;

    if (checkForUndefined(userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const pendingInviteArray = await knex('invites')
      .join('users', 'sender_id', 'users.id')
      .join('trips', 'trip_id', 'trips.id')
      .select(['invites.id', 'status', 'trips.name', 'email', 'username'])
      .where({ receiver_id: userid, status: PENDING });

    if (!pendingInviteArray.length) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.status(200).json(pendingInviteArray);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a GET request to API_URL/invite/sent/:tripid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an array of invites sent by user
 * {"email": "user2@test.com", "username": "user2", "status": "rejected"}
 */

async function getSentInvites(req, res) {
  try {
    const { userid } = req.body;
    const { tripid } = req.params;

    if (checkForUndefined(userid, tripid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const sentInviteArray = await knex('invites')
      .join('users', 'receiver_id', 'users.id')
      .select(['invites.id', 'email', 'username', 'status'])
      .where({ sender_id: userid, trip_id: tripid });

    if (!sentInviteArray.length) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.status(200).json(sentInviteArray);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a POST request to API_URL/invite/create
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns a CREATED status
 */

async function createInvite(req, res) {
  try {
    const { userid, tripid, email } = req.body;

    const receiverid = await getIdFromEmail(email);

    if (checkForUndefined(userid, receiverid, tripid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    if (await inviteExists(userid, receiverid, tripid)) {
      return res.status(400).json({ message: 'invite exists' });
    }

    const newInviteId = (
      await knex('invites').insert(
        {
          sender_id: userid,
          receiver_id: receiverid,
          trip_id: tripid,
          status: PENDING,
        },
        'id'
      )
    )[0].id;

    if (!newInviteId) {
      return res.status(500).json(ERROR.INTERNAL_SERVER_ERROR);
    }

    return res.sendStatus(201);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a PUT request to API_URL/invite/accept/:inviteid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response 200
 */

async function acceptInvite(req, res) {
  try {
    const { inviteid } = req.params;
    const { userid } = req.body;

    if (checkForUndefined(inviteid, userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    await knex.transaction(async trx => {
      const tripid = (
        await knex('invites')
          .where('id', inviteid)
          .update({ status: ACCEPTED }, ['trip_id'])
          .transacting(trx)
      )[0].tripid;

      await knex('users_trips')
        .insert({ user_id: userid, trip_id: tripid })
        .transacting(trx);
    });

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a PUT request to API_URL/invite/reject/:tripid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response 200
 */

async function rejectInvite(req, res) {
  try {
    const { inviteid } = req.params;
    const { userid } = req.body;

    if (checkForUndefined(inviteid, userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const rejectedInviteId = (
      await knex('invites')
        .where('id', inviteid)
        .update({ status: REJECTED }, ['id'])
    )[0].id;

    if (!rejectedInviteId) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a DELETE request to API_URL/invite/:inviteid with status code 200
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http status code 200
 */

async function deleteInvite(req, res) {
  try {
    const { inviteid } = req.params;

    if (checkForUndefined(inviteid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const numDeleted = await knex('invites').where({ id: inviteid }).del();

    if (!numDeleted) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

module.exports = {
  getInvites,
  getSentInvites,
  createInvite,
  acceptInvite,
  rejectInvite,
  deleteInvite,
};
