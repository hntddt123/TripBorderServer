import logger from '../../setupPino';
import { knexDBInstance } from './knexDBInstance';

export const getPOIsPaginationDB = async (limit, offset) => knexDBInstance('points_of_interest')
  .limit(limit)
  .offset(offset)
  .orderBy('trips_uuid', 'desc');

export const createPOIByTripIDDB = async (poi) => knexDBInstance('points_of_interest')
  .insert({
    uuid: knexDBInstance.fn.uuid(),
    trips_uuid: poi.trips_uuid,
    name: poi.name,
    address: poi.address,
    visit_time: poi.visit_time
  }).returning('*')
  .then((rows) => rows[0]);

export const updatePOIByIDDB = async (uuid, updateData) => {
  const updatedRows = await knexDBInstance('points_of_interest')
    .where('uuid', uuid)
    .update(updateData);

  return updatedRows;
};

export const deletePOIByIDDB = async (poiID) => {
  const count = await knexDBInstance('points_of_interest')
    .where('uuid', poiID)
    .delete();
  logger.info(`Deleted ${count} row(s) of points_of_interest`);
};
