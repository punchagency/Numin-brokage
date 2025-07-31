// src/logger.ts
import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, errors } = format;

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp(),
    errors({ stack: true }), // 👈 capture stack trace
    printf(({ timestamp, level, message, stack }) =>
      stack
        ? `${timestamp} [${level.toUpperCase()}] ${message}\n${stack}`
        : `${timestamp} [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/app.log" }),
    new transports.File({ filename: "logs/error.log", level: "error" }), // 👈 log errors separately
  ],
});

export default logger;
