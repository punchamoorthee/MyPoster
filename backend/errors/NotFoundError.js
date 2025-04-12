// errors/NotFoundError.js
const ApiError = require("./ApiError");
const httpStatusCodes = require("../constants/httpStatusCodes");

class NotFoundError extends ApiError {
  constructor(message = "Resource not found", isOperational = true) {
    super(httpStatusCodes.NOT_FOUND, message, isOperational);
  }
}

module.exports = NotFoundError;
