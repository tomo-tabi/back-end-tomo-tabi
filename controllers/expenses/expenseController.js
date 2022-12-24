const express = require('express');
const knex = require('../../db/index');
require('dotenv').config();

const ExpensesController = {
  //Get all expenses for a trip. Frontend can decide how to display them
  getExpenses: async (req, res) => {
    try {
      const { tripID } = req.params;
      if (tripID === undefined) {
        res.status(500).json({ message: 'trip id is undefined' });
        return;
      }

      const data = await knex('expenses')
        .select('*')
        .where({ trip_id: tripID });

      //If the trip has expeneses in the DB, send back all the information for each expense
      if (data.length > 0) {
        res.status(200).json(data);
        return;
      }
      res.status(404).json({ message: 'not found' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  //Create new expense and added it to the table
  createExpense: async (req, res) => {
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
  },

  updateExpense: async (req, res) => {
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
  },
  // Delete the expense from the DB for that trip
  deleteExpense: async (req, res) => {
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
  },

  getAverageExpense: async (req, res) => {
    try {
      const { tripID } = req.params;
      if (tripID === undefined) {
        res.status(500).json({ message: 'trip id is undefined' });
        return;
      }

      const data = await knex('expenses')
        .select('*')
        .where({ trip_id: tripID });

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
  },
};

module.exports = ExpensesController;
