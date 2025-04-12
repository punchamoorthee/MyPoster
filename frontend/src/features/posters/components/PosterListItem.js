// src/features/posters/components/PosterListItem.js
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

import { useAuth } from "../../../hooks/useAuth";
import { useHttpClient } from "../../../hooks/useHttpClient";
import Button from "../../../components/Button/Button";
import Card from "../../../components/Card/Card"; // Use Card as base
import ErrorModal from "../../../components/Modal/ErrorModal";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import TrailerModal from "../../../components/Modal/TrailerModal";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";
import styles from "./PosterListItem.module.css";

const PosterListItem = (props) => {
  const {
    id,
    imageUrl,
    title,
    year,
    description,
    trailerUrl,
    creatorId,
    onDelete,
  } = props;
  const { userId, token } = useAuth(); // Get current user ID and token
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openTrailerHandler = () => setShowTrailerModal(true);
  const closeTrailerHandler = () => setShowTrailerModal(false);

  const openConfirmHandler = () => setShowConfirmModal(true);
  const closeConfirmHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false); // Close modal immediately
    try {
      await sendRequest(
        `/posters/${id}`, // Endpoint only
        "DELETE",
        null,
        {}, // No extra headers needed
        true // Requires auth
      );
      onDelete(id); // Call parent handler to update UI state
    } catch (err) {
      // Error handled by hook/ErrorModal
      console.error("Failed to delete poster:", err);
    }
  };

  // Check if the logged-in user is the creator of this poster
  const isCreator = userId === creatorId;

  return (
    <React.Fragment>
      {/* Modals */}
      <ErrorModal error={error} onClear={clearError} />
      <TrailerModal
        show={showTrailerModal}
        onClose={closeTrailerHandler}
        title={title}
        year={year}
        imageUrl={imageUrl}
        trailerUrl={trailerUrl}
        description={description}
      />
      <ConfirmModal
        show={showConfirmModal}
        onClose={closeConfirmHandler}
        onConfirm={confirmDeleteHandler}
        title="Delete Poster?"
        message={`Are you sure you want to delete the poster "${title} (${year})"? This cannot be undone.`}
        imageUrl={imageUrl} // Show image in confirm modal
        danger // Use danger styling for confirm button
      />

      {/* List Item Content */}
      <li className={styles.posterItem}>
        <Card className={styles.posterItemContent}>
          {isLoading && <LoadingSpinner asOverlay />}{" "}
          {/* Show spinner during delete */}
          <div className={styles.posterItemImage}>
            {/* Consider adding lazy loading for images */}
            <img src={imageUrl} alt={`${title} Poster`} loading="lazy" />
          </div>
          <div className={styles.posterItemInfo}>
            <h2>{`${title} (${year})`}</h2>
            {description && <p>{description}</p>}
          </div>
          <div className={styles.posterItemActions}>
            <Button onClick={openTrailerHandler}>Watch Trailer</Button>
            {isCreator && (
              <Button to={`/posters/edit/${id}`} variant="inverse">
                Edit
              </Button>
            )}
            {isCreator && (
              <Button
                variant="danger"
                onClick={openConfirmHandler}
                disabled={isLoading}
              >
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

PosterListItem.propTypes = {
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  description: PropTypes.string,
  trailerUrl: PropTypes.string,
  creatorId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PosterListItem;
