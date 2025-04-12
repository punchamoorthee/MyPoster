// middleware/logger.middleware.js
const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const logMessage = `${req.method} ${req.originalUrl} ${
      res.statusCode
    } ${durationInMilliseconds.toLocaleString()} ms`;

    if (res.statusCode >= 400) {
      logger.warn(logMessage); // Log warnings/errors differently
    } else {
      logger.info(logMessage);
    }
  });

  res.on("error", (err) => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    logger.error(
      `${req.method} ${req.originalUrl} ${
        res.statusCode || 500
      } ${durationInMilliseconds.toLocaleString()} ms - Response Error: ${
        err.message
      }`
    );
  });

  next();
};

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

module.exports = { requestLogger };
