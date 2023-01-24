require('dotenv').config({ path: '../.env' });
const knex = require('knex');
const knexConfig = require('./knexfile');
const NODE_ENV = process.env.NODE_ENV;

console.log(knexConfig.NODE_ENV);

module.exports = knex(knexConfig.NODE_ENV);
