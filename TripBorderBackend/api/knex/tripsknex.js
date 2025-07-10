import { knexDBInstance } from './knexDBInstance';
import logger from '../../setupPino';

export const getTripsByUUIDDB = async (tripUUID) => knexDBInstance('trips')
  .where({ uuid: tripUUID });

export const getTripsTotalCountDB = async () => knexDBInstance('trips')
  .count('* as total')
  .first();

export const getTripsPaginationDB = async (limit, offset) => knexDBInstance('trips')
  .limit(limit)
  .offset(offset)
  .orderBy('created_at', 'desc');

export const getTripsTotalCountByEmailDB = async (ownerEmail) => knexDBInstance('trips')
  .where({ owner_email: ownerEmail })
  .count('* as total')
  .first();

export const getTripsByEmailPaginationDB = async (ownerEmail, limit, offset) => knexDBInstance('trips')
  .where({ owner_email: ownerEmail })
  .limit(limit)
  .offset(offset)
  .orderBy('created_at', 'desc');

export const initTripsDB = async (ownerEmail) => knexDBInstance('trips').insert({
  uuid: knexDBInstance.fn.uuid(),
  title: 'New Trip',
  owner_email: ownerEmail,
  start_date: knexDBInstance.fn.now(),
  end_date: knexDBInstance.fn.now(),
  created_at: knexDBInstance.fn.now(),
  updated_at: knexDBInstance.fn.now()
}).returning('*')
  .then((rows) => rows[0]);

export const deleteTripsDB = async (tripID) => {
  const count = await knexDBInstance('trips')
    .where('uuid', tripID)
    .delete();
  logger.info(`Deleted ${count} row(s)`);
};

export const updateTripsDB = async (uuid, updateData) => {
  const updatedRows = await knexDBInstance('trips')
    .where('uuid', uuid)
    .update(updateData);

  return updatedRows;
};
