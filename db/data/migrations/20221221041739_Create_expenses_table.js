/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('expenses', function (table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.foreign('user_id').references('users.id');
    table.string('item_name', 255).notNullable();
    table.string('username', 255).notNullable();
    table.decimal('money').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('expenses');
};
