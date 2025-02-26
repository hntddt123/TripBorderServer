import knex from 'knex';
import knexfile from '../../knexfile';

const knexInstance = (process.env.NODE_ENV === 'development')
  ? knex(knexfile.development)
  : knex(knexfile.production);

export async function upsertUserOnGoogleLogin(profile) {
  let user = await knexInstance('user_accounts')
    .where({ provider_user_id: profile.id })
    .first();

  if (!user) {
    user = await knexInstance('user_accounts').insert({
      provider: profile.provider,
      provider_user_id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      profile_picture: profile.photos[0].value
      // If storing tokens (securely)
      // access_token: accessToken,
      // refresh_token: refreshToken,
    }).returning('*')
      .then((rows) => rows[0]);
  } else {
    await knexInstance('user_accounts')
      .where({ provider_user_id: profile.id })
      .update({
        updated_at: knexInstance.fn.now()
      });
  }
  return user;
}
