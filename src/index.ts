import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import * as Sentry from '@sentry/node';

import { UpdateManager } from './managers/UpdateManager';

dotenv.config();
Sentry.init({ dsn: process.env.SENTRY_DSN });

createConnection({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/entity/*.js'],
  synchronize: false,
})
  .then(async () => await UpdateManager.init())
  .catch(error => console.log(error));
