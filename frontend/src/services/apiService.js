// src/services/apiService.js
import config from "../config";

/**
 * Performs a fetch request with standardized options and error handling.
 * @param {string} endpoint - The API endpoint (e.g., '/users/login').
 * @param {object} options - Fetch options (method, body, headers, signal).
 * @param {string} [token=null] - Optional JWT token for authorization.
 * @returns {Promise<any>} - The JSON response data (or null for 204).
 * @throws {Error} - Throws an error with the message from the API or a generic one.
 */
const apiRequest = async (endpoint, options = {}, token = null) => {
  const url = `${config.apiUrl}${endpoint}`;
  const headers = {
    // Default to JSON content type unless specified otherwise
    "Content-Type":
      options.body instanceof FormData ? undefined : "application/json",
    ...options.headers,
  };

  // Remove Content-Type header if body is FormData (browser sets it with boundary)
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 204 No Content specifically first
    if (response.status === 204) {
      return null;
    }

    // Try parsing JSON for all other responses
    const responseData = await response.json().catch((err) => {
      // If parsing fails, could be non-JSON error (HTML page) or network issue
      console.error("Failed to parse JSON response:", err);
      // Try to use statusText for a meaningful message if JSON parsing fails
      return {
        message: `Request failed: ${response.status} ${
          response.statusText || "Server Error"
        }`,
      };
    });

    if (!response.ok) {
      // Use message from backend response if available, otherwise use generic status text
      // Backend error structure might be { message: '...' } or { error: '...' }
      const errorMessage =
        responseData.message ||
        responseData.error ||
        `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    // For successful requests (2xx), return the parsed data
    // Assuming backend might send { status: 'success', data: ... } or just the data
    return responseData.data || responseData;
  } catch (error) {
    // Log the error and ensure it has a message before re-throwing
    console.error(
      `API Request Error (${options.method || "GET"} ${endpoint}):`,
      error
    );
    const message = error.message || "An unknown network error occurred.";
    // Avoid throwing generic "Failed to fetch" for network issues if possible
    if (error.name === "TypeError" && !error.message) {
      throw new Error(
        "Network request failed. Check API server status and CORS configuration."
      );
    }
    throw new Error(message);
  }
};

export default apiRequest;
