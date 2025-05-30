import { knexDBInstance } from './knexDBInstance';

export const getTagsPaginationDB = async (limit, offset) => knexDBInstance('tags')
  .limit(limit)
  .offset(offset)
  .orderBy('name', 'desc');
