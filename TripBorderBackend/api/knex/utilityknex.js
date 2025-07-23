import { knexDBInstance } from './knexDBInstance';

export const getTableTotalCountDB = async (tableName) => knexDBInstance(tableName)
  .count('* as total')
  .first();

export const getTableTotalCountByEmailDB = async (tableName, { ownerEmail }) => knexDBInstance(tableName)
  .where({ owner_email: ownerEmail })
  .count('* as total')
  .first();

export const getResourcesByEmailPaginationDB = async (
  tableName,
  {
    ownerEmail,
    limit,
    offset,
    orderBy,
    orderPrecedence
  }
) => knexDBInstance(tableName)
  .where({ owner_email: ownerEmail })
  .limit(limit)
  .offset(offset)
  .orderBy(orderBy, orderPrecedence);

export const getResourcesByTripIDDB = async (tableName, { tripID, orderBy, orderPrecedence }) => knexDBInstance(tableName)
  .where({ trips_uuid: tripID })
  .orderBy(orderBy, orderPrecedence);
