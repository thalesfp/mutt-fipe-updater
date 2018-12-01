import * as Sentry from "@sentry/node";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { createConnection } from "typeorm";

import logger from "./infra/logging/logging";
import { UpdateManager } from "./managers/UpdateManager";

dotenv.config();
Sentry.init({ dsn: process.env.SENTRY_DSN });

/* tslint:disable:object-literal-sort-keys */
createConnection({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + "/entity/*.js"],
  synchronize: false,
})
  .then(async () => await UpdateManager.init())
  .catch((error) => logger.error(error));
