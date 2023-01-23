/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    {
      id: 1, email: 'user1@test.com', username: 'user1', password: 'abc123',
    },
    {
      id: 2, email: 'user2@test.com', username: 'user2', password: 'abc123',
    },
    {
      id: 3, email: 'user3@test.com', username: 'user3', password: 'abc123',
    },
    {
      id: 4, email: 'user4@test.com', username: 'user4', password: 'abc123',
    },
  ]);
};
