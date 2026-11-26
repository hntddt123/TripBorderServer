import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import { pickAllowedFields, UPDATABLE_FIELDS, USER_ROLES } from './utility/fieldUtility';
import {
  getUserByEmailDB,
  getUsersPaginationDB,
  getUsersTotalCountDB,
  updateUserDB
} from '../../knex/userknex';

export const getAllUsersPagination = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = getPaginationOffset(page, limit);

    const totalResult = await getUsersTotalCountDB();
    const total = parseInt(totalResult.total, 10);

    const users = await getUsersPaginationDB(limit, offset);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    return res.json({
      users,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching Users ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    let email = req.body.data;
    email = email.trim().toLowerCase();

    if (!email.includes('@')) {
      email = `${email}@gmail.com`;
    }

    const user = await getUserByEmailDB(email);

    return res.json(user);
  } catch (error) {
    logger.error(`Error Fetching user by Email ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  const { uuid } = req.params;
  // Admin-only route; only the role may be changed here
  const updates = pickAllowedFields(req.body?.data, UPDATABLE_FIELDS.user_accounts);

  if (!USER_ROLES.includes(updates.role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (uuid === req.user?.uuid && updates.role !== 'admin') {
    return res.status(400).json({ error: 'Admins cannot remove their own admin role' });
  }

  try {
    const updatedRows = await updateUserDB(uuid, updates);
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'User Updated!' });
  } catch (error) {
    logger.error(`Error in updating User: ${error}`);
    return res.status(500).send({ error: 'Failed to update User' });
  }
};
