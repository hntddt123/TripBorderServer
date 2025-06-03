import { knexDBInstance } from './knexDBInstance';

export async function upsertUserOnGoogleLoginDB(profile) {
  let user = await knexDBInstance('user_accounts')
    .where({ provider_user_id: profile.id })
    .first();

  if (!user) {
    user = await knexDBInstance('user_accounts').insert({
      provider: profile.provider,
      provider_user_id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      profile_picture: profile.photos[0].value,
      role: 'user'
      // If storing tokens (securely)
      // access_token: accessToken,
      // refresh_token: refreshToken,
    }).returning('*')
      .then((rows) => rows[0]);
  } else {
    await knexDBInstance('user_accounts')
      .where({ provider_user_id: profile.id })
      .update({
        updated_at: knexDBInstance.fn.now()
      });
  }

  // Add Admin Permission
  if (user.email === 'nientaiho@gmail.com' && user.role !== 'admin') {
    await knexDBInstance('user_accounts')
      .where({ provider_user_id: profile.id })
      .update({ role: 'admin' });
    user.role = 'admin';
  }
  return user;
}
