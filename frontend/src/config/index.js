// src/config/index.js
const config = {
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:5432/api/v1", // Default for safety
};

if (!process.env.REACT_APP_API_URL) {
  console.warn(
    "REACT_APP_API_URL environment variable not set. Using default:",
    config.apiUrl
  );
}

export default config;