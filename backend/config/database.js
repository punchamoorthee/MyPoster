// config/database.js
const mongoose = require("mongoose");
const config = require("./index");
const logger = require("../utils/logger");

mongoose.set("strictQuery", true); // Or false based on preference

// Optional: Enable Mongoose debugging if configured
if (config.mongoose.debug) {
  mongoose.set("debug", (collectionName, method, query, doc) => {
    logger.debug(
      `Mongoose: ${collectionName}.${method}(${JSON.stringify(
        query
      )}, ${JSON.stringify(doc)})`
    );
  });
}

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info("MongoDB Connected Successfully");
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    // Let the calling function (server start) handle process exit
    throw error;
  }

  mongoose.connection.on("error", (err) => {
    logger.error(`MongoDB runtime error: ${err}`);
    // Consider more robust handling like attempting reconnect or shutting down
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected.");
  });
};

module.exports = connectDB;
