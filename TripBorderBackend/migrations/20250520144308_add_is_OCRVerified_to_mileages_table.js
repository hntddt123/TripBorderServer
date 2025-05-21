/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function addIsOCRVerified(knex) {
  return knex.schema.table('mileages', (table) => {
    table.boolean('is_ocr_verified').defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function dropIsOCRVerified(knex) {
  return knex.schema.table('mileages', (table) => {
    table.dropColumn('is_ocr_verified');
  });
};
