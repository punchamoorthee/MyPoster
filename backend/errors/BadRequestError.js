// errors/BadRequestError.js
const ApiError = require("./ApiError");
const httpStatusCodes = require("../constants/httpStatusCodes");

class BadRequestError extends ApiError {
  /**
   * Constructor for BadRequestError.
   * @param {string} [message='Bad Request'] - The error message.
   * @param {boolean} [isOperational=true] - Flag indicating if the error is operational.
   */
  constructor(message = "Bad Request", isOperational = true) {
    super(httpStatusCodes.BAD_REQUEST, message, isOperational);
  }
}

module.exports = BadRequestError;
