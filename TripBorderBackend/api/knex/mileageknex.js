import { knexDBInstance } from './knexDBInstance';

export async function insertMileages(selectedMileage) {
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
    is_listed: true,
    owner_email: selectedMileage.owner_email
  }).returning('*')
    .then((rows) => rows[0]);
}

export async function deleteMileages(mileageID) {
  const count = await knexDBInstance('mileages')
    .where('uuid', mileageID)
    .delete();
  console.log(`Deleted ${count} row(s)`);
}

export async function updateMileages(uuid, updateData) {
  const updatedRows = await knexDBInstance('mileages')
    .where('uuid', uuid)
    .update(updateData);

  return updatedRows;
}
