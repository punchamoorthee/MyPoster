// controllers/poster.controller.js
const posterService = require("../services/poster.service");
const { createSuccessResponse } = require("../utils/apiResponse");
const httpStatusCodes = require("../constants/httpStatusCodes");

const getPosterByPosterId = async (req, res) => {
  const posterId = req.params.posterId;
  const poster = await posterService.getPosterById(posterId); // Service handles NotFoundError
  const response = createSuccessResponse(
    httpStatusCodes.OK,
    "Poster retrieved successfully",
    poster
  );
  res.status(response.statusCode).json(response.body);
};

const getPostersByUserId = async (req, res) => {
  const userId = req.params.userId;
  const posters = await posterService.getPostersByUserId(userId);
  const response = createSuccessResponse(
    httpStatusCodes.OK,
    "Posters retrieved successfully",
    posters
  );
  res.status(response.statusCode).json(response.body);
};

const postPoster = async (req, res) => {
  // Get the authenticated user's ID from the request object (added by middleware)
  const userId = req.user.id;
  const newPoster = await posterService.createPoster(req.body, userId);
  const response = createSuccessResponse(
    httpStatusCodes.CREATED,
    "Poster created successfully",
    newPoster
  );
  res.status(response.statusCode).json(response.body);
};

const patchPosterById = async (req, res) => {
  const posterId = req.params.posterId;
  const userId = req.user.id; // Get ID of user making the request
  const updatedPoster = await posterService.updatePosterById(
    posterId,
    req.body,
    userId
  ); // Service handles NotFoundError and ForbiddenError
  const response = createSuccessResponse(
    httpStatusCodes.OK,
    "Poster updated successfully",
    updatedPoster
  );
  res.status(response.statusCode).json(response.body);
};

const deletePosterById = async (req, res) => {
  const posterId = req.params.posterId;
  const userId = req.user.id; // Get ID of user making the request
  await posterService.deletePosterById(posterId, userId); // Service handles NotFoundError and ForbiddenError
  // No Content response for successful deletion
  res.status(httpStatusCodes.NO_CONTENT).send();
};

module.exports = {
  getPosterByPosterId,
  getPostersByUserId,
  postPoster,
  patchPosterById,
  deletePosterById,
};