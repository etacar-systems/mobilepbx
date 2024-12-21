// src/logger.ts
import winston, { Logger } from "winston";

// Create and configure the logger instance
const logger: Logger = winston.createLogger({
  level: "info", // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    // Log to a file named 'app.log'
    new winston.transports.File({ filename: "app.log" }),
    // Log to the console as well (only for 'info' level or higher)
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// Export the logger for use in other files
export default logger;
