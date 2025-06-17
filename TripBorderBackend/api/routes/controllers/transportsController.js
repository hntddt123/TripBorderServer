import logger from '../../../setupPino';
import { getPaginationLimit, getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import { getTransportsPaginationDB } from '../../knex/transportsknex';
import { getResourcesByTripID } from './utility/genericControllerUtility';

export const getAllTransportsPagination = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = getPaginationLimit(req);
    const offset = getPaginationOffset(req);

    const totalResult = await getTableTotalCountDB('transports');
    const total = parseInt(totalResult.total, 10);

    const transports = await getTransportsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      transports,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching transports ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTransportsByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'transports',
  orderBy: 'departure_time'
});
