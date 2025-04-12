// middleware/validateRequest.js
const { validationResult } = require("express-validator");
const ApiError = require("../errors/ApiError");
const httpStatusCodes = require("../constants/httpStatusCodes");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors for better readability
    const extractedErrors = errors
      .array()
      .map((err) => ({ [err.param]: err.msg }));
    // Use 422 Unprocessable Entity for validation errors
    throw new ApiError(
      httpStatusCodes.UNPROCESSABLE_ENTITY,
      "Validation Failed",
      true, // Operational error
      JSON.stringify(extractedErrors) // Optionally include details in stack/non-prod message
    );
    // Alternative: Send simpler message
    // throw new ApiError(httpStatusCodes.UNPROCESSABLE_ENTITY, `Invalid input for: ${Object.keys(extractedErrors[0])[0]}`);
  }
  next();
};

module.exports = validateRequest;
