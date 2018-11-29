import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import { UpdateManager } from './managers/UpdateManager';

dotenv.config();

createConnection({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/entity/*.js'],
  synchronize: true,
})
  .then(async () => await UpdateManager.init())
  .catch(error => console.log(error));
