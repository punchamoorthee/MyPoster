// server.js
require("express-async-errors"); // Must be first require to handle async errors globally
const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config");
const connectDB = require("./config/database");
const apiRoutes = require("./routes");
const { requestLogger } = require("./middleware/logger.middleware");
const { centralErrorHandler } = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const ApiError = require("./errors/ApiError");
const httpStatusCodes = require("./constants/httpStatusCodes");

// Initialize Express app
const app = express();

// --- Core Middleware ---

// Security Headers
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: config.env === "production" ? config.corsAllowedOrigins : "*", // Restrict in prod
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // If you need cookies/sessions
};
app.use(cors(corsOptions));
// Handle CORS preflight requests
app.options("*", cors(corsOptions));

// Body Parsing
app.use(express.json({ limit: "10kb" })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Request Logging
app.use(requestLogger);

// --- API Routes ---
app.use("/api/v1", apiRoutes); // Versioned API

// --- Health Check ---
app.get("/health", (req, res) => res.status(httpStatusCodes.OK).send("OK"));

// --- Not Found Handler ---
app.use((req, res, next) => {
  next(
    new ApiError(httpStatusCodes.NOT_FOUND, `Not Found - ${req.originalUrl}`)
  );
});

// --- Central Error Handler ---
app.use(centralErrorHandler);

// --- Server Initialization ---
const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB(); // Connect to database first
    server.listen(config.port, () => {
      logger.info(
        `Server listening on port ${config.port} in ${config.env} mode`
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1); // Exit if database connection fails
  }
};

startServer();

// --- Graceful Shutdown Handling ---
const unexpectedErrorHandler = (error) => {
  logger.error("UNHANDLED ERROR:", error);
  // Gracefully shutdown server (optional but recommended)
  server.close(() => {
    logger.info("Server closed due to unhandled error.");
    process.exit(1);
  });
  // Force shutdown if server doesn't close in time
  setTimeout(() => process.exit(1), 5000).unref();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", (reason) => {
  // Throw reason so uncaughtException handler catches it
  throw reason instanceof Error
    ? reason
    : new Error(`Unhandled Rejection: ${reason}`);
});

// Handle SIGTERM (e.g., from Docker/Kubernetes)
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received. Closing HTTP server.");
  server.close(() => {
    logger.info("HTTP server closed.");
    // Add cleanup logic here (e.g., close DB connection pool if applicable)
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force exit after 10s
});
