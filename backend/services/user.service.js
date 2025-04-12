// services/user.service.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const config = require("../config");
const ApiError = require("../errors/ApiError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const httpStatusCodes = require("../constants/httpStatusCodes");

const generateToken = (userId, email) => {
  const payload = { userId, email };
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const getAllUsers = async () => {
  // Exclude password explicitly, even though model has select: false
  // Use lean() for performance if full Mongoose documents aren't needed
  const users = await User.find().select("-password").lean();
  return users;
};

const signupUser = async (userData) => {
  const { username, email, password } = userData;

  // Check for existing user (more efficient with $or)
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  }).lean(); // Use lean as we only need to check existence

  if (existingUser) {
    if (existingUser.email === email.toLowerCase()) {
      throw new ConflictError("Email address is already in use.");
    }
    if (existingUser.username === username.toLowerCase()) {
      throw new ConflictError("Username is already taken.");
    }
  }

  // Note: Password hashing is handled by the pre-save hook in the User model

  const newUser = new User({
    username,
    email, // Email is already lowercased by validator/model
    password,
    // Posters array removed from user model
  });

  await newUser.save(); // This triggers the pre-save hook for hashing

  const token = generateToken(newUser._id, newUser.email);

  // Return essential user info and token
  // The toJSON method in the model will remove the password
  return { user: newUser.toJSON(), token };
};

const loginUser = async (loginData) => {
  const { email, password } = loginData;

  // Find user by email, explicitly select password for comparison
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    throw new UnauthorizedError("Invalid email or password."); // Generic message for security
  }

  // Check password match using instance method
  const isMatch = await user.isPasswordMatch(password);

  if (!isMatch) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const token = generateToken(user._id, user.email);

  // Return essential user info and token
  return { user: user.toJSON(), token };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new NotFoundError(`User with ID ${userId} not found.`);
  }
  // Password is not selected by default due to `select: false` in schema
  return user;
};

module.exports = {
  getAllUsers,
  signupUser,
  loginUser,
  getUserById,
};
