import logger from '../../../setupPino';
import { pickAllowedFields, UPDATABLE_FIELDS } from './utility/fieldUtility';
import { getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import {
  getMealsPaginationDB,
  createMealsByTripIDDB,
  updateMealsByIDDB,
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
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      meals,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching meals ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMealsByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'meals',
  orderBy: 'meal_time',
  orderPrecedence: 'asc'
});

export const createMealsByTrip = async (req, res) => {
  try {
    const meals = req.body.data;

    const newMeals = await createMealsByTripIDDB(meals);

    return res.json({
      meals: newMeals,
    });
  } catch (error) {
    logger.error(`Error Creating Meals by trips_uuid ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMealsByID = async (req, res) => {
  const { uuid } = req.params;
  // Ownership checked by requireRowTripOwner; only allow known columns
  const updateData = pickAllowedFields(req.body?.data, UPDATABLE_FIELDS.meals);

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No updatable fields' });
  }

  try {
    const updatedRows = await updateMealsByIDDB(uuid, updateData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Meals not found' });
    }
    return res.json({ message: 'Meals Updated!' });
  } catch (error) {
    logger.error(`Error in updating Meals: ${error}`);
    return res.status(500).send({ error: 'Failed to update Meals' });
  }
};

export const deleteMealsByID = async (req, res) => {
  const mealID = req.body.data;

  try {
    await deleteMealsByIDDB(mealID);
    return res.json({ message: 'Meal Removed!' });
  } catch (error) {
    logger.error(`Error in removing Meals: ${error}`);
    return res.status(500).send({ error: 'Failed to remove Meals' });
  }
};
