/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('invites', function (table) {
    table.increments('id').primary();
    table.integer('sender_id').notNullable();
    table.foreign('sender_id').references('users.id');
    table.integer('receiver_id').notNullable();
    table.foreign('receiver_id').references('users.id');
    table.string('status').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('invites');
};
