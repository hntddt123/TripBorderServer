import logger from '../../setupPino';
import { knexDBInstance } from './knexDBInstance';

export const getHotelsPaginationDB = async (limit, offset) => knexDBInstance('hotels')
  .limit(limit)
  .offset(offset)
  .orderBy('check_in', 'desc');

export const createHotelsByTripIDDB = async (hotels) => knexDBInstance('hotels')
  .insert({
    uuid: knexDBInstance.fn.uuid(),
    trips_uuid: hotels.trips_uuid,
    name: hotels.name,
    address: hotels.address,
    check_in: hotels.check_in,
    check_out: hotels.check_out,
    booking_reference: hotels.booking_reference
  }).returning('*')
  .then((rows) => rows[0]);

export const deleteHotelsByIDDB = async (hotelID) => {
  const count = await knexDBInstance('hotels')
    .where('uuid', hotelID)
    .delete();
  logger.info(`Deleted ${count} row(s) of hotel`);
};
