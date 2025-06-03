import {
  getTripsTotalCountDB,
  getTripsPaginationDB,
  getTripsTotalCountByEmailDB,
  getTripsByEmailPaginationDB
} from '../../knex/tripsknex';
import logger from '../../../setupPino';
import { getPaginationLimit, getPaginationOffset } from './utility/paginationUtility';

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

export const getTripsByEmailPagination = async (req, res) => {
  try {
    const ownerEmail = req.body.email;
    const { page } = req.query;
    const limit = getPaginationLimit(req);
    const offset = getPaginationOffset(req);

    const totalResult = await getTripsTotalCountByEmailDB(ownerEmail);
    const total = parseInt(totalResult.total, 10);

    const trips = await getTripsByEmailPaginationDB(ownerEmail, limit, offset);

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
