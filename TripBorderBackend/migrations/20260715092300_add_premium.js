/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function addPremiumFields(knex) {
  return knex.schema.table('user_accounts', (table) => {
    table.timestamp('premium_started_at', { useTz: true }).nullable().defaultTo(null);
    table.string('stripe_customer_id').nullable().defaultTo(null);
    table.string('stripe_subscription_id').nullable().defaultTo(null);
    table.timestamp('subscription_end_at', { useTz: true }).nullable().defaultTo(null);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function dropPremiumFields(knex) {
  return knex.schema.table('user_accounts', (table) => {
    table.dropColumn('premium_started_at');
    table.dropColumn('stripe_customer_id');
    table.dropColumn('stripe_subscription_id');
    table.dropColumn('subscription_end_at');
  });
};
