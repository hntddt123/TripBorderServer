import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
let DB_PASSWORD;

try {
  DB_PASSWORD = fs.readFileSync('/run/secrets/db_password', 'utf8').trim();
} catch (error) {
  DB_PASSWORD = process.env.DB_PASSWORD;
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     host: process.env.DB_HOST,
  //     user: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_NAME,
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  }
};
