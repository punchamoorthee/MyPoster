// errors/ForbiddenError.js
const ApiError = require("./ApiError");
const httpStatusCodes = require("../constants/httpStatusCodes");

class ForbiddenError extends ApiError {
  /**
   * Constructor for ForbiddenError.
   * @param {string} [message='Forbidden'] - The error message (e.g., 'You do not have permission to perform this action').
   * @param {boolean} [isOperational=true] - Flag indicating if the error is operational.
   */
  constructor(message = "Forbidden", isOperational = true) {
    super(httpStatusCodes.FORBIDDEN, message, isOperational);
  }
}

module.exports = ForbiddenError;
