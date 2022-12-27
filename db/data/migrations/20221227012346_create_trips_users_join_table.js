/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users_trips', function (table) {
    table.increments().primary();
    table.integer('user_id').notNullable;
    table.foreign('user_id').references('users.id');
    table.integer('trip_id').notNullable;
    table.foreign('trip_id').references('trips.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('users_trips');
};
