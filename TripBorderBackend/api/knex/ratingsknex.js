import logger from '../../setupPino';
import { knexDBInstance } from './knexDBInstance';

export const getRatingsPaginationDB = async (limit, offset) => knexDBInstance('ratings')
  .limit(limit)
  .offset(offset)
  .orderBy('score', 'desc');

export const createRatingByTripIDDB = async (rating) => knexDBInstance('ratings')
  .insert({
    uuid: knexDBInstance.fn.uuid(),
    trips_uuid: rating.trips_uuid,
    entity_id: rating.entity_id,
    entity_type: rating.entity_type,
    comment: rating.comment,
    score: rating.score,
    owner_email: rating.owner_email
  }).returning('*')
  .then((rows) => rows[0]);

export const deleteRatingByIDDB = async (ratingID) => {
  const count = await knexDBInstance('ratings')
    .where('uuid', ratingID)
    .delete();
  logger.info(`Deleted ${count} row(s) of rating`);
};
