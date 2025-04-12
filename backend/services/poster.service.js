// services/poster.service.js
const mongoose = require("mongoose");
const Poster = require("../models/Poster.model");
const User = require("../models/User.model"); // Keep User model for checking creator existence if needed
const ApiError = require("../errors/ApiError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const httpStatusCodes = require("../constants/httpStatusCodes");

const getPosterById = async (posterId) => {
  const poster = await Poster.findById(posterId).lean(); // Use lean for read-only ops
  if (!poster) {
    throw new NotFoundError(`Poster with ID ${posterId} not found.`);
  }
  return poster;
};

const getPostersByUserId = async (userId) => {
  // Optional: Check if user exists first
  // const userExists = await User.findById(userId).lean();
  // if (!userExists) {
  //   throw new NotFoundError(`User with ID ${userId} not found.`);
  // }

  // Find posters where the 'creator' field matches the userId
  const posters = await Poster.find({ creator: userId }).lean(); // Use lean

  // No need to map if using lean(), results are plain objects
  return posters;
};

const createPoster = async (posterData, userId) => {
  // // Optional: Verify user exists (can be skipped if userId comes from authenticated token)
  // const creatorExists = await User.findById(userId).countDocuments();
  // if (!creatorExists) {
  //    throw new NotFoundError(`Cannot create poster: User with ID ${userId} not found.`);
  // }

  const newPoster = new Poster({
    ...posterData,
    creator: userId, // Set the creator from the authenticated user
  });

  // No complex transaction needed here as we removed the posters array from User model
  await newPoster.save();
  return newPoster.toObject(); // Return plain object
};

const updatePosterById = async (posterId, updateData, requestingUserId) => {
  const poster = await Poster.findById(posterId);

  if (!poster) {
    throw new NotFoundError(`Poster with ID ${posterId} not found.`);
  }

  // Authorization check: Ensure the requesting user is the creator
  if (poster.creator.toString() !== requestingUserId) {
    throw new ForbiddenError("You are not authorized to update this poster.");
  }

  // Update fields provided in updateData
  Object.assign(poster, updateData);

  await poster.save(); // Use save to trigger potential Mongoose middleware/validation
  return poster.toObject(); // Return updated plain object

  /* Alternative using findByIdAndUpdate (less overhead, skips middleware):
   const updatedPoster = await Poster.findByIdAndUpdate(
      posterId,
      { $set: updateData }, // Use $set to update only provided fields
      { new: true, runValidators: true, context: 'query' } // Return updated doc, run schema validators
   ).lean();

   if (!updatedPoster) {
     throw new NotFoundError(`Poster with ID ${posterId} not found.`);
   }
   // Add authorization check here if needed before returning
   if (updatedPoster.creator.toString() !== requestingUserId) {
       // This check might be less reliable here if creator wasn't populated
       // Fetching first (like above) is safer for authorization
       throw new ForbiddenError('You are not authorized to update this poster.');
   }
   return updatedPoster;
   */
};

const deletePosterById = async (posterId, requestingUserId) => {
  const poster = await Poster.findById(posterId); // Fetch first to check ownership

  if (!poster) {
    // Idempotent delete: If not found, consider it successfully deleted (or throw NotFoundError)
    // throw new NotFoundError(`Poster with ID ${posterId} not found.`);
    return; // Or return null/undefined
  }

  // Authorization check
  if (poster.creator.toString() !== requestingUserId) {
    throw new ForbiddenError("You are not authorized to delete this poster.");
  }

  // Delete the poster
  // No complex transaction needed as the User model doesn't store poster refs anymore
  await poster.remove(); // Or await Poster.findByIdAndDelete(posterId);
};

module.exports = {
  getPosterById,
  getPostersByUserId,
  createPoster,
  updatePosterById,
  deletePosterById,
};
