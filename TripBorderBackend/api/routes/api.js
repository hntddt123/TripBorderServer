import { Router } from 'express';
import { knexDBInstance } from '../knex/knexDBInstance';
import { insertMileages, deleteMileages, updateMileages } from '../knex/mileageknex';
import { updateUser } from '../knex/userknex';
import logger from '../../setupPino';

const apiRouter = Router();

// api Routes
apiRouter.get('/api/users', async (req, res) => {
  try {
    const users = await knexDBInstance('user_accounts')
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
    res.json(users);
  } catch (error) {
    logger.error(`Error Fetching User ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

apiRouter.patch('/api/updateuser/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const updates = req.body.data;

  const updateData = {};
  if (updates.role !== undefined) updateData.role = updates.role;

  try {
    const updatedRows = await updateUser(uuid, updateData);

    if (updatedRows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User Updated!' });
  } catch (error) {
    logger.error(`Error in updating User: ${error}`);
    res.status(500).send({ error: 'Failed to update User' });
  }
});

apiRouter.get('/api/mileages', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;

    const totalResult = await knexDBInstance('mileages')
      .count('* as total')
      .first();
    const total = parseInt(totalResult.total, 10);

    const mileages = await knexDBInstance('mileages')
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({
      mileages,
      total,
      totalPages,
      page
    });
  } catch (error) {
    logger.error(`Error Fetching mileages ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

apiRouter.post('/api/mileagesbyemail', async (req, res) => {
  const ownerEmail = req.body.data;

  try {
    const mileages = await knexDBInstance('mileages')
      .where({ owner_email: ownerEmail })
      .orderBy('created_at', 'desc');

    res.json(mileages);
  } catch (error) {
    logger.error(`Error Fetching mileages ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

apiRouter.post('/api/uploadmileages', async (req, res) => {
  const newMileage = req.body.data;

  try {
    await insertMileages(newMileage);
    res.json({ message: 'Mileage Created!' });
  } catch (error) {
    logger.error(`Error in creating Mileage: ${error}`);
    res.status(500).send({ error: 'Failed to create Mileage' });
  }
});

apiRouter.delete('/api/removemileagebyid', async (req, res) => {
  const mileageID = req.body.data;

  try {
    await deleteMileages(mileageID);
    res.json({ message: 'Mileage Removed!' });
  } catch (error) {
    logger.error(`Error in removing Mileage: ${error}`);
    res.status(500).send({ error: 'Failed to remove Mileage' });
  }
});

apiRouter.patch('/api/updatemileages/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const updates = req.body.data;

  const updateData = {};
  if (updates.is_verified !== undefined) updateData.is_verified = updates.is_verified;
  if (updates.is_listed !== undefined) updateData.is_listed = updates.is_listed;

  try {
    const updatedRows = await updateMileages(uuid, updateData);

    if (updatedRows.length === 0) {
      res.status(404).json({ error: 'Mileage not found' });
    }

    res.json({ message: 'Mileage Updated!' });
  } catch (error) {
    logger.error(`Error in updating Mileage: ${error}`);
    res.status(500).send({ error: 'Failed to update Mileage' });
  }
});

export default apiRouter;
