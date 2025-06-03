import logger from '../../../setupPino';
import { getPaginationLimit, getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import { getTripTagsPaginationDB } from '../../knex/trip_tagsknex';

export const getAllTripTagsPagination = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = getPaginationLimit(req);
    const offset = getPaginationOffset(req);

    const totalResult = await getTableTotalCountDB('trip_tags');
    const total = parseInt(totalResult.total, 10);

    const tripTags = await getTripTagsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      tripTags,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching tripTags ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};
