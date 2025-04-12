// controllers/user.controller.js
const userService = require("../services/user.service");
const { createSuccessResponse } = require("../utils/apiResponse");
const httpStatusCodes = require("../constants/httpStatusCodes");

const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  const response = createSuccessResponse(
    httpStatusCodes.OK,
    "Users retrieved successfully",
    users
  );
  res.status(response.statusCode).json(response.body);
};

const signupUser = async (req, res) => {
  const { user, token } = await userService.signupUser(req.body);
  // Consider setting token in a secure HttpOnly cookie for web clients
  // res.cookie('token', token, { httpOnly: true, secure: config.env === 'production', sameSite: 'strict' });
  const response = createSuccessResponse(
    httpStatusCodes.CREATED,
    "User registered successfully",
    { user, token }
  );
  res.status(response.statusCode).json(response.body);
};

const loginUser = async (req, res) => {
  const { user, token } = await userService.loginUser(req.body);
  // Consider setting token in a secure HttpOnly cookie
  const response = createSuccessResponse(
    httpStatusCodes.OK,
    "Login successful",
    { user, token }
  );
  res.status(response.statusCode).json(response.body);
};

// Optional: Get current authenticated user profile
const getCurrentUser = async (req, res) => {
  // Assumes authenticateToken middleware added user id to req.user.id
  const userId = req.user.id;
  const user = await userService.getUserById(userId); // Service handles not found
  const response = createSuccessResponse(
    httpStatusCodes.OK,
    "User profile retrieved",
    user
  );
  res.status(response.statusCode).json(response.body);
};

module.exports = {
  getAllUsers,
  signupUser,
  loginUser,
  getCurrentUser, // Export new controller if added
};
