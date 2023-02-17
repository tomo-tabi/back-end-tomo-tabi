const knex = require('../../db/knex');

async function getExpenses(tripid) {
  return await knex('expenses')
    .join('users', 'users.id', 'user_id')
    .select([
      'expenses.id',
      'item_name',
      'money',
      'trip_id',
      'email',
      'username',
    ])
    .where({ trip_id: tripid });
}

module.exports = {
  getExpenses,
};
