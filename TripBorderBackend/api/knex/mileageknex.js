import { knexDBInstance } from './knexDBInstance';
import { ocrMatchFrequentFlyerNumber } from '../../utility/ocr';
import logger from '../../setupPino';

export const getMileagesTotalCountDB = async () => knexDBInstance('mileages')
  .count('* as total')
  .first();

export const getMileagesPaginationDB = async (limit, offset) => knexDBInstance('mileages')
  .limit(limit)
  .offset(offset)
  .orderBy('created_at', 'desc');

export const getAllVerifiedAndListedMileagesDB = async () => knexDBInstance('mileages')
  .where({ is_verified: true, is_listed: true })
  .count('* as total')
  .first();

export const getVerifiedAndListedMileagesPaginationDB = async (limit, offset) => knexDBInstance('mileages')
  .where({ is_verified: true, is_listed: true })
  .limit(limit)
  .offset(offset)
  .orderBy('created_at', 'desc');

export const getMileagesTotalCountByEmailDB = async (ownerEmail) => knexDBInstance('mileages')
  .where({ owner_email: ownerEmail })
  .count('* as total')
  .first();

export const getMileagesByEmailPaginationDB = async (ownerEmail, limit, offset) => knexDBInstance('mileages')
  .where({ owner_email: ownerEmail })
  .limit(limit)
  .offset(offset)
  .orderBy('created_at', 'desc');

export const insertMileagesDB = async (selectedMileage) => {
  const isOcrVerified = await ocrMatchFrequentFlyerNumber(
    selectedMileage.frequent_flyer_number,
    selectedMileage.mileage_picture
  );

  await knexDBInstance('mileages').insert({
    uuid: knexDBInstance.fn.uuid(),
    frequent_flyer_number: selectedMileage.frequent_flyer_number,
    airline: selectedMileage.airline,
    mileage_price: selectedMileage.mileage_price,
    mileage_amount: selectedMileage.mileage_amount,
    mileage_unit: selectedMileage.mileage_unit,
    mileage_picture: selectedMileage.mileage_picture,
    mileage_expired_at: selectedMileage.mileage_expired_at,
    created_at: knexDBInstance.fn.now(),
    updated_at: knexDBInstance.fn.now(),
    is_verified: false,
    is_ocr_verified: isOcrVerified,
    is_listed: true,
    owner_email: selectedMileage.owner_email
  }).returning('*')
    .then((rows) => rows[0]);
};

export const deleteMileagesDB = async (mileageID) => {
  const count = await knexDBInstance('mileages')
    .where('uuid', mileageID)
    .delete();
  logger.info(`Deleted ${count} row(s) of mileage`);
};

export const updateMileagesDB = async (uuid, updateData) => {
  const updatedRows = await knexDBInstance('mileages')
    .where('uuid', uuid)
    .update(updateData);

  return updatedRows;
};
