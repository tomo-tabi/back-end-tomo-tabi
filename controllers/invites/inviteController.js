const knex = require('../../db/knex');

/**
 * Respond to a GET request to API_URL/invite/ with an array of expense objects
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing an array of expense objects
 */

const getInvites = async function (req, res) {
  try {
    // extract the userid from req.body
    const { userid } = req.body;

    // confirm the trip id is defined
    if (!userid) return res.status(500).json('user id is undefined');

    // extract the expenses associated with the trip id from the database
    const data = await knex('invites')
      .select('*')
      .where({ invitee_id: userid });

    // if there are no expenses return status code 204 No Content
    if (!data.length) return res.status(204).json('No content');

    // send the data
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a POST request to API_URL/expense/create with all information regarding
 * the new expense.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing the new expense object
 */

const createInvite = async function (req, res) {
  try {
    // extract required information from req.body
    const { userid, tripid, itemName, money } = req.body;
    let { purchaserid } = req.body;

    // if a purchaser has been specified, use that instead of userid
    purchaserid = purchaserid ? purchaserid : userid;

    // confirm all required information is defined
    if (!purchaserid || !tripid || !itemName || !money)
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

    const data = await knex.transaction(async trx => {
      // insert the new expense object into expenses table
      const id = await knex('expenses')
        .insert(
          {
            user_id: purchaserid,
            trip_id: tripid,
            item_name: itemName,
            money: money,
          },
          'id'
        )
        .transacting(trx);

      // extract new data from users - expenses join table
      const joinData = await knex
        .select(['expenses.id', 'item_name', 'users.username', 'money'])
        .from('expenses')
        .join('users', 'user_id', 'users.id')
        .where('expenses.id', id[0].id)
        .transacting(trx);

      return joinData;
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
 * Respond to a PUT request to API_URL/expense/update with all information regarding
 * the updated expense after updated said expense.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing the updated expense object
 */

const updateInvite = async function (req, res) {
  try {
    // extract all required information from req.body
    const { expenseid } = req.params;
    const { itemName, money } = req.body;
    let { purchaserid } = req.body;

    // if a purchaser has been specified, use that instead of userid
    purchaserid = purchaserid ? purchaserid : userid;

    // confirm all required information is defined
    if (!purchaserid || !itemName || !money || !expenseid)
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

    const data = await knex.transaction(async trx => {
      // update expense using expenseid
      const id = await knex('expenses')
        .where('id', expenseid)
        .update(
          {
            item_name: itemName,
            user_id: purchaserid,
            money: money,
          },
          ['id']
        )
        .transacting(trx);

      // extract new data from users - expenses join table
      const joinData = await knex
        .select(['expenses.id', 'item_name', 'users.username', 'money'])
        .from('expenses')
        .join('users', 'user_id', 'users.id')
        .where('expenses.id', id[0].id)
        .transacting(trx);

      return joinData;
    });

    // confirm data has been saved in data
    if (!data.length)
      return res.status(500).json({ message: 'Internal Server Error' });

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a DELETE request to API_URL/expense/delete/:expenseid with status code 200
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http status code
 */

const deleteInvite = async function (req, res) {
  try {
    // extract info from req.body and req.params
    const { expenseid } = req.params;
    const { tripid } = req.body;

    // confirm all required information is defined
    if (!expenseid) return res.sendStatus(500);

    // delete the expense
    const data = await knex('expenses')
      .where({ id: expenseid, trip_id: tripid })
      .del(['id']);

    // ensure data has a deleted item id
    if (!data.length) return res.sendStatus(404);

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = {
  getInvites,
  createInvite,
  updateInvite,
  deleteInvite,
};
