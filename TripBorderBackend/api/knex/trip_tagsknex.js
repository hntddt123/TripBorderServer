import { knexDBInstance } from './knexDBInstance';

export const getTripTagsPaginationDB = async (limit, offset) => knexDBInstance('trip_tags')
  .limit(limit)
  .offset(offset)
  .orderBy('trips_uuid', 'desc');
