const bcrypt = require('bcrypt');
const knex = require('../../db/knex');
const auth = require('../../middleware/auth');
const {
  handleInternalServerError,
  checkForUndefined,
} = require('../errors/errorController');
const ERROR = require('../errors/errorConstants');

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

    if (checkForUndefined(userid)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const userArray = await knex('users')
      .select('email', 'username')
      .where({ id: userid });

    if (!userArray.length) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.status(200).json(userArray[0]);
  } catch (error) {
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

    if (checkForUndefined(password)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const {
      id,
      username,
      email: db_email,
      password: hashed_password,
    } = (
      await knex
        .select(['id', 'username', 'email', 'password'])
        .from('users')
        .where({ email })
    )[0];

    if (!id) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    const isValidPassword = await bcrypt.compare(password, hashed_password);

    if (!isValidPassword)
      return res.status(401).json({ message: 'incorrect password' });

    const token = auth.createToken(id);

    const loginObject = {
      token,
      username,
      email: db_email,
    };

    return res.status(200).json(loginObject);
  } catch (error) {
    return handleInternalServerError(error, res);
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

    if (checkForUndefined(password, username)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const {
      id,
      username: db_username,
      email: db_email,
    } = (
      await knex('users').returning(['id', 'username', 'email']).insert({
        email,
        password: hashedPassword,
        username,
      })
    )[0];

    if (!id) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    const token = auth.createToken(id);

    const loginObject = {
      token,
      username: db_username,
      email: db_email,
    };

    return res.status(201).json(loginObject);
  } catch (error) {
    return handleInternalServerError(error, res);
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

    if (checkForUndefined(userid, username)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const updatedUserId = (
      await knex('users').where({ id: userid }).update(
        {
          email,
          username,
        },
        ['id']
      )
    )[0].id;

    if (!updatedUserId) {
      return res.status(404).json(ERROR.ITEM_NOT_FOUND);
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
}

/**
 * Respond to a PUT request to API_URL/user/password with a status of 200
 * @todo implement this function
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http response containing a 200 status code
 */

async function putPassword(req, res) {
  try {
    const { oldPassword, password, userid, email } = req.body;

    if (checkForUndefined(password, oldPassword, email)) {
      return res.status(400).json(ERROR.UNDEFINED_VARIABLE);
    }

    const userArray = await knex
      .select(['id', 'username', 'email', 'password'])
      .from('users')
      .where({ email });

    if (!userArray.length) {
      return res.status(404).json({ message: 'email not found' });
    }

    const isValidPassword = await bcrypt.compare(
      oldPassword,
      userArray[0].password
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: 'incorrect old password' });
    }

    const hashNewPassword = await bcrypt.hash(password, saltRounds);

    const NewUserArray = await knex('users')
      .returning(['id', 'username'])
      .where({ id: userid })
      .update({
        password: hashNewPassword,
      });

    if (!NewUserArray.length) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    const token = auth.createToken(userArray[0].id);

    const userObject = {
      token,
      username: userArray[0].username,
      email: userArray[0].email,
    };

    return res.status(200).json(userObject);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
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
