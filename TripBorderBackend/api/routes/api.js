import { Router } from 'express';
import { knexDBInstance } from '../knex/knexDBInstance';
import { insertMileages, deleteMileages, updateMileages } from '../knex/mileageknex';

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
    console.error('Error Fetching User', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

apiRouter.get('/api/mileages', async (req, res) => {
  try {
    const mileages = await knexDBInstance('mileages')
      .select(
        'uuid',
        'frequent_flyer_number',
        'airline',
        'mileage_price',
        'mileage_amount',
        'mileage_unit',
        'mileage_picture',
        'mileage_expired_at',
        'created_at',
        'updated_at',
        'is_verified',
        'is_listed',
        'owner_email'
      )
      .orderBy('created_at', 'desc');
    res.json(mileages);
  } catch (error) {
    console.error('Error Fetching mileages', error);
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
    console.error('Error Fetching mileages', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

apiRouter.post('/api/uploadmileages', async (req, res) => {
  const newMileage = req.body.data;

  try {
    await insertMileages(newMileage);
    res.json({ message: 'Mileage Created!' });
  } catch (error) {
    console.error('Error in creating Mileage:', error);
    res.status(500).send({ error: 'Failed to create Mileage' });
  }
});

apiRouter.delete('/api/removemileagebyid', async (req, res) => {
  const mileageID = req.body.data;

  try {
    await deleteMileages(mileageID);
    res.json({ message: 'Mileage Removed!' });
  } catch (error) {
    console.error('Error in removing Mileage:', error);
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
    console.error('Error in updating Mileage:', error);
    res.status(500).send({ error: 'Failed to update Mileage' });
  }
});

export default apiRouter;
