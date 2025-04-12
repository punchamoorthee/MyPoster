// errors/ConflictError.js
const ApiError = require("./ApiError");
const httpStatusCodes = require("../constants/httpStatusCodes");

class ConflictError extends ApiError {
  /**
   * Constructor for ConflictError.
   * @param {string} [message='Conflict'] - The error message (e.g., 'Resource already exists').
   * @param {boolean} [isOperational=true] - Flag indicating if the error is operational.
   */
  constructor(message = "Conflict", isOperational = true) {
    super(httpStatusCodes.CONFLICT, message, isOperational);
  }
}

module.exports = ConflictError;
