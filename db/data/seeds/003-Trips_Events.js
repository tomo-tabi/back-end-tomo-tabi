/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('trips_events').del();
  await knex('trips_events').insert([
    {
      id: 1, event_name: 'Tokyo Tower', event_date: '2023-01-02', trip_id: '1', description: "I love this 1!"
    },
    {
      id: 2, event_name: 'Sky Tree', event_date: '2023-01-03', trip_id: '1', description: "I love this 2!"
    },
    {
      id: 3, event_name: 'USJ', event_date: '2023-01-05', trip_id: '1', description: "I love this 3!"
    },
    {
      id: 4, event_name: 'Osaka Castle', event_date: '2023-01-10', trip_id: '1',
    },
    {
      id: 5, event_name: 'Okonomiyaki', event_date: '2023-01-11', trip_id: '1', description: "I love this 5!"
    },
    {
      id: 6, event_name: 'Museum of Fine Arts', event_date: '2023-01-29', trip_id: '2', description: "I love this 6!"
    },
    {
      id: 7, event_name: 'Fenway Park', event_date: '2023-02-01', trip_id: '2', description: "I love this 7!"
    },
    {
      id: 8, event_name: 'Freedom Trail', event_date: '2023-02-05', trip_id: '2', description: "I love this 8!"
    },
    {
      id: 9, event_name: 'Gyeongbokgung Palace', event_date: '2023-03-07', trip_id: '3', description: "I love this 9!"
    },
    {
      id: 10, event_name: 'Bukhansan National Park', event_date: '2023-03-09', trip_id: '3', description: "I love this 10!"
    },
    {
      id: 11, event_name: 'Myeongdong Shopping Street', event_date: '2023-03-12', trip_id: '3', description: "I love this 11!"
    },
    {
      id: 12, event_name: 'La Boqueria', event_date: '2022-12-26', trip_id: '4', description: "I love this 12!"
    },
    {
      id: 13, event_name: 'Sagrada Familia', event_date: '2022-12-23', trip_id: '4', description: "I love this 13!"
    },
  ]);
};
