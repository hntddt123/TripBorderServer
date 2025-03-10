/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function createUserAccountsTable(knex) {
  return knex.schema.createTable('user_accounts', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.string('email').unique().notNullable();
    table.string('provider').notNullable(); // e.g., 'google', 'facebook'
    table.string('provider_user_id').notNullable(); // User ID from the SSO provider
    table.string('name').notNullable();
    table.string('profile_picture');
    table.enum('role', ['user', 'premium_user', 'admin']).defaultTo('user').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function dropUserAccountsTable(knex) {
  return knex.schema.dropTable('user_accounts');
};
