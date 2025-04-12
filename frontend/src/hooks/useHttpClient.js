// src/hooks/useHttpClient.js
import { useState, useCallback, useRef, useEffect } from "react";
import apiRequest from "../services/apiService";
import { useAuth } from "./useAuth";

/**
 * Custom hook for making HTTP requests with loading, error handling, and abort control.
 * Integrates with AuthContext to automatically include JWT tokens.
 */
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Get current token from auth context

  // useRef to store active AbortControllers
  const activeHttpRequests = useRef([]);

  /**
   * Sends an HTTP request using the apiService.
   * @param {string} endpoint - The API endpoint (e.g., '/users').
   * @param {string} [method='GET'] - HTTP method.
   * @param {object|string|FormData|null} [body=null] - Request body. Will be stringified if an object unless FormData.
   * @param {object} [headers={}] - Custom headers.
   * @param {boolean} [requiresAuth=true] - Whether to include the JWT token.
   * @returns {Promise<any>} The response data from the API.
   * @throws {Error} Throws an error if the request fails.
   */
  const sendRequest = useCallback(
    async (
      endpoint,
      method = "GET",
      body = null,
      headers = {},
      requiresAuth = true // Most protected routes need auth by default
    ) => {
      setIsLoading(true);
      setError(null); // Clear previous errors

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      // Determine the token to use
      const currentToken = requiresAuth ? token : null;

      // Prepare body: Stringify if it's a plain object and not FormData
      let requestBody = body;
      if (body && typeof body === "object" && !(body instanceof FormData)) {
        try {
          requestBody = JSON.stringify(body);
        } catch (jsonError) {
          console.error("Failed to stringify request body:", jsonError);
          setError("Invalid request data provided.");
          setIsLoading(false);
          throw new Error("Invalid request data.");
        }
      }

      try {
        const responseData = await apiRequest(
          endpoint,
          {
            method,
            body: requestBody,
            headers,
            signal: httpAbortCtrl.signal,
          },
          currentToken // Pass token to apiService
        );

        // Remove controller after successful request
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );
        setIsLoading(false);
        return responseData;
      } catch (err) {
        // Error is formatted by apiService
        setError(err.message || "An unknown error occurred.");
        setIsLoading(false);
        // Do not remove abort controller here, let cleanup handle it if needed
        throw err; // Re-throw for component-level handling
      }
    },
    [token] // Dependency: re-create sendRequest if token changes
  );

  // Function to manually clear the error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Effect for cleanup: abort all active requests when the component unmounts
  useEffect(() => {
    const controllers = activeHttpRequests.current; // Capture ref value
    return () => {
      controllers.forEach((abortCtrl) => {
        try {
          abortCtrl.abort();
        } catch (abortError) {
          console.warn("Error aborting request:", abortError);
        }
      });
    };
  }, []); // Empty dependency array means this runs only on mount and unmount

  return { isLoading, error, sendRequest, clearError };
};
