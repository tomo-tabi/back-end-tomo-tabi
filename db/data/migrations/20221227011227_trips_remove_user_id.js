/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('trips', (table) => {
    table.dropColumn('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('trips', (table) => {
    table.integer('user_id').notNullable();
    table.foreign('user_id').references('users.id');
  });
};
