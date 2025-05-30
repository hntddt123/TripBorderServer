import { knexDBInstance } from './knexDBInstance';

export const getRatingsPaginationDB = async (limit, offset) => knexDBInstance('ratings')
  .limit(limit)
  .offset(offset)
  .orderBy('score', 'desc');
