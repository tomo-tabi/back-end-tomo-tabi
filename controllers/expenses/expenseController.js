const knex = require('../../db/knex');
const {
  handleInternalServerError,
  checkForUndefined,
} = require('../errors/errorController');
const ERROR = require('../errors/errorConstants');

/**
 * Respond to a GET request to API_URL/expense/:tripID with an array of expense objects
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing an array of expense objects
 */

async function getExpenses(req, res) {
  try {
    const { tripid } = req.params;

    if (checkForUndefined(tripid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const expenseArray = await knex('expenses')
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

    if (!expenseArray.length) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.status(200).json(expenseArray);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a POST request to API_URL/expense/create with all information regarding
 * the new expense.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing the new expense object
 */

async function createExpense(req, res) {
  try {
    const { userid, tripid, itemName, money } = req.body;
    let { purchaserid } = req.body;

    purchaserid = purchaserid || userid;

    if (checkForUndefined(purchaserid, tripid, itemName, money)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const expenseIdArray = await knex('expenses').insert(
      {
        user_id: purchaserid,
        trip_id: tripid,
        item_name: itemName,
        money,
      },
      'id'
    );

    if (!expenseIdArray.length) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.sendStatus(201);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a PUT request to API_URL/expense/update with all information regarding
 * the updated expense after updated said expense.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing the updated expense object
 */

async function updateExpense(req, res) {
  try {
    const { expenseid } = req.params;
    const { itemName, money, userid } = req.body;
    let { purchaserid } = req.body;

    purchaserid = purchaserid || userid;

    if (checkForUndefined(purchaserid, itemName, money, expenseid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const expenseIdArray = await knex('expenses').where('id', expenseid).update(
      {
        item_name: itemName,
        user_id: purchaserid,
        money,
      },
      ['id']
    );

    if (!expenseIdArray.length) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a DELETE request to API_URL/expense/delete/:expenseid with status code 200
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http status code
 */

async function deleteExpense(req, res) {
  try {
    const { expenseid } = req.params;

    if (checkForUndefined(expenseid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const deleted = await knex('expenses').where({ id: expenseid }).del();

    if (!deleted) {
      return res.status(404).json({ message: 'item not found' });
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a GET request to API_URL/expense/average/:tripid with status code 200
 * @deprecated
 * @todo make this reflect the newer front end logic
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http status code
 */

async function getAverageExpense(req, res) {
  try {
    const { tripid } = req.params;

    if (checkForUndefined(tripid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const expenseArray = await knex('expenses')
      .select('*')
      .where({ trip_id: tripid });

    if (!expenseArray.length) {
      return res.status(404).json({ message: 'item not found' });
    }

    const moneyAndUsers = { totalMoney: 0, numUsers: 0 };

    for (let i = 0; i < expenseArray.length; i++) {
      if (!moneyAndUsers[expenseArray[i].user_id]) {
        moneyAndUsers[expenseArray[i].user_id] = Number(expenseArray[i].money);
        moneyAndUsers.numUsers += 1;
        moneyAndUsers.totalMoney += Number(expenseArray[i].money);
      } else {
        moneyAndUsers[expenseArray[i].user_id] += Number(expenseArray[i].money);
        moneyAndUsers.totalMoney += Number(expenseArray[i].money);
      }
    }

    const averageMoney = moneyAndUsers.totalMoney / moneyAndUsers.numUsers;

    return res.status(200).json(averageMoney);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getAverageExpense,
};
