const knex = require('../../db/knex');

/**
 * Respond to a GET request to API_URL/expense/:tripID with an array of expense objects
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing an array of expense objects
 */

const getExpenses = async function (req, res) {
  try {
    // extract the trip id from req.params
    const { tripid } = req.params;

    // confirm the trip id is defined
    if (!tripid) { return res.status(500).json({ message: 'trip id is undefined' }); }

    // extract the expenses associated with the trip id from the database
    const data = await knex('expenses')
      .join('users', 'users.id', 'user_id')
      .select([
        'expenses.id',
        'item_name',
        'money',
        'trip_id',
        'email',
        'username',
      ])
      .where({ trip_id: tripid });

    // if there are no expenses return status code 404
    if (!data.length) return res.status(404).json({ message: 'Not found' });

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

const createExpense = async function (req, res) {
  try {
    // extract required information from req.body
    const {
      userid, tripid, itemName, money,
    } = req.body;
    let { purchaserid } = req.body;

    // if a purchaser has been specified, use that instead of userid
    purchaserid = purchaserid || userid;

    // confirm all required information is defined
    if (!purchaserid || !tripid || !itemName || !money) {
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });
    }

    const data = await knex.transaction(async (trx) => {
      // insert the new expense object into expenses table
      const id = await knex('expenses')
        .insert(
          {
            user_id: purchaserid,
            trip_id: tripid,
            item_name: itemName,
            money,
          },
          'id',
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
    if (!data.length) { return res.status(500).json({ message: 'Internal Server Error' }); }

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

const updateExpense = async function (req, res) {
  try {
    // extract all required information from req.body
    const { expenseid } = req.params;
    const { itemName, money } = req.body;
    let { purchaserid } = req.body;

    // if a purchaser has been specified, use that instead of userid
    purchaserid = purchaserid || userid;

    // confirm all required information is defined
    if (!purchaserid || !itemName || !money || !expenseid) {
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });
    }

    const data = await knex.transaction(async (trx) => {
      // update expense using expenseid
      const id = await knex('expenses')
        .where('id', expenseid)
        .update(
          {
            item_name: itemName,
            user_id: purchaserid,
            money,
          },
          ['id'],
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
    if (!data.length) { return res.status(500).json({ message: 'Internal Server Error' }); }

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

const deleteExpense = async function (req, res) {
  try {
    // extract info from req.body and req.params
    const { expenseid } = req.params;
    const { tripid } = req.body;

    // confirm all required information is defined
    if (!expenseid) { return res.status(500).json({ message: 'undefined variable' }); }

    // delete the expense
    const data = await knex('expenses')
      .where({ id: expenseid, trip_id: tripid })
      .del(['id']);

    // ensure data has a deleted item id
    if (!data.length) { return res.status(404).json({ message: 'item not found' }); }

    return res.status(200).json({ message: 'item deleted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a GET request to API_URL/expense/average/:tripid with status code 200
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http status code
 */

const getAverageExpense = async function (req, res) {
  try {
    // extract info from req.params
    const { tripid } = req.params;

    // confirm info is defined
    if (!tripid) { return res.status(500).json({ message: 'trip id is undefined' }); }

    // extract all expenses related to trip from db
    const data = await knex('expenses').select('*').where({ trip_id: tripid });

    // confirm data exists
    if (!data.length) { return res.status(404).json({ message: 'item not found' }); }

    // initialize helper object
    const helperObject = { totalMoney: 0, numUsers: 0 };
    for (let i = 0; i < data.length; i++) {
      // if the user hasn't been encountered yet add it and it's values to the object
      if (!helperObject[data[i].user_id]) {
        helperObject[data[i].user_id] = Number(data[i].money);
        helperObject.numUsers += 1;
        helperObject.totalMoney += Number(data[i].money);
      }
      // otherwise, add to the existing values
      else {
        helperObject[data[i].user_id] += Number(data[i].money);
        helperObject.totalMoney += Number(data[i].money);
      }
    }

    // calculate the average expense for the trip
    const averageMoney = helperObject.totalMoney / helperObject.numUsers;

    // send the amount
    return res.status(200).json(averageMoney);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getAverageExpense,
};
