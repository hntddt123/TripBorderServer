import logger from '../../../../setupPino';
import {
  getTableTotalCountByEmailDB,
  getResourcesByEmailPaginationDB,
  getResourcesByTripIDDB
} from '../../../knex/utilityknex';
import { omitFieldsFromRows, parsePagination } from './fieldUtility';

export const getResourcesByEmailPagination = async (req, res, { resourceName, orderBy, orderPrecedence }) => {
  try {
    // Scope to the authenticated caller (requireAuth); ignore req.body.email
    const { email } = req.user;
    const { page, limit, offset } = parsePagination(req.body);

    const totalResult = await getTableTotalCountByEmailDB(
      resourceName,
      {
        ownerEmail: email
      }
    );
    const total = parseInt(totalResult.total, 10);

    const resources = await getResourcesByEmailPaginationDB(
      resourceName,
      {
        ownerEmail: email,
        limit: limit,
        offset: offset,
        orderBy: orderBy,
        orderPrecedence: orderPrecedence
      }
    );

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      [resourceName]: resources,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching ${resourceName}} by email ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Trip access is checked by requireTripReadAccess (req.trip, req.tripAccess).
// publicOmitFields are stripped when the caller only sees the trip because it is public.
export const getResourcesByTripID = async (req, res, { resourceName, orderBy, orderPrecedence, publicOmitFields = [] }) => {
  try {
    const tripID = req.trip.uuid;

    const resources = await getResourcesByTripIDDB(
      resourceName,
      {
        tripID: tripID,
        orderBy: orderBy,
        orderPrecedence: orderPrecedence
      }
    );

    const visibleResources = (req.tripAccess === 'public')
      ? omitFieldsFromRows(resources, publicOmitFields)
      : resources;

    return res.json({
      [resourceName]: visibleResources,
    });
  } catch (error) {
    logger.error(`Error Fetching ${resourceName} by trips_uuid ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
