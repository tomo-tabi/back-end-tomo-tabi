const knex = require('../../db/knex');
const [ACCEPTED, REJECTED, PENDING] = ['accepted', 'rejected', 'pending'];
const { getIdFromEmail } = require('../../utils/getID');

/**
 * Respond to a GET request to API_URL/invite/
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an array of invite objects where status is pending
 */

const getInvites = async function (req, res) {
  try {
    // extract the userid from req.body
    const { userid } = req.body;

    // confirm the userid is defined
    if (!userid) return res.status(500).json('user id is undefined');

    // extract the invites associated with the user
    const data = await knex('invites')
      .select('*')
      .where({ receiver_id: userid, status: PENDING });

    // check that info exists
    if (!data.length) return res.status(404).json('no invites found');

    // send the data
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a POST request to API_URL/invite/create
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns a CREATED status
 */

const createInvite = async function (req, res) {
  try {
    // extract required information from req.body
    const { userid, tripid, email } = req.body;

    const receiverid = await getIdFromEmail(email);

    // confirm all required information is defined
    if (!userid || !receiverid || !tripid)
      return res.status(500).json('required variable is undefined');

    const data = await knex('invites').insert(
      {
        sender_id: userid,
        receiver_id: receiverid,
        trip_id: tripid,
        status: PENDING,
      },
      'id'
    );

    // confirm the new data has been saved in data
    if (!data.length)
      return res.status(500).json({ message: 'Internal Server Error' });

    // send status code 'CREATED'
    return res.status(201).json({ message: 'invite created' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a PUT request to API_URL/invite/accept/:inviteid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response 200
 */

const acceptInvite = async function (req, res) {
  try {
    // extract all required information from req.body
    const { inviteid } = req.params;
    const { userid } = req.body;

    // confirm all required information is defined
    if (!inviteid || !userid)
      return res.status(500).json('required variable is undefined');

    await knex.transaction(async trx => {
      // update invite to accepted using inviteid
      const tripid = await knex('invites')
        .where('id', inviteid)
        .update({ status: ACCEPTED }, ['trip_id'])
        .transacting(trx);

      // update users_trips
      await knex('users_trips')
        .insert({ user_id: userid, trip_id: tripid[0].trip_id })
        .transacting(trx);
    });

    return res.status(200).json({ message: 'invite accepted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a PUT request to API_URL/invite/reject/:tripid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response 200
 */

const rejectInvite = async function (req, res) {
  try {
    // extract all required information from req.body
    const { inviteid } = req.params;
    const { userid } = req.body;

    // confirm all required information is defined
    if (!inviteid || !userid)
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

    await knex('invites')
      .where('id', inviteid)
      .update({ status: REJECTED }, ['trip_id']);

    return res.status(200).json({ message: 'invite rejected' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a DELETE request to API_URL/invite/:inviteid with status code 200
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http status code 200
 */

const deleteInvite = async function (req, res) {
  try {
    // extract info from req.body and req.params
    const { inviteid } = req.params;

    // confirm all required information is defined
    if (!inviteid)
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

    // delete the expense
    const data = await knex('invites').where({ id: inviteid }).del();

    // ensure data has a deleted item id
    if (!data) return res.status(404).json({ message: 'item not found' });

    return res.status(200).json({ message: 'item deleted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getInvites,
  createInvite,
  acceptInvite,
  rejectInvite,
  deleteInvite,
};
