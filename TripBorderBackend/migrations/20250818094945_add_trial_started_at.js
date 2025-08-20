/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function addTrialFields(knex) {
  return knex.schema.table('user_accounts', (table) => {
    table.timestamp('trial_started_at', { useTz: true }).nullable().defaultTo(null);
    table.boolean('is_trialed').defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function dropTrialFields(knex) {
  return knex.schema.table('user_accounts', (table) => {
    table.dropColumn('trial_started_at');
    table.dropColumn('trial_started_at');
  });
};
