import { knexDBInstance } from './knexDBInstance';

export const updateUserDB = async (uuid, updateData) => knexDBInstance('user_accounts')
  .where('uuid', uuid)
  .update(updateData);

export const getUsersTotalCountDB = async () => knexDBInstance('user_accounts')
  .count('* as total')
  .first();

export const getUsersPaginationDB = async (limit, offset) => knexDBInstance('user_accounts')
  .limit(limit)
  .offset(offset)
  .orderBy('created_at', 'desc');

export const getUserByUUIDDB = async (uuid) => knexDBInstance('user_accounts')
  .where('uuid', uuid)
  .first();
