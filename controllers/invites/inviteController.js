const knex = require('../../db/knex');

const [ACCEPTED, REJECTED, PENDING] = ['accepted', 'rejected', 'pending'];
const { getIdFromEmail } = require('../../utils/getID');
const { inviteExists } = require('../../utils/exists');

/**
 * Respond to a GET request to API_URL/invite/
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an array of invite objects where status is pending
 */

async function getInvites(req, res) {
  try {
    const { userid } = req.body;

    if (!userid) return res.status(500).json('user id is undefined');

    const pendingInviteArray = await knex('invites')
      .join('users', 'sender_id', 'users.id')
      .join('trips', 'trip_id', 'trips.id')
      .select(['invites.id', 'status', 'trips.name', 'email', 'username'])
      .where({ receiver_id: userid, status: PENDING });

    if (!pendingInviteArray.length) {
      return res.status(404).json({ message: 'no invites found' });
    }

    return res.status(200).json(pendingInviteArray);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
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

    if (!userid || !receiverid || !tripid) {
      return res.status(500).json('required variable is undefined');
    }

    if (await inviteExists(userid, receiverid, tripid)) {
      return res.status(400).json({ message: 'invite exists' });
    }

    const inviteIdArray = await knex('invites').insert(
      {
        sender_id: userid,
        receiver_id: receiverid,
        trip_id: tripid,
        status: PENDING,
      },
      'id'
    );

    if (!inviteIdArray.length) {
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
 * Respond to a PUT request to API_URL/invite/accept/:inviteid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response 200
 */

async function acceptInvite(req, res) {
  try {
    const { inviteid } = req.params;
    const { userid } = req.body;

    if (!inviteid || !userid) {
      return res.status(500).json('required variable is undefined');
    }

    await knex.transaction(async trx => {
      const tripid = await knex('invites')
        .where('id', inviteid)
        .update({ status: ACCEPTED }, ['trip_id'])
        .transacting(trx);

      await knex('users_trips')
        .insert({ user_id: userid, trip_id: tripid[0].trip_id })
        .transacting(trx);
    });

    return res.sendStatus(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
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

    if (!inviteid || !userid) {
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });
    }

    const inviteIdArray = await knex('invites')
      .where('id', inviteid)
      .update({ status: REJECTED }, ['id']);

    if (!inviteIdArray.length) {
      return res.status(404).json({ message: 'item not found' });
    }

    return res.sendStatus(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
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

    if (!inviteid) {
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });
    }

    const deleted = await knex('invites').where({ id: inviteid }).del();

    if (!deleted) return res.status(404).json({ message: 'item not found' });

    return res.sendStatus(200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  getInvites,
  createInvite,
  acceptInvite,
  rejectInvite,
  deleteInvite,
};
