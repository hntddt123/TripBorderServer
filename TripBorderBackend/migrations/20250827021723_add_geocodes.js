/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function addGeocodes(knex) {
  function addLocation(table) {
    table.point('location'); // Built-in PG point type (x=lon, y=lat)
  }

  await knex.schema.table('meals', (table) => {
    addLocation(table);
  });
  await knex.schema.table('points_of_interest', (table) => {
    addLocation(table);
  });
  await knex.schema.table('hotels', (table) => {
    addLocation(table);
  });
  await knex.schema.table('transports', (table) => {
    addLocation(table);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function dropGeocodes(knex) {
  await knex.schema.table('meals', (table) => {
    table.dropColumn('location');
  });
  await knex.schema.table('points_of_interest', (table) => {
    table.dropColumn('location');
  });
  await knex.schema.table('hotels', (table) => {
    table.dropColumn('location');
  });
  await knex.schema.table('transports', (table) => {
    table.dropColumn('location');
  });
};
