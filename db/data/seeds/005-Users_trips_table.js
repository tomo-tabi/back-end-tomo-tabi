/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users_trips').del()
  await knex('users_trips').insert([
    {user_id: 1, trip_id: 1},
    {user_id: 2, trip_id: 1},
    {user_id: 3, trip_id: 1},
    {user_id: 4, trip_id: 1},
    {user_id: 5, trip_id: 1},
    {user_id: 2, trip_id: 2},
    {user_id: 3, trip_id: 2},
    {user_id: 4, trip_id: 3},
    {user_id: 5, trip_id: 3},
    {user_id: 1, trip_id: 4},
    {user_id: 2, trip_id: 4},
    {user_id: 3, trip_id: 4},
    {user_id: 5, trip_id: 2},
  ]);
};
