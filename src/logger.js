const winston = require("winston");
const path = require("path");

const logFilePath = path.join(__dirname, "..", "history_log.txt");

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({ level: "debug" }),
    new winston.transports.File({ filename: logFilePath, level: "info" }),
  ],
});

console.log(`Logger initialized. Writing logs to: ${logFilePath}`);

module.exports = logger;
