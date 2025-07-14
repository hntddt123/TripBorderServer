import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import { getPOIsPaginationDB } from '../../knex/poiknex';
import { getResourcesByTripID } from './utility/genericControllerUtility';

export const getAllPOIsPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getTableTotalCountDB('points_of_interest');
    const total = parseInt(totalResult.total, 10);

    const pois = await getPOIsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      pois,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching points_of_interest ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPOIsByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'points_of_interest',
  orderBy: 'name'
});
