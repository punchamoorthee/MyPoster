// models/Poster.model.js  <-- Make sure this is the correct content for this file!
const mongoose = require("mongoose");
const validator = require("validator");

const posterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Poster title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      // required: true, // Make required if necessary
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      validate: [validator.isURL, "Please provide a valid image URL"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1888, "Year must be 1888 or later"], // Earliest known film
      max: [new Date().getFullYear() + 5, "Year seems too far in the future"], // Allow a bit of future dating
    },
    trailerUrl: {
      type: String,
      validate: {
        // Optional validation for URLs
        validator: (value) => !value || validator.isURL(value), // Allow empty/null or valid URL
        message: "Please provide a valid trailer URL",
      },
      default: null,
    },
    // Rename userId to creator or owner for clarity
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Poster must belong to a user"],
      ref: "User", // Reference the User model
      index: true, // Index for faster lookups by creator
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- Indexes ---
posterSchema.index({ title: "text", description: "text" });
posterSchema.index({ year: 1 });

// --- Model ---
const Poster = mongoose.model("Poster", posterSchema);

module.exports = Poster; // Export the model directly