// errors/ApiError.js
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    // isOperational flags errors expected during runtime (vs. programming errors)
    this.isOperational = isOperational;
    this.name = this.constructor.name; // Ensures correct error name

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
