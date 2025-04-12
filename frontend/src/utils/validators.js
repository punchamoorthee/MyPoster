// src/utils/validators.js

// Validator type constants
const VALIDATOR_TYPE_REQUIRE = "REQUIRE";
const VALIDATOR_TYPE_MINLENGTH = "MINLENGTH";
const VALIDATOR_TYPE_MAXLENGTH = "MAXLENGTH";
const VALIDATOR_TYPE_MIN = "MIN";
const VALIDATOR_TYPE_MAX = "MAX";
const VALIDATOR_TYPE_EMAIL = "EMAIL";
const VALIDATOR_TYPE_URL = "URL";
const VALIDATOR_TYPE_NUMBER = "NUMBER"; // Added for explicit number check

// Validator configuration functions
export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_MINLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val,
});
export const VALIDATOR_MAXLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val,
});
export const VALIDATOR_MIN = (val) => ({ type: VALIDATOR_TYPE_MIN, val });
export const VALIDATOR_MAX = (val) => ({ type: VALIDATOR_TYPE_MAX, val });
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });
// Optional URL: allow empty string or null/undefined if isOptional is true
export const VALIDATOR_URL = (isOptional = false) => ({
  type: VALIDATOR_TYPE_URL,
  isOptional,
});
export const VALIDATOR_NUMBER = () => ({ type: VALIDATOR_TYPE_NUMBER });

// Main validation function
export const validate = (value, validators) => {
  let isValid = true;
  let valueToCheck = value;

  // Convert number to string for length checks if necessary, but keep original type for number checks
  if (typeof valueToCheck === "number") {
    valueToCheck = valueToCheck.toString();
  } else if (valueToCheck == null) {
    // Handle null or undefined gracefully
    valueToCheck = "";
  }

  for (const validator of validators) {
    switch (validator.type) {
      case VALIDATOR_TYPE_REQUIRE:
        isValid = isValid && valueToCheck.trim().length > 0;
        break;
      case VALIDATOR_TYPE_MINLENGTH:
        isValid = isValid && valueToCheck.trim().length >= validator.val;
        break;
      case VALIDATOR_TYPE_MAXLENGTH:
        isValid = isValid && valueToCheck.trim().length <= validator.val;
        break;
      case VALIDATOR_TYPE_MIN:
        // Use original value for number comparison
        isValid =
          isValid && typeof value === "number" && value >= validator.val;
        break;
      case VALIDATOR_TYPE_MAX:
        // Use original value for number comparison
        isValid =
          isValid && typeof value === "number" && value <= validator.val;
        break;
      case VALIDATOR_TYPE_EMAIL:
        isValid = isValid && /^\S+@\S+\.\S+$/.test(valueToCheck);
        break;
      case VALIDATOR_TYPE_URL:
        // If optional and empty, it's valid
        if (
          validator.isOptional &&
          (!valueToCheck || valueToCheck.trim().length === 0)
        ) {
          continue; // Skip check for this validator
        }
        // Simple URL regex (consider a more robust library for complex needs)
        // Checks for http://, https://, or ftp:// followed by characters
        isValid =
          isValid && /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(valueToCheck);
        break;
      case VALIDATOR_TYPE_NUMBER:
        // Check if the original value is a finite number
        isValid = isValid && typeof value === "number" && isFinite(value);
        // Alternative: Check if string value can be parsed to a finite number
        // isValid = isValid && !isNaN(parseFloat(valueToCheck)) && isFinite(valueToCheck);
        break;
      default:
        // Optionally handle unknown validator types
        console.warn(`Unknown validator type: ${validator.type}`);
        break;
    }
    // Short-circuit if already invalid
    if (!isValid) {
      break;
    }
  }
  return isValid;
};
