// middleware/authenticateToken.js
const jwt = require("jsonwebtoken");
const config = require("../config");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ForbiddenError = require("../errors/ForbiddenError");
const ApiError = require("../errors/ApiError");
const httpStatusCodes = require("../constants/httpStatusCodes");

const authenticateToken = (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Authentication required. No token provided."
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError(
        "Authentication required. Token format invalid."
      );
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    // Attach user data to the request object for subsequent middleware/handlers
    // Ensure the payload structure matches what you put in during signing
    req.user = {
      id: decoded.userId, // Use 'id' consistently
      email: decoded.email,
      // Add other relevant fields from token if needed (e.g., roles)
    };

    next(); // Token is valid, proceed
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Specific JWT errors (e.g., malformed token)
      next(new UnauthorizedError("Invalid token. Please log in again."));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(
        new UnauthorizedError("Your token has expired. Please log in again.")
      );
    } else if (error instanceof UnauthorizedError) {
      // Pass our specific UnauthorizedError through
      next(error);
    } else {
      // Catch unexpected errors during verification
      // Use Forbidden (403) as per original code's intent for general catch,
      // although Unauthorized (401) is often more appropriate for auth failures.
      // Let's stick to 401 for consistency with JWT errors.
      next(
        new ApiError(
          httpStatusCodes.INTERNAL_SERVER_ERROR,
          "Authentication failed.",
          false,
          error.stack
        )
      ); // Non-operational
    }
  }
};

module.exports = authenticateToken;
