// to be merged

// File for Users
const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const knex = require("../../db/index");

const UserController = {
  // Get the user informmation for the profile page
  getUser: async (req, res) => {
    try {
      const { userid } = req.params;
      console.log(userid);

      if (userid === undefined) {
        res.status(500).json({ message: "User is undefined" });
        return;
      }
      //Send back all the information from our DB
      const data = await knex("users").select("*").where({ id: userid });

      if (data.length > 0) {
        res.status(200).json(data[0]);
        return;
      }
      res.status(404).json({ message: "user not found" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  //Get information from frontend and check if user exists and send the user id, username and jwt-token back.
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      //Check if the email exists
      if (email === undefined) {
        res.status(500).json({ message: "email is not defined" });
        return;
      }

      const data = await knex
        .select("*")
        .from("users")
        .where({ email: email, password: password }); //Check if the user exists

      console.log(data);

      //If the user exists, create the token and send the information
      if (data.length > 0) {
        const token = jwt.sign(
          {
            firstName: data[0]["email"],
            lastName: data[0]["username"],
            userid: data[0]["id"],
          },
          process.env.JWT_SECRET || "my_secret",
          {
            expiresIn: "1h",
          }
        );
        //Send back the id, the username and the token to the frontend so they can store it and keep for authentification
        res.status(200).json({
          token: token,
          username: data[0]["username"],
          userid: data[0]["id"],
        });
        return;
      }
      res.status(401).json({ error: "Validation Failed" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  //Create new user in the DB and send the user id, username and jwt-token back.
  signup: async (req, res) => {
    try {
      const { email, password, username } = req.body;
      console.log(email, password, username);
      const newUser = [
        {
          email: email,
          password: password,
          username: username,
        },
      ];
      const data = await knex("users")
        .returning(["id", "username"])
        .insert(newUser);
      console.log(data);

      const token = jwt.sign(
        { email: email, username: username, userid: data[0]["id"] },
        process.env.JWT_SECRET || "my_secret",
        {
          expiresIn: "1h",
        }
      );
      res.status(201).json({
        token: token,
        username: data[0]["username"],
        userid: data[0]["id"],
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  //Update user information
  putUser: async (req, res) => {
    try {
      const { userid } = req.params;
      const { email, password, username } = req.body;
      console.log(userid);

      if (userid === undefined) {
        res.status(500).json({ message: "user ID is undefined" });
        return;
      }
      const data = await knex("users")
        .where({ id: userid })
        .update({
          email: email,
          password: password,
          username: username,
        })
        .returning("*");

      // Send the updated information
      if (data.length > 0) {
        res.status(200).json(data[0]);
        return;
      }
      res.status(404).json({ message: "Not found" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = UserController;

//File for getting Trips
const express = require("express");
const knex = require("../../db/index");
require("dotenv").config();

const TripsController = {
  getTrips: async (req, res) => {
    try {
      const { userid } = req.params;
      if (userid === undefined) {
        res.status(500).json({ message: "user id is not defined" });
        return;
      }

      const data = await knex("trips").select("*").where({ user_id: userid });

      //If the user has trips in the DB, send back all the information for each trip
      if (data.length > 0) {
        res.status(200).json(data);
        return;
      }
      res.status(404).json({ message: "not found" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  createTrip: async (req, res) => {
    try {
      const { userid } = req.params;
      const { startDate, endDate } = req.body;

      if (userid === undefined) {
        res.status(500).json({ message: "user id is not defined" });
        return;
      }

      const data = await knex("trips")
        .insert({
          start_date: startDate,
          end_date: endDate,
          user_id: userid,
        })
        .returning("*");

      //If the trip is created, send back the information of the trip to the frontend
      if (data.length > 0) {
        res.status(200).json(data);
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateTrip: async (req, res) => {
    try {
      const { tripID } = req.params;
      const { startDate, endDate, userid } = req.body;
      // console.log(exerciseid);
      if (userid === undefined) {
        res.status(500).json({ message: "user id is undefined" });
        return;
      }
      //Update the trip using the trip ID
      const data = await knex("trips")
        .where({ id: tripID })
        .update({
          start_date: startDate,
          end_date: endDate,
          user_id: userid,
        })
        .returning("*");

      // If the trip is updated correctly, send back the information from the trip
      if (data.length > 0) {
        res.status(200).json(data);
        return;
      }
      res.status(404).json({ message: "Trip not found" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  // Delete the trip from the DB for that user
  deleteTrip: async (req, res) => {
    try {
      const { tripID, userID } = req.body;

      if (exerciseid === undefined) {
        res.status(500).json({ message: "trip id is not defined" });
        return;
      }

      await knex("trips")
        .where({ id: tripID })
        .andWhere({ user_id: userID })
        .del();

      res.status(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = TripsController;

//File for getting Expenses
const express = require("express");
const knex = require("../../db/index");
require("dotenv").config();

const ExpensesController = {
  //Get all expenses for a trip. Frontend can decide how to display them
  getExpenses: async (req, res) => {
    try {
      const { tripID } = req.params;
      if (tripID === undefined) {
        res.status(500).json({ message: "trip id is undefined" });
        return;
      }

      const data = await knex("expenses")
        .select("*")
        .where({ trip_id: tripID });

      //If the trip has expeneses in the DB, send back all the information for each expense
      if (data.length > 0) {
        res.status(200).json(data);
        return;
      }
      res.status(404).json({ message: "not found" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  //Create new expense and added it to the table
  createExpense: async (req, res) => {
    try {
      const { userID, tripID, itemName, username, money } = req.body;

      const data = await knex("expenses")
        .insert({
          user_id: userID,
          trip_id: tripID,
          item_name: itemName,
          username: username,
          money: money,
        })
        .returning("*");

      //If the expense is created, send back the information of the expense to the frontend
      if (data.length > 0) {
        res.status(200).json(data);
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateExpense: async (req, res) => {
    try {
      const { userID, tripID, itemName, username, money } = req.body;

      //Update the expense using the trip ID
      const data = await knex("expenses")
        .where({ id: tripID })
        .update({
            user_id: userID,
            trip_id: tripID,
            item_name: itemName,
            username: username,
            money: money,
        })
        .returning("*");

      // If the expense is updated correctly, send back the information from the trip
      if (data.length > 0) {
        res.status(200).json(data);
        return;
      }
      res.status(404).json({ message: "Trip not found" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  // Delete the expense from the DB for that trip
  deleteExpense: async (req, res) => {
    try {
      const { tripID, expenseID } = req.body;

      await knex("expenses")
        .where({ id: expenseID })
        .andWhere({ trip_id: tripID })
        .del();

      res.status(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAverageExpense: async (req, res) => {
    try {
      const { tripID } = req.params;
      if (tripID === undefined) {
        res.status(500).json({ message: "trip id is undefined" });
        return;
      }

      const data = await knex("expenses")
        .select("*")
        .where({ trip_id: tripID });

      //If the trip has expeneses in the DB, calculate the average
      //I dont know if this works yet, I need to check. 
      if (data.length > 0) {
        const helperObject = {}
        helperObject.numUsers = 0
        helperObject.totalMoney = 0
        for (let i = 0; i<data.length; i++){
            if(!helperObject[data[i][user_id]]){
                helperObject[data[i][user_id]] = data[i][money]
                helperObject.numUsers += 1
                helperObject.totalMoney += data[i][money]
            }
            else {
                helperObject[data[i][user_id]] += data[i][money]
                helperObject.totalMoney += data[i][money]
            }
        }
        const averageMoney = (helperObject.totalMoney/ helperObject.numUsers)
        res.status(200).json(averageMoney);
        return;
      }
      res.status(404).json({ message: "not found" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

};

module.exports = ExpensesController;
