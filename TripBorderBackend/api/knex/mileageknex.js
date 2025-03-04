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
    verified: false
  }).returning('*')
    .then((rows) => rows[0]);
}
