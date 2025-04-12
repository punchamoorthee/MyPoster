// validators/user.validators.js
const { body } = require("express-validator");

const signupValidationRules = () => [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("password")
    // Don't trim passwords
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    // Add complexity requirements if needed (e.g., .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/) )
    .withMessage("Password does not meet complexity requirements."), // Example message
];

const loginValidationRules = () => [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("password").notEmpty().withMessage("Password is required."),
];

module.exports = {
  signupValidationRules,
  loginValidationRules,
};
