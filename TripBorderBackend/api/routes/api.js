import { Router } from 'express';
import { knexDBInstance } from '../knex/knexDBInstance';
import { insertMileages } from '../knex/mileageknex';

const apiRouter = Router();

// api Routes
apiRouter.get('/api/users', async (req, res) => {
  try {
    const users = await knexDBInstance('user_accounts')
      .select('uuid', 'provider', 'provider_user_id', 'email', 'name', 'created_at', 'updated_at');
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
        'verified'
      );
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
    res.send('Mileage Created!');
  } catch (error) {
    console.error('Error in creating Mileage:', error);
    res.status(500).send('Failed to create Mileage');
  }
});

export default apiRouter;
