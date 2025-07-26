import logger from '../../setupPino';
import { knexDBInstance } from './knexDBInstance';

export const getTripTagsPaginationDB = async (limit, offset) => knexDBInstance('trip_tags')
  .limit(limit)
  .offset(offset)
  .orderBy('trips_uuid', 'desc');

export const getTripTagsbyTripDB = async (tripsUUID) => knexDBInstance('trip_tags')
  .select('trip_tags.uuid', 'tags.uuid as tag_uuid', 'tags.name') // Fetch relevant tag fields
  .innerJoin('tags', 'trip_tags.tags_uuid', 'tags.uuid')
  .where('trip_tags.trips_uuid', tripsUUID);

export const createTripTagByTripIDAndTagIDDB = async (tripTag) => knexDBInstance('trip_tags')
  .insert({
    uuid: knexDBInstance.fn.uuid(),
    trips_uuid: tripTag.trips_uuid,
    tags_uuid: tripTag.tags_uuid,
  }).returning('*')
  .then((rows) => rows[0]);

export const deleteTripTagByIDDB = async (tripTagID) => {
  const count = await knexDBInstance('trip_tags')
    .where('uuid', tripTagID)
    .delete();
  logger.info(`Deleted ${count} row(s) of triptag`);
};

export const isTripTagDuplicateDB = async (tripTag) => knexDBInstance('trip_tags')
  .where({
    trips_uuid: tripTag.trips_uuid,
    tags_uuid: tripTag.tags_uuid
  })
  .select(1)
  .first();
