/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('trips').del();
  await knex('trips').insert([
    {
      id: 1, start_date: '2023-01-01', end_date: '2023-01-12', name: 'Japan', is_locked: true, owner_id:1
    },
    {
      id: 2, start_date: '2023-01-26', end_date: '2023-02-09', name: 'Boston', is_locked: false, owner_id:2
    },
    {
      id: 3, start_date: '2023-03-05', end_date: '2023-03-15', name: 'South Korea', is_locked: false, owner_id:3
    },
    {
      id: 4, start_date: '2022-12-21', end_date: '2022-12-31', name: 'Barcelona', is_locked: true, owner_id:4
    },
  ]);
};
