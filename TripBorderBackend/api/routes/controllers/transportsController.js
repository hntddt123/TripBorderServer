import logger from '../../../setupPino';
import { pickAllowedFields, UPDATABLE_FIELDS } from './utility/fieldUtility';
import { getPaginationOffset } from './utility/paginationUtility';
import { getResourcesByTripID } from './utility/genericControllerUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import {
  getTransportsPaginationDB,
  createTransportByTripIDDB,
  updateTransportByIDDB,
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
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      transports,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching transports ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTransportsByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'transports',
  orderBy: 'departure_time',
  orderPrecedence: 'asc',
  publicOmitFields: ['booking_reference']
});

export const createTransportByTrip = async (req, res) => {
  try {
    const transport = req.body.data;

    const newTransport = await createTransportByTripIDDB(transport);

    return res.json({
      transport: newTransport,
    });
  } catch (error) {
    logger.error(`Error Creating Transport by trips_uuid ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTransportByID = async (req, res) => {
  const { uuid } = req.params;
  // Ownership checked by requireRowTripOwner; only allow known columns
  const updateData = pickAllowedFields(req.body?.data, UPDATABLE_FIELDS.transports);

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No updatable fields' });
  }

  try {
    const updatedRows = await updateTransportByIDDB(uuid, updateData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Transport not found' });
    }
    return res.json({ message: 'Transport Updated!' });
  } catch (error) {
    logger.error(`Error in updating Transport: ${error}`);
    return res.status(500).send({ error: 'Failed to update Transport' });
  }
};

export const deleteTransportByID = async (req, res) => {
  const TransportID = req.body.data;

  try {
    await deleteTransportByIDDB(TransportID);
    return res.json({ message: 'Transport Removed!' });
  } catch (error) {
    logger.error(`Error in removing Transport: ${error}`);
    return res.status(500).send({ error: 'Failed to remove Transport' });
  }
};
