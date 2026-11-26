import logger from '../../../setupPino';
import { pickAllowedFields, UPDATABLE_FIELDS } from './utility/fieldUtility';
import { getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import {
  getTripSharesPaginationDB,
  createTripSharesByTripIDDB,
  updateTripSharesByIDDB,
  deleteTripSharesByIDDB
} from '../../knex/tripSharesknex';
import { getResourcesByTripID } from './utility/genericControllerUtility';

export const getAllTripSharesPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getTableTotalCountDB('trip_shares');
    const total = parseInt(totalResult.total, 10);

    const tripShares = await getTripSharesPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      tripShares,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching tripShares ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTripSharesByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'trip_shares',
  orderBy: 'created_at',
  orderPrecedence: 'asc'
});

export const createTripSharesByTrip = async (req, res) => {
  try {
    const tripShares = req.body.data;

    const newTripShares = await createTripSharesByTripIDDB(tripShares);

    return res.json({
      tripShares: newTripShares,
    });
  } catch (error) {
    logger.error(`Error Creating TripShares by trips_uuid ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTripSharesByID = async (req, res) => {
  const { uuid } = req.params;
  // Ownership checked by requireRowTripOwner; only allow known columns
  const updateData = pickAllowedFields(req.body?.data, UPDATABLE_FIELDS.trip_shares);

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No updatable fields' });
  }

  try {
    const updatedRows = await updateTripSharesByIDDB(uuid, updateData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'TripShares not found' });
    }
    return res.json({ message: 'TripShares Updated!' });
  } catch (error) {
    logger.error(`Error in updating TripShares: ${error}`);
    return res.status(500).send({ error: 'Failed to update TripShares' });
  }
};

export const deleteTripSharesByID = async (req, res) => {
  const tripShareID = req.body.data;

  try {
    await deleteTripSharesByIDDB(tripShareID);
    return res.json({ message: 'TripShare Removed!' });
  } catch (error) {
    logger.error(`Error in removing TripShares: ${error}`);
    return res.status(500).send({ error: 'Failed to remove TripShares' });
  }
};
