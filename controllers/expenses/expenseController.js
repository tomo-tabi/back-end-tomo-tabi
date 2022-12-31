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
    if (!tripid)
      return res.status(500).json({ message: 'trip id is undefined' });

    // extract the expenses associated with the trip id from the database
    const data = await knex('expenses').select('*').where({ trip_id: tripid });

    // if there are no expenses return status code 204 No Content
    if (!data.length) return res.status(204).json({ message: 'No Content' });

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
    const { userid, tripid, itemName, username, money } = req.body;

    // confirm all required information is defined
    if (!userid || !tripid || !itemName || !username || !money)
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

    // insert the new expense object into expenses table
    const data = await knex('expenses')
      .returning(['id', 'item_name', 'username', 'money'])
      .insert({
        user_id: userid,
        trip_id: tripid,
        item_name: itemName,
        username: username,
        money: money,
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
    const { expenseid, itemName, username, money } = req.body;

    // update the expense using the expense id
    const data = await knex('expenses')
      .where({ id: expenseid })
      .update({
        item_name: itemName,
        username: username,
        money: money,
      })
      .returning('*');

    // confirm data has been saved in data
    if (!data.length)
      return res.status(500).json({ message: 'Internal Server Error' });

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete the expense from the DB for that trip
const deleteExpense = async function (req, res) {
  try {
    // extract info from req.body and req.params
    const { expenseid } = req.params;
    const { userid, tripid } = req.body;

    // delete the expense
    const data = await knex('expenses')
      .where({ id: expenseid, trip_id: tripid })
      .del(['id']);

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAverageExpense = async function (req, res) {
  try {
    const { tripid } = req.params;
    if (tripid === undefined) {
      res.status(500).json({ message: 'trip id is undefined' });
      return;
    }

    const data = await knex('expenses').select('*').where({ trip_id: tripid });

    //If the trip has expeneses in the DB, calculate the average
    //I dont know if this works yet, I need to check.
    if (data.length > 0) {
      const helperObject = {};
      helperObject.numUsers = 0;
      helperObject.totalMoney = 0;
      for (let i = 0; i < data.length; i++) {
        if (!helperObject[data[i][user_id]]) {
          helperObject[data[i][user_id]] = data[i][money];
          helperObject.numUsers += 1;
          helperObject.totalMoney += data[i][money];
        } else {
          helperObject[data[i][user_id]] += data[i][money];
          helperObject.totalMoney += data[i][money];
        }
      }
      const averageMoney = helperObject.totalMoney / helperObject.numUsers;
      res.status(200).json(averageMoney);
      return;
    }
    res.status(404).json({ message: 'not found' });
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
