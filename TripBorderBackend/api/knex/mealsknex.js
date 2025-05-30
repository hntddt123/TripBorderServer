import { knexDBInstance } from './knexDBInstance';

export const getMealsPaginationDB = async (limit, offset) => knexDBInstance('meals')
  .limit(limit)
  .offset(offset)
  .orderBy('trips_uuid', 'desc');
