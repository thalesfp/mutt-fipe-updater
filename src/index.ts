import * as Sentry from "@sentry/node";
import * as cron from "cron";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { createConnection } from "typeorm";

import logger from "./infra/logger/logger";
import { UpdateManager } from "./managers/UpdateManager";

dotenv.config();
Sentry.init({ dsn: process.env.SENTRY_DSN });

const initUpdate = async () => {
  let connection;

  try {
    /* tslint:disable:object-literal-sort-keys */
    connection = await createConnection({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + "/entity/*.js"],
      synchronize: false,
    });

    const updateManager = new UpdateManager();
    await updateManager.init(connection);
  } catch (error) {
    logger.error(error);
  } finally {
    if (connection.isConnected) {
      connection.close();
    }
  }
};

if (process.env.NODE_ENV === "production") {
  const job = new cron.CronJob("0 0 22 * * *", initUpdate);
  job.start();
  initUpdate();
} else {
  initUpdate();
}
