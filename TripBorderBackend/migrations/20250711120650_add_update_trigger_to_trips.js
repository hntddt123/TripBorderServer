const tableName = 'trips';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function createTripTrigger(knex) {
  await knex.raw(`
    CREATE TRIGGER update_trips_timestamp
    BEFORE UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function dropTripTrigger(knex) {
  await knex.raw(`
    DROP TRIGGER IF EXISTS update_trips_timestamp ON ${tableName};
  `);
};
