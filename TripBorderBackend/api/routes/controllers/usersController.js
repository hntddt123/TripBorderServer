import logger from '../../../setupPino';
import { getPaginationOffset } from './utility/paginationUtility';
import {
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
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      users,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching Users ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  const { uuid } = req.params;
  const updates = req.body.data;

  const updateData = {};
  if (updates.role !== undefined) updateData.role = updates.role;

  try {
    const updatedRows = await updateUserDB(uuid, updateData);

    if (updatedRows === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ message: 'User Updated!' });
    }
  } catch (error) {
    logger.error(`Error in updating User: ${error}`);
    res.status(500).send({ error: 'Failed to update User' });
  }
};
