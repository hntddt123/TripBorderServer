import logger from '../../../../setupPino';
import {
  getTableTotalCountByEmailDB,
  getResourcesByEmailPaginationDB,
  getResourcesByTripIDDB
} from '../../../knex/utilityknex';
import {
  getPaginationLimit,
  getPaginationOffset
} from './paginationUtility';

export const getResourcesByEmailPagination = async (req, res, { resourceName }) => {
  try {
    const ownerEmail = req.body.email;
    const { page } = req.query;
    const limit = getPaginationLimit(req);
    const offset = getPaginationOffset(req);

    const totalResult = await getTableTotalCountByEmailDB(
      resourceName,
      {
        ownerEmail: ownerEmail
      }
    );
    const total = parseInt(totalResult.total, 10);

    const resources = await getResourcesByEmailPaginationDB(
      resourceName,
      {
        ownerEmail: ownerEmail,
        limit: limit,
        offset: offset
      }
    );

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      [resourceName]: resources,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching ${resourceName}} by email ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getResourcesByTripID = async (req, res, { resourceName, orderBy }) => {
  try {
    const { tripID } = req.body;

    const resources = await getResourcesByTripIDDB(
      resourceName,
      {
        tripID: tripID,
        orderBy: orderBy
      }
    );

    res.json({
      [resourceName]: resources,
    });
  } catch (error) {
    logger.error(`Error Fetching ${resourceName} by trips_uuid ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};
