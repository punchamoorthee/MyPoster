// middleware/errorHandler.js
const mongoose = require("mongoose");
const config = require("../config");
const logger = require("../utils/logger");
const ApiError = require("../errors/ApiError");
const httpStatusCodes = require("../constants/httpStatusCodes");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ApiError(httpStatusCodes.BAD_REQUEST, message);
};

const handleDuplicateFieldsDB = (err) => {
  // Extract value using regex or err.keyValue for newer Mongoose versions
  let value = "unknown";
  if (err.keyValue) {
    const key = Object.keys(err.keyValue)[0];
    value = err.keyValue[key];
  } else {
    // Fallback for older versions or different error structures
    const match = err.message.match(/(["'])(\\?.)*?\1/);
    if (match) value = match[0];
  }

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ApiError(httpStatusCodes.CONFLICT, message); // 409 Conflict
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ApiError(httpStatusCodes.UNPROCESSABLE_ENTITY, message); // 422 for validation
};

const handleJWTError = () =>
  new ApiError(
    httpStatusCodes.UNAUTHORIZED,
    "Invalid token. Please log in again."
  );

const handleJWTExpiredError = () =>
  new ApiError(
    httpStatusCodes.UNAUTHORIZED,
    "Your token has expired. Please log in again."
  );

const sendErrorDev = (err, req, res) => {
  logger.error("ERROR 💥", err); // Log the full error in development
  return res
    .status(err.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR)
    .json({
      status: err.status || "error",
      error: err,
      message: err.message,
      stack: err.stack, // Send stack trace in development
    });
};

const sendErrorProd = (err, req, res) => {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: "fail", // Or 'error' depending on convention
      message: err.message,
    });
  }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  logger.error("ERROR 💥", err); // Log the full error for developers

  // 2) Send generic message
  return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

const centralErrorHandler = (err, req, res, next) => {
  let error = { ...err }; // Clone error to avoid mutating original
  error.message = err.message; // Ensure message property exists
  error.statusCode = err.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR;
  error.status =
    err.status || `${error.statusCode}`.startsWith("4") ? "fail" : "error";

  // Handle specific Mongoose errors
  if (error instanceof mongoose.Error.CastError)
    error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error); // MongoDB duplicate key error
  if (error instanceof mongoose.Error.ValidationError)
    error = handleValidationErrorDB(error);

  // Handle specific JWT errors
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

  // Handle custom ApiErrors (already formatted)
  if (!(error instanceof ApiError)) {
    // If it's not a known type or ApiError, wrap it for consistent handling
    // Mark non-operational errors explicitly if needed
    const isOperational =
      error.isOperational !== undefined ? error.isOperational : false;
    error = new ApiError(
      error.statusCode,
      error.message,
      isOperational,
      error.stack
    );
  }

  if (config.env === "development") {
    sendErrorDev(error, req, res);
  } else if (config.env === "production") {
    sendErrorProd(error, req, res);
  } else {
    // Fallback for other environments or if env isn't set correctly
    logger.error("ERROR (Unknown Env) 💥", error);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An internal server error occurred.",
    });
  }
};

module.exports = { centralErrorHandler };
