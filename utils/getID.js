const knex = require('../db/knex');

async function getIdFromEmail(email) {
  const data = knex('users').select('id').where('email', email);
  return data;
}

module.exports = {
  getIdFromEmail,
};
