/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function addSharedEmail(knex) {
  await knex.schema.table('trips', (table) => {
    table.enum('shared_mode', ['private', 'shared', 'public'])
      .notNullable()
      .defaultTo('private');
  });

  // check ^[^\s@]+@[^\s@]+\.[^\s@]+$ when insert in endpoint
  await knex.schema.createTableIfNotExists('trip_shares', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.uuid('trips_uuid').notNullable();
    table.string('shared_email').nullable();
    table.timestamp('shared_at').defaultTo(knex.fn.now());
    table.timestamps(true, true);

    table
      .foreign('trips_uuid')
      .references('uuid')
      .inTable('trips')
      .onDelete('CASCADE');
    // Prevent the same email being shared multiple times to the same trip
    table.unique(['trips_uuid', 'shared_email']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function dropSharedEmail(knex) {
  await knex.schema.table('trips', (table) => {
    table.dropColumn('shared_mode');
  });

  await knex.schema.dropTableIfExists('trip_shares');
};
