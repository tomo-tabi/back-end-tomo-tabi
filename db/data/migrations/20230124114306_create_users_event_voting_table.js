/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users_events_vote', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('trips_events_id').notNullable();
    table.foreign('user_id').references('users.id');
    table.foreign('trips_events_id').references('trips_events.id');
    table.boolean('vote');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('users_events_vote');
};
