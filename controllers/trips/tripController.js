const express = require('express');
const knex = require('../../db/knex');
require('dotenv').config();

const TripsController = {
  // TODO: add limit
  getTrips: async (req, res) => {
    try {
      const { userid } = req.body;
      if (userid === undefined) {
        res.status(500).json({ message: 'user id is not defined' });
        return;
      }

      const data = await knex('trips').select('*').where({ user_id: userid });

      //If the user has trips in the DB, send back all the information for each trip
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

  createTrip: async (req, res) => {
    try {
      const { startDate, endDate, userid } = req.body;

      if (userid === undefined) {
        res.status(500).json({ message: 'user id is not defined' });
        return;
      }

      const data = await knex('trips')
        .insert({
          start_date: startDate,
          end_date: endDate,
          user_id: userid,
        })
        .returning('*');

      //If the trip is created, send back the information of the trip to the frontend
      if (data.length > 0) {
        res.status(200).json(data);
        return;
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updateTrip: async (req, res) => {
    try {
      const { tripID } = req.params;
      const { startDate, endDate, userid } = req.body;
      // console.log(exerciseid);
      if (userid === undefined) {
        res.status(500).json({ message: 'user id is undefined' });
        return;
      }
      //Update the trip using the trip ID
      const data = await knex('trips')
        .where({ id: tripID })
        .update({
          start_date: startDate,
          end_date: endDate,
          user_id: userid,
        })
        .returning('*');

      // If the trip is updated correctly, send back the information from the trip
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
  // Delete the trip from the DB for that user
  deleteTrip: async (req, res) => {
    try {
      const { tripID, userID } = req.body;

      if (exerciseid === undefined) {
        res.status(500).json({ message: 'trip id is not defined' });
        return;
      }

      await knex('trips')
        .where({ id: tripID })
        .andWhere({ user_id: userID })
        .del();

      res.status(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = TripsController;
