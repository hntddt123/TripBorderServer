import logger from '../../../setupPino';
import { getPaginationLimit, getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import { getHotelsPaginationDB } from '../../knex/hotelsknex';
import { getResourcesByTripID } from './utility/genericControllerUtility';

export const getAllHotelsPagination = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = getPaginationLimit(req);
    const offset = getPaginationOffset(req);

    const totalResult = await getTableTotalCountDB('hotels');
    const total = parseInt(totalResult.total, 10);

    const hotels = await getHotelsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      hotels,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching hotels ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHotelsByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'hotels',
  orderBy: 'check_in'
});
