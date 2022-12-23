/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


//We should create a new migartion and update this table to have a trip id column
//In the temp file I wrote the code as if we already had this value with the name trip_id


exports.up = function(knex) {
    return knex.schema.createTable("expenses", function (table) {
		table.increments("id").primary();
		table.integer("user_id").notNullable()
        table.foreign("user_id").references("users.id")
        table.string("item_name", 255).notNullable()
        table.string("username", 255).notNullable()
        table.decimal("money").notNullable()
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('expenses');
};
