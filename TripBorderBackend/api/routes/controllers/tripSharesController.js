import logger from '../../../setupPino';
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
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      tripShares,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching tripShares ${error}`);
    res.status(500).json({ error: 'Internal server error' });
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

    res.json({
      tripShares: newTripShares,
    });
  } catch (error) {
    logger.error(`Error Creating TripShares by trips_uuid ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTripSharesByID = async (req, res) => {
  const { uuid } = req.params;
  const updateData = req.body.data;

  try {
    const updatedRows = await updateTripSharesByIDDB(uuid, updateData);

    if (updatedRows === 0) {
      res.status(404).json({ error: 'TripShares not found' });
    } else {
      res.json({ message: 'TripShares Updated!' });
    }
  } catch (error) {
    logger.error(`Error in updating TripShares: ${error}`);
    res.status(500).send({ error: 'Failed to update TripShares' });
  }
};

export const deleteTripSharesByID = async (req, res) => {
  const tripShareID = req.body.data;

  try {
    await deleteTripSharesByIDDB(tripShareID);
    res.json({ message: 'TripShare Removed!' });
  } catch (error) {
    logger.error(`Error in removing TripShares: ${error}`);
    res.status(500).send({ error: 'Failed to remove TripShares' });
  }
};
