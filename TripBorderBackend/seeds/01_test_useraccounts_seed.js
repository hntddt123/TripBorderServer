exports.seed = function seed(knex) {
  // Deletes ALL existing entries
  return knex('user_accounts').insert([
    {
      uuid: knex.fn.uuid(),
      email: 'test@tripborder.com',
      provider: 'tripborder',
      provider_user_id: '1',
      name: 'Test',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
  ]);
};
