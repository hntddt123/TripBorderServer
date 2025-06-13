import {
  getTripsTotalCountDB,
  getTripsPaginationDB,
  getTripsByEmailPaginationDB
} from '../../knex/tripsknex';
import logger from '../../../setupPino';
import { getPaginationLimit, getPaginationOffset } from './utility/paginationUtility';
import { getResourcesByEmailPaginationDB, getTableTotalCountByEmailDB } from '../../knex/utilityknex';
import { getResourcesByEmailPagination } from './utility/genericControllerUtility';

export const getAllTripsPagination = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = getPaginationLimit(req);
    const offset = getPaginationOffset(req);

    const totalResult = await getTripsTotalCountDB();
    const total = parseInt(totalResult.total, 10);

    const trips = await getTripsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      trips,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching trips ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTripsByEmailPagination = async (req, res) => getResourcesByEmailPagination(req, res, {
  resourceName: 'trips'
});
