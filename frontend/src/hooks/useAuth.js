// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Custom hook to easily consume authentication context.
 * Provides access to login status, user ID, token, and login/logout functions.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
