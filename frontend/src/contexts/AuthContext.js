// src/contexts/AuthContext.js
import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: (userId, token, expirationDate) => {}, // Define function signatures
  logout: () => {},
});
