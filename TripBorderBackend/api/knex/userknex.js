import { knexDBInstance } from './knexDBInstance';

export async function updateUser(uuid, updateData) {
  const updatedRows = await knexDBInstance('user_accounts')
    .where('uuid', uuid)
    .update(updateData);

  return updatedRows;
}
