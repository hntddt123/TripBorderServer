/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function addTimeStamp(knex) {
  return knex.schema.table('points_of_interest', (table) => {
    table.timestamp('visit_time');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function dropTimeStamp(knex) {
  return knex.schema.table('points_of_interest', (table) => {
    table.dropColumn('visit_time');
  });
};
