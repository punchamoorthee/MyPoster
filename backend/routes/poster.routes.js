// routes/poster.routes.js
const express = require("express");
const postersController = require("../controllers/poster.controller");
const {
  mongoIdParamValidation,
  posterBodyValidationRules,
} = require("../validators/poster.validators");
const validateRequest = require("../middleware/validateRequest");
const authenticateToken = require("../middleware/authenticateToken"); // JWT verification

const router = express.Router();

// --- Public Routes ---
router.get(
  "/:posterId",
  mongoIdParamValidation("posterId"), // Validate posterId format
  validateRequest,
  postersController.getPosterByPosterId
);

router.get(
  "/user/:userId",
  mongoIdParamValidation("userId"), // Validate userId format
  validateRequest,
  postersController.getPostersByUserId
);

// --- Protected Routes (Require Authentication) ---
// Apply authentication middleware to all subsequent routes in this router
router.use(authenticateToken);

router.post(
  "/",
  posterBodyValidationRules(), // Apply validation rules for POST
  validateRequest, // Handle validation results
  postersController.postPoster
);

router.patch(
  "/:posterId",
  mongoIdParamValidation("posterId"), // Validate posterId format
  posterBodyValidationRules(true), // Apply validation rules for PATCH (optional fields)
  validateRequest, // Handle validation results
  postersController.patchPosterById
);

router.delete(
  "/:posterId",
  mongoIdParamValidation("posterId"), // Validate posterId format
  validateRequest, // Handle validation results
  postersController.deletePosterById
);

module.exports = router;
