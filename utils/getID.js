const knex = require('../db/knex');

async function getIdFromEmail(email) {
  const data = knex('users').select('id').where('email', email);

  if (!data.length) return;

  return data[0].id;
}

module.exports = {
  getIdFromEmail,
};
