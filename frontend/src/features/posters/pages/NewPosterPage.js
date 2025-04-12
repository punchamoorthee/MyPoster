// src/features/posters/pages/NewPosterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { useForm } from "../../../hooks/useForm";
import { useHttpClient } from "../../../hooks/useHttpClient";
import { useAuth } from "../../../hooks/useAuth"; // Use the hook
import Input from "../../../components/Input/Input"; // Correct path
import Button from "../../../components/Button/Button"; // Correct path
import ErrorModal from "../../../components/Modal/ErrorModal"; // Correct path
import LoadingSpinner from "../../../components/UI/LoadingSpinner"; // Create this component
import PosterFormFields from "../components/PosterFormFields"; // Reusable fields
import styles from "./NewPosterPage.module.css";

// Initial form state structure expected by useForm
const initialFormState = {
  title: { value: "", isValid: false, isTouched: false },
  year: { value: "", isValid: false, isTouched: false },
  imageUrl: { value: "", isValid: false, isTouched: false },
  trailerUrl: { value: "", isValid: true, isTouched: false }, // Optional field starts valid if empty
  description: { value: "", isValid: true, isTouched: false }, // Optional field starts valid if empty
};

const NewPosterPage = () => {
  const { userId, token } = useAuth(); // Get auth details via hook
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { formState, inputHandler, setFormData, touchHandler } = useForm(
    initialFormState,
    false
  ); // Pass initial state
  const navigate = useNavigate();

  const posterSubmitHandler = async (event) => {
    event.preventDefault();
    if (!formState.isOverallValid) {
      console.warn("Form is invalid, submission blocked."); // Or show user feedback
      // Optionally touch all fields here to show errors
      return;
    }

    try {
      await sendRequest(
        "/posters", // Endpoint only
        "POST",
        JSON.stringify({
          // userId is not needed in body, backend gets it from token
          title: formState.inputs.title.value,
          year: Number(formState.inputs.year.value), // Convert year to number on submit
          imageUrl: formState.inputs.imageUrl.value,
          trailerUrl: formState.inputs.trailerUrl.value || null, // Send null if empty
          description: formState.inputs.description.value || null, // Send null if empty
        }),
        { "Content-Type": "application/json" }, // Headers passed via hook
        true // Requires Authentication
      );
      navigate(`/${userId}/posters`); // Navigate to user's posters page
    } catch (err) {
      // Error is handled by useHttpClient, displayed by ErrorModal
      console.error("Failed to add poster:", err);
    }
  };

  // Add autofill logic here if needed, using setFormData

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* Maybe add a wrapper Card component here for consistent styling */}
      <form className={styles.posterForm} onSubmit={posterSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Add New Poster</h2>
        <PosterFormFields // Use the reusable component
          formState={formState}
          inputHandler={inputHandler}
          // touchHandler={touchHandler} // Pass if needed by form fields
        />
        <p className={styles.requiredNote}>* fields are required</p>
        <div className={styles.formActions}>
          <Button
            type="submit"
            disabled={!formState.isOverallValid || isLoading}
          >
            Add Poster
          </Button>
          {/* Add Autofill button logic if required */}
          {/* <Button type="button" onClick={autofillHandler} disabled={isLoading} variant="secondary">
                Autofill
            </Button> */}
        </div>
      </form>
    </React.Fragment>
  );
};

export default NewPosterPage;
