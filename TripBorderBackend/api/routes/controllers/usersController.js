import { getAllUsersDB, updateUserDB } from '../../knex/userknex';
import logger from '../../../setupPino';

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersDB();

    res.json(users);
  } catch (error) {
    logger.error(`Error Fetching User ${error}`);
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

    if (updatedRows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User Updated!' });
  } catch (error) {
    logger.error(`Error in updating User: ${error}`);
    res.status(500).send({ error: 'Failed to update User' });
  }
};
