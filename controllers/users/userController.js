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
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

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
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

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

/**
 * Respond to a POST request to API_URL/user/signup with the user's username
 * and a jwt containing the new users id
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a jwt and a username
 */

const signup = async function (req, res) {
  try {
    // extract the users information from req.body
    const { email, password, username } = req.body;

    // confirm all required data is defined
    if (!email || !password || !username)
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

    // hash password with bcrypt
    const hash = await bcrypt.hash(password, saltRounds);

    // create a user object to insert into the users table
    const newUser = {
      email: email,
      password: hash,
      username: username,
    };

    // insert the new user into the users table
    const data = await knex('users')
      .returning(['id', 'username'])
      .insert(newUser);
    console.log('user created:');
    console.log(data[0]);

    // create a jwt token containing the user id
    const token = auth.createToken(data[0].id);

    // send the username and token
    return res.status(201).json({
      token: token,
      username: data[0]['username'],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a PUT request to API_URL/user/update with the new username and email
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a username and email
 */

const putUser = async function (req, res) {
  try {
    // extract all required information from req.body
    const { userid, email, username } = req.body;

    // confirm all required data is defined
    if (!userid || !email || !username)
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });

    // update the user's information in the database
    const data = await knex('users')
      .returning(['email', 'username'])
      .where({ id: userid })
      .update({
        email: email,
        username: username,
      });

    // confirm new data exists
    if (!data.length) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    // send the data
    res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Respond to a DELETE request to API_URL/user/delete with a status of 200
 * @todo implement this function
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a 200 status code
 */
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
