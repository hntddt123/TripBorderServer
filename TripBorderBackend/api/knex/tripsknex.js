import { knexDBInstance } from './knexDBInstance';

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

export const insertTripsDB = async (trip) => {
  await knexDBInstance('trips').insert({
    uuid: knexDBInstance.fn.uuid(),
    title: trip.title,
    owner_email: trip.owner_email,
    start_date: trip.start_date ?? knexDBInstance.fn.now(),
    end_date: trip.end_date ?? knexDBInstance.fn.now(),
    created_at: knexDBInstance.fn.now(),
    updated_at: knexDBInstance.fn.now()
  }).returning('*')
    .then((rows) => rows[0]);
};
