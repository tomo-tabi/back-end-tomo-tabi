require('dotenv').config();
const knex = require('../../db/knex');
const auth = require('../validation/auth');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Respond to a GET request to API_URL/user/ with the email and username associated
 * with the userid contained in the req.body.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a user's email and username
 */

const getUser = async function (req, res) {
  try {
    // extract the userid from req.body
    const { userid } = req.body;

    // if there is no userid present, return an error message
    if (!userid)
      return res.status(500).json({ message: 'needed variable is undefined' });

    // extract the user's email and username from the database
    const data = await knex('users')
      .select('email', 'username')
      .where({ id: userid });

    // if there is no data, return an error message
    if (!data.length)
      return res.status(404).json({ message: 'user information not found' });

    // send the user information
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a POST request to API_URL/user/login with a jwt and username
 * with the userid contained in the req.body.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a jwt and a username
 */

const login = async function (req, res) {
  try {
    // extract the user's email and password from req.body
    const { email, password } = req.body;

    // confirm that the email and password are defined.
    if (!email || !password)
      return res.status(500).json({ message: 'needed variable is undefined' });

    // extract the user information from the database
    const data = await knex.select('*').from('users').where({ email: email });

    // confirm the user exists
    if (!data.length)
      return res.status(404).json({ message: 'email not found' });

    console.log(`login attempt by: ${data[0].email}`);

    // use bcrypt to compare the raw password to the hashed password in the database
    const valid = await bcrypt.compare(password, data[0].password);

    // if the password is incorrect exit the function
    if (!valid) return res.status(401).send('incorrect password');

    // else, create a jwt token containing the user's id
    const token = auth.createToken(data[0].id);

    // Send the username and token
    return res.status(200).json({
      token: token,
      username: data[0].username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//Create new user in the DB and send the user id, username and jwt-token back.
const signup = async function (req, res) {
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
};

//Update user information
const putUser = async function (req, res) {
  try {
    const { userid, email, username } = req.body;
    console.log(`updating information for userid ${userid}`);

    // check if there is a userid
    if (!userid)
      return res.status(500).json({ message: 'user ID is undefined' });

    const data = await knex('users')
      .returning(['email', 'username'])
      .where({ id: userid })
      .update({
        email: email,
        username: username,
      });
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
};

const deleteUser = async function (req, res) {
  // stub
};

module.exports = {
  getUser,
  login,
  signup,
  putUser,
  deleteUser,
};
