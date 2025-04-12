// src/features/posters/pages/UpdatePosterPage.js
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { useForm } from "../../../hooks/useForm";
import { useHttpClient } from "../../../hooks/useHttpClient";
import { useAuth } from "../../../hooks/useAuth";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Card from "../../../components/Card/Card";
import ErrorModal from "../../../components/Modal/ErrorModal";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";
import PosterFormFields from "../components/PosterFormFields"; // Reusable fields
import styles from "./UpdatePosterPage.module.css"; // Use dedicated CSS module

const UpdatePosterPage = () => {
  const { posterId } = useParams();
  const navigate = useNavigate();
  const { userId, token } = useAuth();
  const {
    isLoading: isLoadingPoster,
    error: loadError,
    sendRequest: sendLoadRequest,
    clearError: clearLoadError,
  } = useHttpClient();
  const {
    isLoading: isUpdatingPoster,
    error: updateError,
    sendRequest: sendUpdateRequest,
    clearError: clearUpdateError,
  } = useHttpClient();
  const [loadedPoster, setLoadedPoster] = useState(null);

  // Initialize form hook - initially empty, will be set by useEffect
  const { formState, inputHandler, setFormData } = useForm(
    {
      title: { value: "", isValid: false, isTouched: false },
      year: { value: "", isValid: false, isTouched: false },
      imageUrl: { value: "", isValid: false, isTouched: false },
      trailerUrl: { value: "", isValid: true, isTouched: false },
      description: { value: "", isValid: true, isTouched: false },
    },
    false
  );

  // Fetch the poster data when the component mounts or posterId changes
  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const responseData = await sendLoadRequest(
          `/posters/${posterId}`,
          "GET",
          null,
          {},
          false // Fetching a poster might be public
        );
        setLoadedPoster(responseData); // Backend returns poster data directly

        // Check if the current user is the creator before allowing edits
        if (responseData.creator !== userId) {
          // Handle unauthorized access attempt - redirect or show message
          console.error("User is not authorized to edit this poster.");
          navigate("/", { replace: true }); // Redirect home
          return; // Stop further processing
        }

        // Set form data once poster is loaded
        setFormData(
          {
            title: {
              value: responseData.title,
              isValid: true,
              isTouched: false,
            },
            year: { value: responseData.year, isValid: true, isTouched: false },
            imageUrl: {
              value: responseData.imageUrl,
              isValid: true,
              isTouched: false,
            },
            trailerUrl: {
              value: responseData.trailerUrl || "",
              isValid: true,
              isTouched: false,
            },
            description: {
              value: responseData.description || "",
              isValid: true,
              isTouched: false,
            },
          },
          true // Initial form validity (assuming loaded data is valid)
        );
      } catch (err) {
        // Error handled by hook
        console.error("Failed to fetch poster:", err);
        // If poster not found (404), loadError will be set
      }
    };
    fetchPoster();
  }, [posterId, sendLoadRequest, setFormData, userId, navigate]); // Add userId and navigate

  const posterUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    if (!formState.isOverallValid) {
      console.warn("Form is invalid, update blocked.");
      return;
    }

    try {
      await sendUpdateRequest(
        `/posters/${posterId}`,
        "PATCH",
        JSON.stringify({
          // Send only updated fields (or all if simpler)
          title: formState.inputs.title.value,
          year: Number(formState.inputs.year.value),
          imageUrl: formState.inputs.imageUrl.value,
          trailerUrl: formState.inputs.trailerUrl.value || null,
          description: formState.inputs.description.value || null,
        }),
        { "Content-Type": "application/json" },
        true // Requires auth token
      );
      // Navigate back to the user's posters list on success
      navigate(`/users/${userId}/posters`);
    } catch (err) {
      // Update error handled by hook
      console.error("Failed to update poster:", err);
    }
  };

  // Clear both load and update errors
  const clearAllErrors = () => {
    clearLoadError();
    clearUpdateError();
  };

  // Combined loading state
  const isLoading = isLoadingPoster || isUpdatingPoster;
  // Combined error state (prioritize update error if both exist)
  const error = updateError || loadError;

  // Display loading spinner while fetching
  if (isLoadingPoster && !loadError) {
    return (
      <div className="u-flex-center" style={{ marginTop: "5rem" }}>
        <LoadingSpinner />
      </div>
    );
  }

  // If loading failed (e.g., poster not found) or poster not loaded yet
  if (!loadedPoster && loadError) {
    // ErrorModal will be shown via the hook's error state
  }

  if (!loadedPoster && !loadError && !isLoadingPoster) {
    return (
      <div className="u-flex-center" style={{ marginTop: "5rem" }}>
        <Card>
          <h2>Could not find poster!</h2>
          <p>
            {loadError ||
              "The requested poster does not exist or could not be loaded."}
          </p>
          <Button to="/">Go Home</Button>
        </Card>
      </div>
    );
  }

  // Render form only when data is loaded and form state is initialized
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearAllErrors} />
      {/* Render form only if we have loaded data */}
      {loadedPoster && formState.inputs.title.value !== undefined && (
        <form
          className={styles.posterForm}
          onSubmit={posterUpdateSubmitHandler}
        >
          {isUpdatingPoster && <LoadingSpinner asOverlay />}
          <h2>Update Poster</h2>
          {/* Ensure PosterFormFields receives updated initial values */}
          <PosterFormFields formState={formState} inputHandler={inputHandler} />
          <p className={styles.requiredNote}>* fields are required</p>
          <div className={styles.formActions}>
            <Button
              type="submit"
              disabled={!formState.isOverallValid || isLoading}
            >
              Update Poster
            </Button>
            <Button
              type="button"
              variant="inverse"
              onClick={() => navigate(`/users/${userId}/posters`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePosterPage;
