export const getValidEmail = async (knex) => knex('user_accounts')
  .select('email')
  .then((rows) => rows.map((row) => row.email));

export const getValidTripUUIDs = async (knex, validTrips) => {
  if (!validTrips || validTrips.length === 0) {
    return [];
  }

  const result = await knex('trips')
    .select('uuid')
    .whereIn('uuid', validTrips.map((trip) => trip.uuid));

  return result.map((row) => row.uuid);
};

export const getValidTagsUUIDs = async (knex, validTags) => {
  if (!validTags || validTags.length === 0) {
    return [];
  }

  const result = await knex('tags')
    .select('uuid')
    .whereIn('name', validTags.map((t) => t.name));

  return result.map((row) => row.uuid);
};

export const insertTrips = async (knex, validTrips) => knex('trips')
  .insert(validTrips)
  .onConflict('uuid')
  .ignore();

export const insertMeals = async (knex, validMeals) => knex('meals')
  .insert(validMeals)
  .onConflict('uuid')
  .ignore();

export const insertPOIs = async (knex, validPOIs) => knex('points_of_interest')
  .insert(validPOIs)
  .onConflict('uuid')
  .ignore();

export const insertHotels = async (knex, validHotels) => knex('hotels')
  .insert(validHotels)
  .onConflict('uuid')
  .ignore();

export const insertTransports = async (knex, validTransports) => knex('transports')
  .insert(validTransports)
  .onConflict('uuid')
  .ignore();

export const insertTags = async (knex, tags) => knex('tags')
  .insert(tags)
  .onConflict('name')
  .ignore();

export const insertTripTags = async (knex, tripTags) => knex('trip_tags')
  .insert(tripTags)
  .onConflict(['trips_uuid', 'tags_uuid'])
  .ignore();

export const insertRatings = async (knex, validRatings) => knex('ratings')
  .insert(validRatings)
  .onConflict('uuid')
  .ignore();

export const insertTripShares = async (knex, validTripShares) => knex('trip_shares')
  .insert(validTripShares)
  .onConflict('uuid')
  .ignore();
