import { knexDBInstance } from './knexDBInstance';
import logger from '../../setupPino';
import {
  DefaultyyyyMMdd
} from '../../utility/time';

export const hasAccessToTripDB = async (tripsUUID, userEmail) => {
  if (!userEmail) return false;

  // Owner always has access
  const ownerCheck = await knexDBInstance('trips')
    .select('uuid')
    .where({ uuid: tripsUUID, owner_email: userEmail })
    .first();

  if (ownerCheck) return true;

  // if the email is in trip_shares
  const shareCheck = await knexDBInstance('trip_shares')
    .select('uuid')
    .where({ tripsUUID, shared_email: userEmail })
    .first();

  return !!shareCheck;
};

export const getTripsByUUIDDB = async (tripUUID) => knexDBInstance('trips')
  .where({ uuid: tripUUID });

export const getTripsTotalCountDB = async () => knexDBInstance('trips')
  .count('* as total')
  .first();

export const getTripsPublicTotalCountDB = async () => knexDBInstance('trips')
  .where({ shared_mode: 'public' })
  .count('* as total')
  .first();

export const getTripsPaginationDB = async (limit, offset) => knexDBInstance('trips')
  .limit(limit)
  .offset(offset)
  .orderBy('created_at', 'desc');

export const getTripsPublicPaginationDB = async (limit, offset) => knexDBInstance('trips')
  .where({ shared_mode: 'public' })
  .limit(limit)
  .offset(offset)
  .orderBy('created_at', 'desc');

export const getMySharedTripsWithRecipientsPaginationDB = async (
  ownerEmail,
  limit,
  offset,
  orderBy = 'trips.created_at',
  orderPrecedence = 'desc'
) => knexDBInstance('trips')
  .select(
    'trips.uuid as uuid',
    'trips.shared_mode',
    'trips.owner_email',
    'trips.title',
    'trips.start_date',
    'trips.end_date',
    'trips.created_at',
    'trips.updated_at',
    knexDBInstance.raw('array_agg(DISTINCT trip_shares.shared_email) as shared_emails')
  )
  .leftJoin('trip_shares', 'trips.uuid', 'trip_shares.trips_uuid')
  .where('trips.owner_email', ownerEmail)
  .andWhere('trips.shared_mode', 'shared')
  .groupBy(
    'trips.uuid',
    'trips.shared_mode',
    'trips.owner_email',
    'trips.title',
    'trips.start_date',
    'trips.end_date',
    'trips.created_at',
    'trips.updated_at'
  )
  .limit(limit)
  .offset(offset)
  .orderBy(orderBy, orderPrecedence);

export const getMySharedTripsTotalCountDB = async (ownerEmail) => {
  const result = await knexDBInstance('trips')
    .count('* as total')
    .where('owner_email', ownerEmail)
    .andWhere('trips.shared_mode', 'shared')
    .first();
  return result;
};

export const getOthersSharedTripsWithRecipientsPaginationDB = async (
  ownerEmail,
  limit,
  offset,
  orderBy = 'trips.created_at',
  orderPrecedence = 'desc'
) => knexDBInstance('trips')
  .select(
    'trips.uuid as uuid',
    'trips.shared_mode',
    'trips.owner_email',
    'trips.title',
    'trips.start_date',
    'trips.end_date',
    'trips.created_at',
    'trips.updated_at',
    knexDBInstance.raw('array_agg(DISTINCT trip_shares.shared_email) as shared_emails')
  )
  .leftJoin('trip_shares', 'trips.uuid', 'trip_shares.trips_uuid')
  .where('trip_shares.shared_email', ownerEmail)
  .andWhere('trips.shared_mode', 'shared')
  .groupBy(
    'trips.uuid',
    'trips.shared_mode',
    'trips.owner_email',
    'trips.title',
    'trips.start_date',
    'trips.end_date',
    'trips.created_at',
    'trips.updated_at'
  )
  .limit(limit)
  .offset(offset)
  .orderBy(orderBy, orderPrecedence);

export const getOthersSharedTripsTotalCountDB = async (ownerEmail) => {
  const result = await knexDBInstance('trips')
    .count('* as total')
    .innerJoin('trip_shares', 'trips.uuid', 'trip_shares.trips_uuid')
    .where('trip_shares.shared_email', ownerEmail)
    .andWhere('trips.shared_mode', 'shared')
    .first();
  return result;
};

export const getTripsTotalCountByEmailDB = async (othersEmail) => knexDBInstance('trips')
  .where({ owner_email: othersEmail })
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
    updated_at: knexDBInstance.fn.now(),
    shared_mode: 'private'
  }).returning([
    'uuid',
    'title',
    'owner_email',
    knexDBInstance.raw("TO_CHAR(start_date, 'YYYY-MM-DD') as start_date"),
    knexDBInstance.raw("TO_CHAR(end_date, 'YYYY-MM-DD') as end_date"),
    'created_at',
    'updated_at',
    'shared_mode'
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
