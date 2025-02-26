/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function createMileagesTable(knex) {
  return knex.schema.createTable('mileages', (table) => {
    table.increments('id').primary();
    table.string('frequent_flyer_number').unique().notNullable();
    table.string('airline').notNullable();
    table.decimal('mileage_price', 10, 2).notNullable();
    table.decimal('mileage_amount', 12, 2).notNullable();
    table.enum('mileage_unit', ['miles', 'km']).notNullable();
    table.string('mileage_picture').notNullable();
    table.timestamp('mileage_expired_at').notNullable().defaultTo('9999-12-31');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function dropMileagesTable(knex) {
  return knex.schema.dropTable('mileages');
};
