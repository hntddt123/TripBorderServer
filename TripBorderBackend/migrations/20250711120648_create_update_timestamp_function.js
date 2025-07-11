/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function createUpdateTimeStampTrigger(knex) {
  return knex.raw(`
    CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function dropUpdateTimeStampTrigger(knex) {
  return knex.raw(`
    DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
  `);
};
