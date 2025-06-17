import logger from '../../../setupPino';
import { getPaginationLimit, getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import { getMealsPaginationDB } from '../../knex/mealsknex';
import { getResourcesByTripID } from './utility/genericControllerUtility';

export const getAllMealsPagination = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = getPaginationLimit(req);
    const offset = getPaginationOffset(req);

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
