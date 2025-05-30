import { knexDBInstance } from './knexDBInstance';

export const getHotelsPaginationDB = async (limit, offset) => knexDBInstance('hotels')
  .limit(limit)
  .offset(offset)
  .orderBy('check_in', 'desc');
