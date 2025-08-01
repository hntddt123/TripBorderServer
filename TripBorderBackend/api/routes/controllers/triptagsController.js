import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import {
  getTripTagsPaginationDB,
  getTripTagsbyTripDB,
  createTripTagByTripIDAndTagIDDB,
  deleteTripTagByIDDB,
  isTripTagDuplicateDB
} from '../../knex/triptagsknex';

export const getAllTripTagsPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getTableTotalCountDB('trip_tags');
    const total = parseInt(totalResult.total, 10);

    const tripTags = await getTripTagsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      tripTags,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching tripTags ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTripTagsByTripID = async (req, res) => {
  try {
    const { tripID } = req.body;
    const tripTags = await getTripTagsbyTripDB(tripID);

    res.json({ tripTags });
  } catch (error) {
    logger.error(`Error Fetching tripTags ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTripTagByTripIDAndTagID = async (req, res) => {
  try {
    const tripTag = req.body.data;

    const existing = await isTripTagDuplicateDB(tripTag);
    if (existing) {
      res.status(409).json({
        error: 'The triptag already exists'
      });
    }

    const newTripTag = await createTripTagByTripIDAndTagIDDB(tripTag);

    res.json({
      tripTag: newTripTag,
    });
  } catch (error) {
    logger.error(`Error Creating TripTag by trips_uuid ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTripTagByID = async (req, res) => {
  const tripTagID = req.body.data;

  try {
    await deleteTripTagByIDDB(tripTagID);
    res.json({ message: 'TripTag Removed!' });
  } catch (error) {
    logger.error(`Error in removing TripTag: ${error}`);
    res.status(500).send({ error: 'Failed to remove TripTag' });
  }
};
