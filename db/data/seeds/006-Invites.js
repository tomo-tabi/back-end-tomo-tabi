/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('invites').del()
  await knex('invites').insert([
    {id: 1, sender_id: "1", receiver_id: "6", status: 'pending', trip_id: "1"},
    {id: 2, sender_id: 2, receiver_id: 6, status: 'pending', trip_id: 2},
    {id: 3, sender_id: 2, receiver_id: 1, status: 'pending', trip_id: 2},
    {id: 4, sender_id: 4, receiver_id: 1, status: 'pending', trip_id: 3},
    {id: 5, sender_id: 4, receiver_id: 2, status: 'pending', trip_id: 3},
    {id: 6, sender_id: 2, receiver_id: 4, status: 'pending', trip_id: 4},
    {id: 7, sender_id: 1, receiver_id: 5, status: 'pending', trip_id: 4},
    {id: 8, sender_id: 1, receiver_id: 6, status: 'pending', trip_id: 2},
  ]);
};
