import { knexDBInstance } from './knexDBInstance';
import logger from '../../setupPino';

export const getTripSharesPaginationDB = async (limit, offset) => knexDBInstance('trip_shares')
  .limit(limit)
  .offset(offset)
  .orderBy('trips_uuid', 'desc');

export const createTripSharesByTripIDDB = async (tripShares) => knexDBInstance('trip_shares')
  .insert({
    uuid: knexDBInstance.fn.uuid(),
    trips_uuid: tripShares.trips_uuid,
    shared_emails: tripShares.shared_emails,
    shared_at: knexDBInstance.fn.now(),
    created_at: knexDBInstance.fn.now(),
    updated_at: knexDBInstance.fn.now()
  }).returning('*')
  .then((rows) => rows[0]);

export const updateTripSharesByIDDB = async (uuid, updateData) => {
  const updatedRows = await knexDBInstance('trip_shares')
    .where('uuid', uuid)
    .update(updateData);

  return updatedRows;
};

export const deleteTripSharesByIDDB = async (tripShareID) => {
  const count = await knexDBInstance('trip_shares')
    .where('uuid', tripShareID)
    .delete();
  logger.info(`Deleted ${count} row(s) of trip_share`);
};
