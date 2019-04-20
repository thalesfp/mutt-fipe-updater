import * as winston from "winston";

const formatPrinter = winston.format.printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  formatPrinter,
);

const transports =
  process.env.NODE_ENV === "production"
    ? [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "production.log" }),
      ]
    : new winston.transports.Console();

export default winston.createLogger({ format, transports });
