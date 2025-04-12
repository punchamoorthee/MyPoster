// models/User.model.js
const mongoose = require("mongoose");
const validator = require("validator"); // Use validator library directly for more flexibility
const bcrypt = require("bcryptjs");
const config = require("../config");
const ApiError = require("../errors/ApiError"); // For potential pre-save hooks errors
const httpStatusCodes = require("../constants/httpStatusCodes");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true, // Often usernames are case-insensitive
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"], // Enforce minimum length more strictly here
      select: false, // Prevent password from being returned by default in queries
    },
    // posters field is managed via Poster model's userId reference
    // Keeping a list here can lead to data duplication/inconsistency.
    // If needed for performance, manage carefully. Removed for simplicity/best practice.
    // posters: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Poster',
    //   },
    // ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    toJSON: { virtuals: true }, // Ensure virtuals are included when converting to JSON
    toObject: { virtuals: true }, // Ensure virtuals are included when converting to Object
  }
);

// --- Indexes ---
// Unique indexes are created automatically from `unique: true` in schema definition.
// Add compound indexes if needed for specific query patterns.
// userSchema.index({ username: 1 }); // Already handled by unique: true
// userSchema.index({ email: 1 }); // Already handled by unique: true

// --- Virtuals ---
// Example: userSchema.virtual('posters', { ... }) if you need to populate posters without storing the array here.

// --- Middleware (Hooks) ---

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost factor from config
  try {
    this.password = await bcrypt.hash(this.password, config.bcrypt.saltRounds);
    next();
  } catch (error) {
    // Pass error to the next middleware (likely the central error handler via save operation)
    next(
      new ApiError(
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Error hashing password",
        false,
        error.stack
      )
    );
  }
});

// --- Instance Methods ---

// Method to check password validity
userSchema.methods.isPasswordMatch = async function (candidatePassword) {
  // 'this.password' will be available here because we needed it for comparison,
  // even though 'select: false' is set in the schema. Mongoose handles this.
  // If it causes issues, query explicitly with .select('+password') when needed.
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to remove password from user object before sending response
// (Alternative to select: false, or used in combination)
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  // delete userObject.__v; // Optional: remove version key
  // delete userObject.createdAt; // Optional
  // delete userObject.updatedAt; // Optional
  return userObject;
};

// --- Model ---
const User = mongoose.model("User", userSchema);

module.exports = User;
