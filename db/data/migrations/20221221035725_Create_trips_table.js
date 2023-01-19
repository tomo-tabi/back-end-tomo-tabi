/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('trips', (table) => {
    table.increments('id').primary();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.integer('user_id').notNullable();
    table.foreign('user_id').references('users.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('trips');
};
