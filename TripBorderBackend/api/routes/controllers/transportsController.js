import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { getResourcesByTripID } from './utility/genericControllerUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import {
  getTransportsPaginationDB,
  createTransportByTripIDDB,
  deleteTransportByIDDB
} from '../../knex/transportsknex';

export const getAllTransportsPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

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

export const createTransportByTrip = async (req, res) => {
  try {
    const transport = req.body.data;

    const newTransport = await createTransportByTripIDDB(transport);

    res.json({
      transport: newTransport,
    });
  } catch (error) {
    logger.error(`Error Creating Transport by trips_uuid ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTransportByID = async (req, res) => {
  const TransportID = req.body.data;

  try {
    await deleteTransportByIDDB(TransportID);
    res.json({ message: 'Transport Removed!' });
  } catch (error) {
    logger.error(`Error in removing Transport: ${error}`);
    res.status(500).send({ error: 'Failed to remove Transport' });
  }
};
