import logger from '../../../setupPino';
import { getPaginationLimit, getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import { getRatingsPaginationDB } from '../../knex/ratingsknex';

export const getAllRatingsPagination = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = getPaginationLimit(req);
    const offset = getPaginationOffset(req);

    const totalResult = await getTableTotalCountDB('ratings');
    const total = parseInt(totalResult.total, 10);

    const ratings = await getRatingsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      ratings,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching ratings ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};
