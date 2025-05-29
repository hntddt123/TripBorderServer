/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function createTrips(knex) {
  await knex.schema.createTable('trips', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.string('title').notNullable(); // trip name
    table.string('owner_email').notNullable();
    table
      .foreign('owner_email')
      .references('email')
      .inTable('user_accounts')
      .onDelete('CASCADE');
    table.date('start_date');
    table.date('end_date');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('meals', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.uuid('trips_uuid').notNullable();
    table
      .foreign('trips_uuid')
      .references('uuid')
      .inTable('trips')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('address'); // restaurant address
    table.timestamp('meal_time');
  });

  await knex.schema.createTable('points_of_interest', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.uuid('trips_uuid').notNullable();
    table
      .foreign('trips_uuid')
      .references('uuid')
      .inTable('trips')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('address');
  });

  await knex.schema.createTable('hotels', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.uuid('trips_uuid').notNullable();
    table
      .foreign('trips_uuid')
      .references('uuid')
      .inTable('trips')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('address');
    table.date('check_in');
    table.date('check_out');
    table.string('booking_reference');
  });

  await knex.schema.createTable('transports', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.uuid('trips_uuid').notNullable();
    table
      .foreign('trips_uuid')
      .references('uuid')
      .inTable('trips')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('type').notNullable();
    table.string('address');
    table.string('provider'); // transportation company name
    table.string('booking_reference');
    table.timestamp('departure_time');
    table.timestamp('arrival_time');
    table.string('origin');
    table.string('destination');
  });

  await knex.schema.createTable('tags', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.string('name').notNullable().unique(); // E.g., "beach", "hiking"
  });

  await knex.schema.createTable('trip_tags', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.uuid('trips_uuid').notNullable(); // Foreign key to trips
    table
      .foreign('trips_uuid')
      .references('uuid')
      .inTable('trips')
      .onDelete('CASCADE');
    table.uuid('tags_uuid').notNullable(); // Foreign key to tags
    table
      .foreign('tags_uuid')
      .references('uuid')
      .inTable('tags')
      .onDelete('CASCADE');
    table.unique(['trips_uuid', 'tags_uuid']); // Prevent duplicate trip-tag pairs
  });

  await knex.schema.createTable('ratings', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.uuid('trips_uuid').notNullable();
    table
      .foreign('trips_uuid')
      .references('uuid')
      .inTable('trips')
      .onDelete('CASCADE');
    table.uuid('entity_id').notNullable(); // must be validated in the app
    table.string('entity_type').notNullable();
    table.string('comment');
    table.integer('score').notNullable();
    table.string('owner_email').notNullable();
    table
      .foreign('owner_email')
      .references('email')
      .inTable('user_accounts')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function dropTrips(knex) {
  await knex.schema.dropTableIfExists('ratings');
  await knex.schema.dropTableIfExists('trip_tags');
  await knex.schema.dropTableIfExists('tags');
  await knex.schema.dropTableIfExists('transports');
  await knex.schema.dropTableIfExists('hotels');
  await knex.schema.dropTableIfExists('points_of_interest');
  await knex.schema.dropTableIfExists('meals');
  await knex.schema.dropTableIfExists('trips');
};
