/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('trips_events', function (table) {
    table.dropColumn('trips_id');
    table.integer('trip_id').notNullable();
    table.foreign('trip_id').references('trips.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('trips_events', function (table) {
    table.dropColumn('trip_id');
    table.integer('trips_id').notNullable();
    table.foreign('trips_id').references('trips.id');
  });
};
