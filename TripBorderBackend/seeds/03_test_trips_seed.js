const {
  getTripsExample,
  getMealsExample,
  getPOIsExample,
  getHotelsExample,
  getTransportsExample,
  getTagsExample,
  getTripTagsExample,
  getRatingsExample,
  getTripSharesExample
} = require('../utility/seeds/tripsConstant');
const {
  insertTrips,
  getValidTripUUIDs,
  insertMeals,
  insertPOIs,
  insertHotels,
  insertTransports,
  insertTags,
  getValidEmail,
  getValidTagsUUIDs,
  insertTripTags,
  insertRatings,
  insertTripShares
} = require('../utility/seeds/seedKnex');
const { default: logger } = require('../setupPino');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function tripsSeed(knex) {
  logger.debug('Running 03_test_trips_seed');

  const validEmails = await getValidEmail(knex);
  const trips = getTripsExample(knex);
  const validTrips = trips.filter((trip) => validEmails.includes(trip.owner_email));
  if (validTrips.length > 0) {
    logger.debug('validTrips.length');
    logger.debug(validTrips.length);
    await insertTrips(knex, validTrips);
  }

  const tripsUUID = validTrips[0].uuid;
  logger.debug('Trip UUID');
  logger.debug(tripsUUID);

  const validTripUUIDs = await getValidTripUUIDs(knex, validTrips);

  logger.debug('validTripUUIDs');
  logger.debug(`Is TripUUIDs Array: ${Array.isArray(validTripUUIDs)}`);
  logger.debug(validTripUUIDs.length);
  logger.debug(validTripUUIDs);

  const meals = getMealsExample(tripsUUID);
  const validMeals = meals.filter((meal) => validTripUUIDs.includes(meal.trips_uuid));
  if (validMeals.length > 0) {
    logger.debug('validMeals.length');
    logger.debug(validMeals.length);
    await insertMeals(knex, validMeals);
  }

  const pointsOfInterest = getPOIsExample(tripsUUID);
  const validPOIs = pointsOfInterest.filter((poi) => validTripUUIDs.includes(poi.trips_uuid));
  if (validPOIs.length > 0) {
    logger.debug('validPOIs.length');
    logger.debug(validPOIs.length);
    await insertPOIs(knex, validPOIs);
  }

  const hotels = getHotelsExample(tripsUUID);
  const validHotels = hotels.filter((h) => validTripUUIDs.includes(h.trips_uuid));
  if (validHotels.length > 0) {
    logger.debug('validHotels.length');
    logger.debug(validHotels.length);
    await insertHotels(knex, validHotels);
  }

  const transports = getTransportsExample(tripsUUID);
  const validTransports = transports.filter((t) => validTripUUIDs.includes(t.trips_uuid));
  if (validTransports.length > 0) {
    logger.debug('validTransports.length');
    logger.debug(validTransports.length);
    await insertTransports(knex, validTransports);
  }

  const tags = getTagsExample();
  if (tags.length > 0) {
    logger.debug('tags.length');
    logger.debug(tags.length);
    await insertTags(knex, tags);
  }

  // Associate tags with the trip
  const validTagUUIDs = await getValidTagsUUIDs(knex, tags);
  const tripTags = getTripTagsExample(tripsUUID, tags);
  tripTags.filter((tt) => validTripUUIDs.includes(tt.trips_uuid) && validTagUUIDs.includes(tt.tags_uuid));
  if (tripTags.length > 0) {
    logger.debug('tripTags.length');
    logger.debug(tripTags.length);
    await insertTripTags(knex, tripTags);
  }

  const ratings = getRatingsExample(knex, tripsUUID, hotels);
  const validRatings = ratings.filter(
    (rating) => validTripUUIDs.includes(rating.trips_uuid)
      && validEmails.includes(rating.owner_email)
  );
  if (validRatings.length > 0) {
    logger.debug('validRatings.length');
    logger.debug(validRatings.length);
    await insertRatings(knex, ratings);
  }

  const tripShares = getTripSharesExample(knex, tripsUUID);
  const validTripShares = tripShares.filter((share) => validTripUUIDs.includes(share.trips_uuid));
  if (validTripShares.length > 0) {
    logger.debug('validTripShares.length');
    logger.debug(validTripShares.length);
    await insertTripShares(knex, tripShares);
  }
};
