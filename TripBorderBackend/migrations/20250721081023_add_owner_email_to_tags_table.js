/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function addOwnerEmail(knex) {
  return knex.schema.table('tags', (table) => {
    table.string('owner_email').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function dropOwnerEmail(knex) {
  return knex.schema.table('tags', (table) => {
    table.dropColumn('owner_email');
  });
};
