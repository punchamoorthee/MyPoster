// validators/poster.validators.js
const { body, param } = require("express-validator");
const currentYear = new Date().getFullYear();

const mongoIdParamValidation = (paramName = "id") => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName} format.`),
];

const posterBodyValidationRules = (isPatch = false) => {
  const titleValidation = body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 150 })
    .withMessage("Title cannot exceed 150 characters.");

  const yearValidation = body("year")
    .isInt({ min: 1888, max: currentYear + 5 })
    .withMessage(`Year must be a number between 1888 and ${currentYear + 5}.`);

  const imageUrlValidation = body("imageUrl")
    .trim()
    .isURL()
    .withMessage("Please provide a valid image URL.");

  const descriptionValidation = body("description")
    .optional() // Make optional unless required
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters.");

  const trailerUrlValidation = body("trailerUrl")
    .optional({ nullable: true, checkFalsy: true }) // Allow null or empty string
    .trim()
    .isURL()
    .withMessage("Please provide a valid trailer URL.");

  // For PATCH, make fields optional unless they are explicitly being updated
  if (isPatch) {
    return [
      titleValidation.optional(),
      yearValidation.optional(),
      imageUrlValidation.optional(),
      descriptionValidation, // Remains optional
      trailerUrlValidation, // Remains optional
    ];
  }

  // For POST, require core fields
  return [
    titleValidation,
    yearValidation,
    imageUrlValidation,
    descriptionValidation,
    trailerUrlValidation,
    // Don't validate userId in body, it should come from authenticated user (req.user.id)
  ];
};

module.exports = {
  mongoIdParamValidation,
  posterBodyValidationRules,
};
