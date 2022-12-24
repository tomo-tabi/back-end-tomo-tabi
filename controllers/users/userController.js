require('dotenv').config();
const jwt = require('jsonwebtoken');
const knex = require('../../db/knex');
const auth = require('../validation/auth');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserController = {
  // Get the user informmation for the profile page
  getUserById: async (req, res) => {
    try {
      const { userid } = req.params;
      console.log(userid);

      if (userid === undefined) {
        res.status(500).json({ message: 'User is undefined' });
        return;
      }
      //Send back all the information from our DB
      const data = await knex('users').select('*').where({ id: userid });

      if (data.length > 0) {
        res.status(200).json(data[0]);
        return;
      }
      res.status(404).json({ message: 'user not found' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  //Get information from frontend and check if user exists and send the user id, username and jwt-token back.
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      //Check if the email exists
      if (email === undefined) {
        res.status(500).json({ message: 'email is not defined' });
        return;
      }

      const data = await knex.select('*').from('users').where({ email: email }); //Check if the user exists

      if (!data.length) return res.status(400).send('email not found');

      console.log(`login attempt by: ${data[0].email}`);

      const valid = await bcrypt.compare(password, data[0].password);

      if (!valid) return res.status(401).send('incorrect password');

      const token = auth.createToken(data[0].id);
      //Send back the username and token to the frontend so they can store it and keep for authentification
      res.status(200).json({
        token: token,
        username: data[0]['username'],
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  //Create new user in the DB and send the user id, username and jwt-token back.
  signup: async (req, res) => {
    try {
      const { email, password, username } = req.body;
      console.log(email, username);

      // hash password with bcrypt
      const hash = await bcrypt.hash(password, saltRounds);

      const newUser = [
        {
          email: email,
          password: hash,
          username: username,
        },
      ];
      const data = await knex('users')
        .returning(['id', 'username'])
        .insert(newUser);
      console.log('user created:');
      console.log(data);

      const token = auth.createToken(data[0].id);

      res.status(201).json({
        token: token,
        username: data[0]['username'],
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  //Update user information
  putUser: async (req, res) => {
    try {
      const { userid } = req.params;
      const { email, password, username } = req.body;
      console.log(userid);

      if (userid === undefined) {
        res.status(500).json({ message: 'user ID is undefined' });
        return;
      }
      const data = await knex('users')
        .where({ id: userid })
        .update({
          email: email,
          password: password,
          username: username,
        })
        .returning('*');

      // Send the updated information
      if (data.length > 0) {
        res.status(200).json(data[0]);
        return;
      }
      res.status(404).json({ message: 'Not found' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  deleteUser: async (req, res) => {
    // stub
  },
};

module.exports = UserController;
