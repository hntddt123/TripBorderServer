import { knexDBInstance } from './knexDBInstance';

export const getTableTotalCountDB = async (tableName) => knexDBInstance(tableName)
  .count('* as total')
  .first();

export const getTableTotalCountByEmailDB = async (tableName, { ownerEmail }) => knexDBInstance(tableName)
  .where({ owner_email: ownerEmail })
  .count('* as total')
  .first();

export const getResourcesByEmailPaginationDB = async (tableName, { ownerEmail, limit, offset }) => knexDBInstance(tableName)
  .where({ owner_email: ownerEmail })
  .limit(limit)
  .offset(offset)
  .orderBy('created_at', 'desc');

export const getResourcesByTripIDDB = async (tableName, { tripID, orderBy }) => knexDBInstance(tableName)
  .where({ trips_uuid: tripID })
  .orderBy(orderBy, 'desc');
