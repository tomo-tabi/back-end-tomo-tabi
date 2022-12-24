/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('tripsEvents', function (table) {
    table.increments('id').primary();
    table.integer('trips_id').notNullable();
    table.foreign('trips_id').references('trips.id');
    table.string('event_name', 255).notNullable();
    table.date('event_date').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('tripsEvents');
};
