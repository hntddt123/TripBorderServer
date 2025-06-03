exports.seed = async function usersSeed(knex) {
  // Deletes ALL existing entries
  await knex('user_accounts')
    .insert([
      {
        uuid: '550e8400-e29b-41d4-a716-446655440001',
        email: 'test@tripborder.com',
        provider: 'tripborder',
        provider_user_id: '1',
        name: 'Test',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
    ])
    .onConflict('email')
    .ignore();
};
