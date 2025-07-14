import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import {
  getMealsPaginationDB,
  createMealsByTripIDDB,
  deleteMealsByIDDB
} from '../../knex/mealsknex';
import { getResourcesByTripID } from './utility/genericControllerUtility';

export const getAllMealsPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getTableTotalCountDB('meals');
    const total = parseInt(totalResult.total, 10);

    const meals = await getMealsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      meals,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching meals ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMealsByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'meals',
  orderBy: 'meal_time'
});

export const createMealsByTrip = async (req, res) => {
  try {
    const meals = req.body.data;

    const newMeals = await createMealsByTripIDDB(meals);

    res.json({
      meals: newMeals,
    });
  } catch (error) {
    logger.error(`Error Creating Meals by trips_uuid ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMealsByID = async (req, res) => {
  const mealID = req.body.data;

  try {
    await deleteMealsByIDDB(mealID);
    res.json({ message: 'Meal Removed!' });
  } catch (error) {
    logger.error(`Error in removing Meals: ${error}`);
    res.status(500).send({ error: 'Failed to remove Meals' });
  }
};
