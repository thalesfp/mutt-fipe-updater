import * as Sentry from "@sentry/node";
import * as cron from "cron";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { createConnection } from "typeorm";

import logger from "./infra/logger/logger";
import { FipeManager } from "./managers/FipeManager";
import { UpdateManager } from "./managers/UpdateManager";

dotenv.config();
Sentry.init({ dsn: process.env.SENTRY_DSN });

const initUpdate = async () => {
  try {
    const fipeManager = new FipeManager();
    const updateManager = new UpdateManager(fipeManager);

    /* tslint:disable:object-literal-sort-keys */
    const connection = await createConnection({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + "/entity/*.js"],
      synchronize: false,
    });

    await updateManager.init(connection);

    connection.close();
  } catch (error) {
    logger.error(error);
  }
};

if (process.env.NODE_ENV === "production") {
  const job = new cron.CronJob("0 0 5 * * *", initUpdate);
  job.start();
} else {
  initUpdate();
}
