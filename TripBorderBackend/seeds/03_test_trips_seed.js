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
    return knex('trips')
      .insert(validTrips)
      .onConflict('uuid')
      .ignore();
  }
  const tripsUuid = trips.uuid;

  const validTripUuids = (
    await knex('trips')
      .select('uuid')
      .whereIn('uuid', trips.map((trip) => trip.uuid))
  ).map((row) => row.uuid);

  const meals = [
    {
      id: 1,
      trips_uuid: tripsUuid,
      name: 'Dinner at Ichiran',
      address: '123 Japan, Japan',
      meal_time: '2025-07-02 19:00:00',
    }
  ];

  const validMeals = meals.filter((meal) => validTripUuids.includes(meal.trips_uuid));
  if (validMeals.length > 0) {
    return knex('meals')
      .insert(validMeals)
      .onConflict('id')
      .ignore();
  }

  const pointOfInterest = [
    {
      id: 1,
      trips_uuid: tripsUuid,
      name: 'Skytree',
      address: 'Asakusa, Japan',
    }
  ];
  const validPOIs = pointOfInterest.filter((poi) => validTripUuids.includes(poi.trips_uuid));
  if (validPOIs.length > 0) {
    return knex('point_of_interests')
      .insert(validPOIs)
      .onConflict('id')
      .ignore();
  }

  const hotels = [
    {
      id: 1,
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
    return knex('hotels')
      .insert(validHotels)
      .onConflict('id')
      .ignore();
  }

  const transports = [
    {
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
    return knex('transports')
      .insert(validTransports)
      .onConflict('id')
      .ignore();
  }

  const tags = [
    { id: 1, name: 'city' },
    { id: 2, name: 'culture' },
  ];

  if (tags.length > 0) {
    await knex('tags')
      .insert(tags)
      .onConflict('name')
      .ignore();
  }

  // Associate tags with the trip
  const tagNames = tags.map((t) => t.name);
  const validTagIds = await knex('tags')
    .select('id')
    .whereIn('name', tagNames)
    .map((row) => row.id);

  const tripTags = [
    { trips_uuid: tripsUuid, tag_id: tags[0].id },
    { trips_uuid: tripsUuid, tag_id: tags[1].id },
  ].filter((tt) => validTripUuids.includes(tt.trips_uuid) && validTagIds.includes(tt.tag_id));

  if (tripTags.length > 0) {
    await knex('trip_tags')
      .insert(tripTags)
      .onConflict(['trips_uuid', 'tag_id'])
      .ignore();
  }

  const ratings = [
    {
      id: 1,
      trips_uuid: tripsUuid,
      entity_type: 'hotel',
      entity_id: hotels.id,
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
    await knex('ratings')
      .insert(validRatings)
      .onConflict('id')
      .ignore();
  }

  return null;
};
