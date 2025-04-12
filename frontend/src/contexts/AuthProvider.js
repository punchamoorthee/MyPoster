// src/contexts/AuthProvider.js
import React, { useState, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";

let logoutTimer;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid, tokenValue, expirationDate) => {
    setToken(tokenValue);
    setUserId(uid);
    // Calculate expiration date: now + 1 hour (from token) or use provided date
    const expiration =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(expiration);

    // Store in localStorage
    try {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: tokenValue,
          expiration: expiration.toISOString(), // Store as ISO string
        })
      );
    } catch (error) {
      console.error("Could not save auth data to localStorage:", error);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    try {
      localStorage.removeItem("userData");
    } catch (error) {
      console.error("Could not remove auth data from localStorage:", error);
    }
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    // Optionally redirect using useNavigate() here if needed globally, though usually handled in App.js/routes
  }, []);

  // Auto-login effect
  useEffect(() => {
    let storedData;
    try {
      const storedItem = localStorage.getItem("userData");
      if (storedItem) {
        storedData = JSON.parse(storedItem);
      }
    } catch (error) {
      console.error("Could not parse auth data from localStorage:", error);
      localStorage.removeItem("userData"); // Clear corrupted data
    }

    if (
      storedData &&
      storedData.token &&
      storedData.expiration && // Make sure expiration exists
      new Date(storedData.expiration) > new Date() // Check if token is expired
    ) {
      // Token is valid, log the user in
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    } else if (storedData) {
      // If expired or data is invalid, ensure clean state and remove item
      localStorage.removeItem("userData");
    }
  }, [login]); // Run only once on mount

  // Auto-logout timer effect
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      if (remainingTime > 1000) {
        // Only set timer if time > 1s
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        // If already expired or very close, log out immediately
        logout();
      }
    } else {
      // Clear timer if token is removed or expiration is null
      clearTimeout(logoutTimer);
    }
    // Cleanup function
    return () => clearTimeout(logoutTimer);
  }, [token, tokenExpirationDate, logout]);

  const authContextValue = {
    isLoggedIn: !!token, // Convert token presence to boolean
    token: token,
    userId: userId,
    login: login,
    logout: logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
