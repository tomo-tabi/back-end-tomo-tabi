/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('expenses', (table) => {
    table.integer('trip_id').notNullable();
    table.foreign('trip_id').references('trips.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('expenses', (table) => {
    table.dropColumn('trip_id');
  });
};
