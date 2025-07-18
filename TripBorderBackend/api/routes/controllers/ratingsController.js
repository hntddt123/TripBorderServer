import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { getResourcesByTripID } from './utility/genericControllerUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import {
  getRatingsPaginationDB,
  createRatingByTripIDDB,
  deleteRatingByIDDB
} from '../../knex/ratingsknex';

export const getAllRatingsPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getTableTotalCountDB('ratings');
    const total = parseInt(totalResult.total, 10);

    const ratings = await getRatingsPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      ratings,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching ratings ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRatingsByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'ratings',
  orderBy: 'created_at'
});

export const createRatingByTrip = async (req, res) => {
  try {
    const rating = req.body.data;

    const newRating = await createRatingByTripIDDB(rating);

    res.json({
      rating: newRating,
    });
  } catch (error) {
    logger.error(`Error Creating Rating by trips_uuid ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteRatingByID = async (req, res) => {
  const ratingID = req.body.data;

  try {
    await deleteRatingByIDDB(ratingID);
    res.json({ message: 'Rating Removed!' });
  } catch (error) {
    logger.error(`Error in removing Rating: ${error}`);
    res.status(500).send({ error: 'Failed to remove Rating' });
  }
};
