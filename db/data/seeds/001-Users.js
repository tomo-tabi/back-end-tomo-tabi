/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    {id: 1, email: 'user1@test.com', username: 'user1', password: '$2b$10$Osc2KIxyIhnEzHfwvfdD2e23wjL5aUvAuCUxDH/SHBdkMKl5ZJ6yS'},
    {id: 2, email: 'user2@test.com', username: 'user2', password: '$2b$10$Osc2KIxyIhnEzHfwvfdD2e23wjL5aUvAuCUxDH/SHBdkMKl5ZJ6yS'},
    {id: 3, email: 'user3@test.com', username: 'user3', password: '$2b$10$Osc2KIxyIhnEzHfwvfdD2e23wjL5aUvAuCUxDH/SHBdkMKl5ZJ6yS'},
    {id: 4, email: 'user4@test.com', username: 'user4', password: '$2b$10$Osc2KIxyIhnEzHfwvfdD2e23wjL5aUvAuCUxDH/SHBdkMKl5ZJ6yS'},
    {id: 5, email: 'a@a.com', username: 'a', password: '$2b$10$Osc2KIxyIhnEzHfwvfdD2e23wjL5aUvAuCUxDH/SHBdkMKl5ZJ6yS'},
    {id: 6, email: 'b@b.com', username: 'b', password: '$2b$10$Osc2KIxyIhnEzHfwvfdD2e23wjL5aUvAuCUxDH/SHBdkMKl5ZJ6yS'}
  ]);
};
