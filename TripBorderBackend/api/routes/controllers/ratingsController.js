import logger from '../../../setupPino';
import { pickAllowedFields, UPDATABLE_FIELDS } from './utility/fieldUtility';
import { getPaginationOffset } from './utility/paginationUtility';
import { getResourcesByTripID } from './utility/genericControllerUtility';
import { getTableTotalCountDB } from '../../knex/utilityknex';
import {
  getRatingsPaginationDB,
  createRatingByTripIDDB,
  deleteRatingByIDDB,
  updateRatingDB
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
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      ratings,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching ratings ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRatingsByTrip = async (req, res) => getResourcesByTripID(req, res, {
  resourceName: 'ratings',
  orderBy: 'created_at',
  orderPrecedence: 'asc',
  publicOmitFields: ['owner_email']
});

export const createRatingByTrip = async (req, res) => {
  try {
    const rating = req.body.data;

    const newRating = await createRatingByTripIDDB(rating);

    return res.json({
      rating: newRating,
    });
  } catch (error) {
    logger.error(`Error Creating Rating by trips_uuid ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteRatingByID = async (req, res) => {
  const ratingID = req.body.data;

  try {
    await deleteRatingByIDDB(ratingID);
    return res.json({ message: 'Rating Removed!' });
  } catch (error) {
    logger.error(`Error in removing Rating: ${error}`);
    return res.status(500).send({ error: 'Failed to remove Rating' });
  }
};

export const updateRating = async (req, res) => {
  const { uuid } = req.params;
  // Ownership checked by requireRowTripOwner; only allow known columns
  const updateData = pickAllowedFields(req.body?.data, UPDATABLE_FIELDS.ratings);

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No updatable fields' });
  }
  try {
    const updatedRows = await updateRatingDB(uuid, updateData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    return res.json({ message: 'Rating Updated!' });
  } catch (error) {
    logger.error(`Error in updating Rating: ${error}`);
    return res.status(500).send({ error: 'Failed to update Rating' });
  }
};
