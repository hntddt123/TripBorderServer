const { default: logger } = require('../setupPino');

exports.seed = async function mileagesSeed(knex) {
  logger.debug('Running 02_test_mileages_seed');

  const validEmails = await knex('user_accounts')
    .select('email')
    .then((rows) => rows.map((row) => row.email));

  const mileages = [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440001',
      frequent_flyer_number: 'TB123456789',
      airline: 'Tripborder Air',
      mileage_price: '100.00',
      mileage_amount: '2000.0',
      mileage_picture: '',
      mileage_unit: 'km',
      mileage_expired_at: '9999-12-31 23:59:59',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      owner_email: 'test@tripborder.com'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440002',
      frequent_flyer_number: 'TB987654321',
      airline: 'Tripborder Air',
      mileage_price: '200.99',
      mileage_amount: '4000.0',
      mileage_picture: '',
      mileage_unit: 'miles',
      mileage_expired_at: '2030-12-31',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      owner_email: 'test@tripborder.com'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440003',
      frequent_flyer_number: 'TT999999999',
      airline: 'Trip Trip Air',
      mileage_price: '20.99',
      mileage_amount: '1000.0',
      mileage_picture: '',
      mileage_unit: 'miles',
      mileage_expired_at: '2030-12-31',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      owner_email: 'test@tripborder.com',
      is_verified: true
    },
  ];

  const validMileages = mileages.filter((mileage) => validEmails.includes(mileage.owner_email));

  if (validMileages.length > 0) {
    return knex('mileages')
      .insert(validMileages)
      .onConflict('uuid')
      .ignore();
  }

  return null;
};
