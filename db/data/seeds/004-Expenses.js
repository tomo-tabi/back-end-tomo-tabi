/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('expenses').del()
  await knex('expenses').insert([
    {id: 1, user_id: '1',  item_name: 'hotel',  money: '52500',  trip_id: '1'},
    {id: 2, user_id: '4',  item_name: 'coffee',  money: '1200.59',  trip_id: '1'},
    {id: 3, user_id: '3',  item_name: 'pizza',  money: '8900.86',  trip_id: '1'},
    {id: 4, user_id: '1',  item_name: 'breakfast',  money: '4500',  trip_id: '1'},
    {id: 5, user_id: '4',  item_name: 'Uniqlo',  money: '25345.56',  trip_id: '1'},
    {id: 6, user_id: '1',  item_name: 'Kura Sushi',  money: '56542.9',  trip_id: '1'},
    {id: 7, user_id: '2',  item_name: 'plane',  money: '153234.65',  trip_id: '1'},
    {id: 8, user_id: '3',  item_name: 'hotel',  money: '9543.26',  trip_id: '4'},
    {id: 9, user_id: '4',  item_name: 'restaurant',  money: '12656.86',  trip_id: '4'},
  ]);
};
