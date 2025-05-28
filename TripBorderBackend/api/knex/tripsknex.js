import { knexDBInstance } from './knexDBInstance';

export const getTripsTotalCountDB = async () => knexDBInstance('trips')
  .count('* as total')
  .first();

export const getTripsPaginationDB = async (limit, offset) => knexDBInstance('trips')
  .limit(limit)
  .offset(offset)
  .orderBy('created_at', 'desc');
