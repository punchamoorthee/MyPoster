// errors/UnauthorizedError.js
const ApiError = require("./ApiError");
const httpStatusCodes = require("../constants/httpStatusCodes");

class UnauthorizedError extends ApiError {
  /**
   * Constructor for UnauthorizedError.
   * @param {string} [message='Unauthorized'] - The error message (e.g., 'Authentication required' or 'Invalid credentials').
   * @param {boolean} [isOperational=true] - Flag indicating if the error is operational.
   */
  constructor(message = "Unauthorized", isOperational = true) {
    super(httpStatusCodes.UNAUTHORIZED, message, isOperational);
  }
}

module.exports = UnauthorizedError;
