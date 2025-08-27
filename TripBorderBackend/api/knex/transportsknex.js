import logger from '../../setupPino';
import { knexDBInstance } from './knexDBInstance';

export const getTransportsPaginationDB = async (limit, offset) => knexDBInstance('transports')
  .limit(limit)
  .offset(offset)
  .orderBy('departure_time', 'desc');

export const createTransportByTripIDDB = async (transport) => knexDBInstance('transports')
  .insert({
    uuid: knexDBInstance.fn.uuid(),
    trips_uuid: transport.trips_uuid,
    name: transport.name,
    type: transport.type || 'Unselected',
    address: transport.address,
    provider: transport.provider,
    booking_reference: transport.booking_reference,
    departure_time: transport.departure_time,
    arrival_time: transport.arrival_time,
    origin: transport.origin,
    destination: transport.destination,
    location: knexDBInstance.raw('POINT(?, ?)', [transport.location.longitude, transport.location.latitude])
  }).returning('*')
  .then((rows) => rows[0]);

export const updateTransportByIDDB = async (uuid, updateData) => {
  const updatedRows = await knexDBInstance('transports')
    .where('uuid', uuid)
    .update(updateData);

  return updatedRows;
};

export const deleteTransportByIDDB = async (transportID) => {
  const count = await knexDBInstance('transports')
    .where('uuid', transportID)
    .delete();
  logger.info(`Deleted ${count} row(s) of transports`);
};
