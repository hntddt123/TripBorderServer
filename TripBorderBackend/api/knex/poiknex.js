import { knexDBInstance } from './knexDBInstance';

export const getPOIsPaginationDB = async (limit, offset) => knexDBInstance('points_of_interest')
  .limit(limit)
  .offset(offset)
  .orderBy('trips_uuid', 'desc');
