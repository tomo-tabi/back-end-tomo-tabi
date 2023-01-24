const knex = require('../../db/knex');

/**
 * Respond to a GET request to API_URL/vote/:eventid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an array of vote table objects containing
 * { [ { username, vote } ], numOfUsers, numOfYesVotes, numOfNoVotes, numNotVoted }
 */

async function getVotes(req, res) {}

/**
 * Respond to a GET request to API_URL/vote/:eventid/user
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns the users vote info for the selected event
 * {vote, voteid}
 */

async function getUserVote(req, res) {}

/**
 * Respond to a POST request to API_URL/vote/yes/:eventid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http 201 status
 */

async function createYesVote(req, res) {}

/**
 * Respond to a POST request to API_URL/vote/no/:eventid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http 201 status
 */

async function createNoVote(req, res) {}

/**
 * Respond to a PUT request to API_URL/vote/yes/:voteid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http 200 status
 */

async function updateYesVote(req, res) {}

/**
 * Respond to a PUT request to API_URL/vote/no/:voteid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http 200 status
 */

async function updateNoVote(req, res) {}

/**
 * Respond to a DELETE request to API_URL/vote/:voteid
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @returns {Response} returns an http 200 status
 */

async function deleteVote(req, res) {}

module.exports = {
  getVotes,
  getUserVote,
  createYesVote,
  createNoVote,
  updateYesVote,
  updateNoVote,
};
