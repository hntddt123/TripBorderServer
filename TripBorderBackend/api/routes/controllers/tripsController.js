import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { getResourcesByEmailPagination } from './utility/genericControllerUtility';
import {
  getTripsTotalCountDB,
  getTripsPaginationDB,
  getTripsByUUIDDB,
  initTripsDB,
  updateTripsDB,
  deleteTripsDB
} from '../../knex/tripsknex';

export const getAllTripsPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

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

export const getTripByUUID = async (req, res) => {
  try {
    const uuid = req.body.data;
    const trips = await getTripsByUUIDDB(uuid);

    res.json({ trips });
  } catch (error) {
    logger.error(`Error Fetching trips ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTripsByEmailPagination = async (req, res) => getResourcesByEmailPagination(req, res, {
  resourceName: 'trips',
  orderBy: 'created_at',
  orderPrecedence: 'desc'
});

export const initTrips = async (req, res) => {
  const ownerEmail = req.body.data;

  try {
    const trip = await initTripsDB(ownerEmail);

    res.json({
      trip: trip,
      message: 'Trip Created!'
    });
  } catch (error) {
    logger.error(`Error in creating Trip: ${error}`);
    res.status(500).send({ error: 'Failed to create Trip' });
  }
};

export const updateTrips = async (req, res) => {
  const { uuid } = req.params;
  const updateData = req.body.data;

  try {
    const updatedRows = await updateTripsDB(uuid, updateData);

    if (updatedRows === 0) {
      res.status(404).json({ error: 'Trips not found' });
    } else {
      res.json({ message: 'Trips Updated!' });
    }
  } catch (error) {
    logger.error(`Error in updating Trips: ${error}`);
    res.status(500).send({ error: 'Failed to update Trips' });
  }
};

export const deleteTripsByID = async (req, res) => {
  const tripID = req.body.data;

  try {
    await deleteTripsDB(tripID);
    res.json({ message: 'Trip Removed!' });
  } catch (error) {
    logger.error(`Error in removing Trip: ${error}`);
    res.status(500).send({ error: 'Failed to remove Trip' });
  }
};
