// routes/user.routes.js
const express = require("express");
const usersController = require("../controllers/user.controller");
const {
  signupValidationRules,
  loginValidationRules,
} = require("../validators/user.validators");
const validateRequest = require("../middleware/validateRequest");
const authenticateToken = require("../middleware/authenticateToken"); // Import auth middleware

const router = express.Router();

// Public routes
router.post(
  "/signup",
  signupValidationRules(), // Apply validation rules
  validateRequest, // Handle validation results
  usersController.signupUser
);

router.post(
  "/login",
  loginValidationRules(), // Apply validation rules
  validateRequest, // Handle validation results
  usersController.loginUser
);

// Protected routes (example: get current user profile)
router.get(
  "/me",
  authenticateToken, // Ensure user is logged in
  usersController.getCurrentUser
);

// Protected route (example: get all users - potentially admin only)
// Add authorization middleware here if needed (e.g., check user role)
router.get(
  "/",
  authenticateToken, // Ensure user is logged in
  // requireAdminRole,     // Example: authorization middleware
  usersController.getAllUsers
);

module.exports = router;
