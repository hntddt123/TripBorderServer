import { knexDBInstance } from './knexDBInstance';

export const getTripTagsPaginationDB = async (limit, offset) => knexDBInstance('trip_tags')
  .limit(limit)
  .offset(offset)
  .orderBy('trips_uuid', 'desc');

export const getTripTagsbyTripDB = async (tripsUUID) => knexDBInstance('trip_tags')
  .select('tags.uuid', 'tags.name') // Fetch relevant tag fields
  .innerJoin('tags', 'trip_tags.tags_uuid', 'tags.uuid')
  .where('trip_tags.trips_uuid', tripsUUID);
