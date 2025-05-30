import { knexDBInstance } from './knexDBInstance';

export const getTableTotalCountDB = async (tableName) => knexDBInstance(tableName)
  .count('* as total')
  .first();
