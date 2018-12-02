import * as winston from "winston";

export default winston.createLogger({
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});
