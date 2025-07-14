import { knexDBInstance } from './knexDBInstance';
import logger from '../../setupPino';

export const getMealsPaginationDB = async (limit, offset) => knexDBInstance('meals')
  .limit(limit)
  .offset(offset)
  .orderBy('trips_uuid', 'desc');

export const createMealsByTripIDDB = async (meals) => knexDBInstance('meals')
  .insert({
    uuid: knexDBInstance.fn.uuid(),
    trips_uuid: meals.trips_uuid,
    name: meals.name,
    address: meals.address,
    meal_time: meals.meal_time
  }).returning('*')
  .then((rows) => rows[0]);

export const deleteMealsByIDDB = async (mealID) => {
  const count = await knexDBInstance('meals')
    .where('uuid', mealID)
    .delete();
  logger.info(`Deleted ${count} row(s)`);
};
