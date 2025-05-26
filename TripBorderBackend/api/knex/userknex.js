import { knexDBInstance } from './knexDBInstance';

export const updateUserDB = async (uuid, updateData) => knexDBInstance('user_accounts')
  .where('uuid', uuid)
  .update(updateData);

export const getAllUsersDB = async () => knexDBInstance('user_accounts')
  .select(
    'uuid',
    'provider',
    'provider_user_id',
    'email',
    'name',
    'created_at',
    'updated_at',
    'role'
  );
