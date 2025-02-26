import { Router } from 'express';
import knex from 'knex';
import fs from 'fs';

const devRouter = Router();
const { DB_HOST, DB_USER, DB_NAME } = process.env;
const DB_PASSWORD = fs.readFileSync('/run/secrets/db_password', 'utf8').trim();

const db = knex({
  client: 'pg',
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
});

// Dev Routes
devRouter.get('/api/users', async (req, res) => {
  try {
    const users = await db('user_accounts')
      .select('id', 'provider', 'provider_user_id', 'email', 'name', 'created_at', 'updated_at');
    res.json(users);
  } catch (error) {
    console.error('Error Fetching User', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

devRouter.get('/api/mileages', async (req, res) => {
  try {
    const mileages = await db('mileages')
      .select(
        'id',
        'frequent_flyer_number',
        'airline',
        'mileage_price',
        'mileage_amount',
        'mileage_unit',
        'mileage_picture',
        'mileage_expired_at',
        'created_at',
        'updated_at'
      );
    res.json(mileages);
  } catch (error) {
    console.error('Error Fetching mileages', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default devRouter;
