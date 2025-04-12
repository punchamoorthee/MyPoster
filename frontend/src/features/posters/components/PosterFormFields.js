// src/features/posters/components/PosterFormFields.js
// Component containing the actual Input fields for reuse in New/Update forms
import React from "react";
import PropTypes from "prop-types";
import Input from "../../../components/Input/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_URL, // Add URL validator if needed
  VALIDATOR_NUMBER, // Add number validator
} from "../../../utils/validators";

const PosterFormFields = ({ formState, inputHandler }) => {
  return (
    <React.Fragment>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title*"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="year"
        element="input"
        type="number"
        label="Year*"
        validators={[
          VALIDATOR_REQUIRE(),
          VALIDATOR_MINLENGTH(4),
          VALIDATOR_MAXLENGTH(4),
          VALIDATOR_NUMBER(), // Add explicit number validation
        ]}
        errorText="Please enter a valid 4-digit year."
        onInput={inputHandler}
        initialValue={formState.inputs.year.value}
        initialValid={formState.inputs.year.isValid}
      />
      <Input
        id="imageUrl"
        element="input"
        type="url" // Use type="url" for better semantics/mobile keyboards
        label="Poster Image URL*"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_URL()]} // Use URL validator
        errorText="Please enter a valid image URL."
        placeholder="https://example.com/image.jpg"
        onInput={inputHandler}
        initialValue={formState.inputs.imageUrl.value}
        initialValid={formState.inputs.imageUrl.isValid}
      />
      <Input
        id="trailerUrl"
        element="input"
        type="url"
        label="Trailer Embed URL (Optional)"
        validators={[VALIDATOR_URL(true)]} // Optional URL validation
        errorText="Please enter a valid YouTube embed URL (or leave blank)."
        placeholder="https://www.youtube.com/embed/..."
        onInput={inputHandler}
        initialValue={formState.inputs.trailerUrl.value}
        initialValid={formState.inputs.trailerUrl.isValid} // Should be true if optional/empty
      />
      <Input
        id="description"
        element="textarea"
        label="Description (Optional)"
        validators={[]} // Add validators if needed (e.g., max length)
        errorText="Description is too long."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid} // Should be true if optional/empty
      />
    </React.Fragment>
  );
};

PosterFormFields.propTypes = {
  formState: PropTypes.object.isRequired,
  inputHandler: PropTypes.func.isRequired,
};

export default PosterFormFields;
