const express = require('express');
const knex = require('../../db/knex');
require('dotenv').config();

/**
 * Respond to a GET request to API_URL/expense/:tripID with an array of expense objects
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing an array of expense objects
 */

const getExpenses = async function (req, res) {
  try {
    // extract the trip id from req.params
    const { tripID } = req.params;

    // confirm the trip id is defined
    if (!tripID) {
      return res.status(500).json({ message: 'trip id is undefined' });
    }

    // extract the expenses associated with the trip id from the database
    const data = await knex('expenses').select('*').where({ trip_id: tripID });

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
    const { userID, tripID, itemName, username, money } = req.body;

    const data = await knex('expenses')
      .insert({
        user_id: userID,
        trip_id: tripID,
        item_name: itemName,
        username: username,
        money: money,
      })
      .returning('*');

    //If the expense is created, send back the information of the expense to the frontend
    if (data.length > 0) {
      res.status(200).json(data);
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateExpense = async function (req, res) {
  try {
    const { userID, tripID, itemName, username, money } = req.body;

    //Update the expense using the trip ID
    const data = await knex('expenses')
      .where({ id: tripID })
      .update({
        user_id: userID,
        trip_id: tripID,
        item_name: itemName,
        username: username,
        money: money,
      })
      .returning('*');

    // If the expense is updated correctly, send back the information from the trip
    if (data.length > 0) {
      res.status(200).json(data);
      return;
    }
    res.status(404).json({ message: 'Trip not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// Delete the expense from the DB for that trip
const deleteExpense = async function (req, res) {
  try {
    const { tripID, expenseID } = req.body;

    await knex('expenses')
      .where({ id: expenseID })
      .andWhere({ trip_id: tripID })
      .del();

    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAverageExpense = async function (req, res) {
  try {
    const { tripID } = req.params;
    if (tripID === undefined) {
      res.status(500).json({ message: 'trip id is undefined' });
      return;
    }

    const data = await knex('expenses').select('*').where({ trip_id: tripID });

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
