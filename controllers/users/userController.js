const bcrypt = require('bcrypt');
const knex = require('../../db/knex');
const auth = require('../../middleware/auth');

const saltRounds = 10;

/**
 * Respond to a GET request to API_URL/user/ with the email and username associated
 * with the userid contained in the req.body.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a user's email and username
 */

async function getUser(req, res) {
  try {
    const { userid } = req.body;

    if (!userid) {
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });
    }

    const userArray = await knex('users')
      .select('email', 'username')
      .where({ id: userid });

    if (!userArray.length) {
      return res.status(404).json({ message: 'user information not found' });
    }

    return res.status(200).json(userArray[0]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * Respond to a POST request to API_URL/user/login with a jwt and username
 * with the userid contained in the req.body.
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a jwt and a username
 */

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!password) {
      return res.status(500).json({ message: 'password is undefined' });
    }

    const userArray = await knex.select('*').from('users').where({ email });

    if (!userArray.length) {
      return res.status(404).json({ message: 'email not found' });
    }

    const valid = await bcrypt.compare(password, userArray[0].password);

    if (!valid) return res.status(401).json({ message: 'incorrect password' });

    const token = auth.createToken(userArray[0].id);

    return res.status(200).json({
      token,
      username: userArray[0].username,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * Respond to a POST request to API_URL/user/signup with the user's username
 * and a jwt containing the new users id
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a jwt and a username
 */

async function signup(req, res) {
  try {
    const { email, password, username } = req.body;

    if (!password || !username) {
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });
    }

    const hash = await bcrypt.hash(password, saltRounds);

    const userArray = await knex('users').returning(['id', 'username']).insert({
      email,
      password: hash,
      username,
    });

    const token = auth.createToken(userArray[0].id);

    return res.status(201).json({
      token,
      username: userArray[0].username,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * Respond to a PUT request to API_URL/user/update with the new username and email
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a username and email
 */

async function putUser(req, res) {
  try {
    const { userid, email, username } = req.body;

    if (!userid || !username) {
      return res
        .status(500)
        .json({ message: 'required variable is undefined' });
    }

    const userArray = await knex('users')
      .returning(['email', 'username'])
      .where({ id: userid })
      .update({
        email,
        username,
      });

    if (!userArray.length) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(200).json(userArray[0]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * Respond to a PUT request to API_URL/user/password with a status of 200
 * @todo implement this function
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a 200 status code
 */

// eslint-disable-next-line no-unused-vars
async function putPassword(req, res) {
  // possible steps
  // user must submit existing password to change it.
  // {password, newPassword, userid}
  // check if password is correct with bcrypt
  // if correct, hash the newPassword with bcrypt and update the user
  // send back new jwt containing userid
}

/**
 * Respond to a DELETE request to API_URL/user/delete with a status of 200
 * @todo implement this function
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a 200 status code
 */

// eslint-disable-next-line no-unused-vars
async function deleteUser(req, res) {
  // stub
}

module.exports = {
  getUser,
  login,
  signup,
  putUser,
  putPassword,
  deleteUser,
};
