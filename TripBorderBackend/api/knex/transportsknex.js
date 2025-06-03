import { knexDBInstance } from './knexDBInstance';

export const getTransportsPaginationDB = async (limit, offset) => knexDBInstance('transports')
  .limit(limit)
  .offset(offset)
  .orderBy('departure_time', 'desc');
