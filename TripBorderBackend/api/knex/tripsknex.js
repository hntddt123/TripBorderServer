import { knexDBInstance } from './knexDBInstance';
import logger from '../../setupPino';
import {
  DefaultyyyyMMdd
} from '../../utility/time';

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

export const initTripsDB = async (ownerEmail) => knexDBInstance('trips')
  .insert({
    uuid: knexDBInstance.fn.uuid(),
    title: 'New Trip',
    owner_email: ownerEmail,
    start_date: DefaultyyyyMMdd(),
    end_date: DefaultyyyyMMdd(),
    created_at: knexDBInstance.fn.now(),
    updated_at: knexDBInstance.fn.now()
  }).returning([
    'uuid',
    'title',
    'owner_email',
    knexDBInstance.raw("TO_CHAR(start_date, 'YYYY-MM-DD') as start_date"),
    knexDBInstance.raw("TO_CHAR(end_date, 'YYYY-MM-DD') as end_date"),
    'created_at',
    'updated_at',
  ])
  .then((rows) => rows[0]);

export const updateTripsDB = async (uuid, updateData) => {
  const updatedRows = await knexDBInstance('trips')
    .where('uuid', uuid)
    .update(updateData);

  return updatedRows;
};

export const deleteTripsDB = async (tripID) => {
  const count = await knexDBInstance('trips')
    .where('uuid', tripID)
    .delete();
  logger.info(`Deleted ${count} row(s) of trip`);
};
