const { default: logger } = require('../setupPino');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function tripsSeed(knex) {
  const validEmails = await knex('user_accounts')
    .select('email')
    .then((rows) => rows.map((row) => row.email));

  const trips = [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440001', // Fixed UUID for predictability
      title: 'Japan Vacation 2025',
      owner_email: 'test@tripborder.com',
      start_date: '2025-07-01',
      end_date: '2025-07-07',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    }
  ];

  const validTrips = trips.filter((trip) => validEmails.includes(trip.owner_email));
  if (validTrips.length > 0) {
    logger.debug('validTrips.length');
    logger.debug(validTrips.length);
    await knex('trips')
      .insert(validTrips)
      .onConflict('uuid')
      .ignore();
  }
  const tripsUuid = trips[0].uuid;

  const validTripUuids = (
    await knex('trips')
      .select('uuid')
      .whereIn('uuid', trips.map((trip) => trip.uuid))
  ).map((row) => row.uuid);

  const meals = [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440002', // Fixed UUID for predictability
      trips_uuid: tripsUuid,
      name: 'Dinner at Ichiran',
      address: '123 Japan, Japan',
      meal_time: '2025-07-02 19:00:00',
    }
  ];

  const validMeals = meals.filter((meal) => validTripUuids.includes(meal.trips_uuid));
  if (validMeals.length > 0) {
    logger.debug('validMeals.length');
    logger.debug(validMeals.length);
    await knex('meals')
      .insert(validMeals)
      .onConflict('uuid')
      .ignore();
  }

  const pointsOfInterest = [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440003', // Fixed UUID for predictability
      trips_uuid: tripsUuid,
      name: 'Skytree',
      address: 'Asakusa, Japan',
    }
  ];

  const validPOIs = pointsOfInterest.filter((poi) => validTripUuids.includes(poi.trips_uuid));
  if (validPOIs.length > 0) {
    logger.debug('validPOIs.length');
    logger.debug(validPOIs.length);
    await knex('points_of_interest')
      .insert(validPOIs)
      .onConflict('uuid')
      .ignore();
  }

  const hotels = [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440004', // Fixed UUID for predictability
      trips_uuid: tripsUuid,
      name: 'Hilton Osaka',
      address: '456 Avenue, Osaka',
      check_in: '2025-07-01',
      check_out: '2025-07-07',
      booking_reference: 'HIL123456',
    }
  ];

  const validHotels = hotels.filter((h) => validTripUuids.includes(h.trips_uuid));
  if (validHotels.length > 0) {
    logger.debug('validHotels.length');
    logger.debug(validHotels.length);
    await knex('hotels')
      .insert(validHotels)
      .onConflict('uuid')
      .ignore();
  }

  const transports = [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440005',
      trips_uuid: tripsUuid,
      name: 'Flight to Japan',
      type: 'Flight',
      address: 'NRT Airport, Japan',
      provider: 'ANA',
      booking_reference: 'ANA789',
      departure_time: '2025-07-01 08:00:00',
      arrival_time: '2025-07-01 12:00:00',
      origin: 'TPE, Taiwan',
      destination: 'NRT, Japan',
    }
  ];

  const validTransports = transports.filter((t) => validTripUuids.includes(t.trips_uuid));
  if (validTransports.length > 0) {
    logger.debug('validTransports.length');
    logger.debug(validTransports.length);
    await knex('transports')
      .insert(validTransports)
      .onConflict('uuid')
      .ignore();
  }

  const tags = [
    { uuid: '550e8400-e29b-41d4-a716-446655440006', name: 'city' },
    { uuid: '550e8400-e29b-41d4-a716-446655440007', name: 'culture' },
  ];

  if (tags.length > 0) {
    logger.debug('tags.length');
    logger.debug(tags.length);
    await knex('tags')
      .insert(tags)
      .onConflict('name')
      .ignore();
  }

  // Associate tags with the trip
  const validTagUUIDs = (await knex('tags')
    .select('uuid')
    .whereIn('name', tags.map((t) => t.name))
  ).map((row) => row.uuid);

  const tripTags = [
    { trips_uuid: tripsUuid, tags_uuid: tags[0].uuid },
    { trips_uuid: tripsUuid, tags_uuid: tags[1].uuid },
  ].filter((tt) => validTripUuids.includes(tt.trips_uuid) && validTagUUIDs.includes(tt.tags_uuid));

  if (tripTags.length > 0) {
    logger.debug('tripTags.length');
    logger.debug(tripTags.length);
    await knex('trip_tags')
      .insert(tripTags)
      .onConflict(['trips_uuid', 'tags_uuid'])
      .ignore();
  }

  const ratings = [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440008',
      trips_uuid: tripsUuid,
      entity_id: hotels[0].uuid,
      entity_type: 'hotel',
      comment: 'Great stay, friendly staff!',
      score: 4,
      owner_email: 'test@tripborder.com',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    }
  ];

  const validRatings = ratings.filter(
    (rating) => validTripUuids.includes(rating.trips_uuid)
      && validEmails.includes(rating.owner_email)
  );
  if (validRatings.length > 0) {
    logger.debug('validRatings.length');
    logger.debug(validRatings.length);
    await knex('ratings')
      .insert(validRatings)
      .onConflict('uuid')
      .ignore();
  }
};
