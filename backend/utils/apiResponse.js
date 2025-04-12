// utils/apiResponse.js

/**
 * Creates a standardized success response object.
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Success message.
 * @param {*} data - The payload data.
 * @returns {object} Standardized response object.
 */
const createSuccessResponse = (statusCode, message, data = null) => {
  const response = {
    status: "success",
    message: message,
  };
  if (data !== null) {
    // If data is an object with a single key (e.g., { user: ... }),
    // often it's cleaner to directly assign the value.
    // Adjust this logic based on your preferred response structure.
    if (
      typeof data === "object" &&
      data !== null &&
      Object.keys(data).length === 1
    ) {
      response.data = data[Object.keys(data)[0]];
    } else {
      response.data = data;
    }
  }
  return { statusCode, body: response };
};

module.exports = { createSuccessResponse };
