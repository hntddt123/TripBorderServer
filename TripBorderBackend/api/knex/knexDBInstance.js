import knex from 'knex';
import knexfile from '../../knexfile';

export const knexDBInstance = (process.env.NODE_ENV === 'development')
  ? knex(knexfile.development)
  : knex(knexfile.production);
