// src/components/Input/Input.js
import React, { useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import { validate } from "../../utils/validators";
import styles from "./Input.module.css"; // Import CSS Module

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.payload.value,
        isValid: validate(action.payload.value, action.payload.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    case "RESET": // Added for potentially resetting the input
      return {
        value: action.payload.initialValue || "",
        isValid: action.payload.initialValidity || false,
        isTouched: false,
      };
    default:
      return state;
  }
};

const Input = React.memo((props) => {
  // Memoize for performance if needed
  const {
    id,
    label,
    element = "input", // Default to input
    type = "text",
    placeholder,
    rows = 3,
    errorText = "Invalid input.", // Default error message
    validators = [], // Default to empty array
    onInput, // Callback to parent form hook
    initialValue = "",
    initialValid = false,
    className, // Allow passing custom classes
    // Removed validity prop - managed internally
  } = props;

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initialValue,
    isValid: initialValid,
    isTouched: false,
  });

  const { value, isValid, isTouched } = inputState;

  // Effect to inform parent form hook about changes
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  // Effect to update internal state if initialValue prop changes externally (e.g., form reset, data loading)
  useEffect(() => {
    dispatch({
      type: "CHANGE",
      payload: { value: initialValue, validators: validators },
    });
    // Optionally reset touched state when initial value changes if desired
    // dispatch({ type: 'RESET', payload: { initialValue, initialValidity: initialValid }})
  }, [initialValue, initialValid, validators]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      payload: { value: event.target.value, validators: validators },
    });
  };

  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  const inputClasses = [
    styles["form-control"],
    !isValid && isTouched ? styles["form-control--invalid"] : "",
    className, // Allow external classes
  ]
    .join(" ")
    .trim();

  const inputElement =
    element === "input" ? (
      <input
        className={styles.input} // Specific class for input/textarea
        id={id}
        type={type}
        placeholder={placeholder}
        onChange={changeHandler}
        onBlur={touchHandler} // Dispatch touch on blur
        value={value}
      />
    ) : (
      <textarea
        className={styles.textarea} // Specific class for input/textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        onChange={changeHandler}
        onBlur={touchHandler} // Dispatch touch on blur
        value={value}
      />
    );

  return (
    <div className={inputClasses}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {inputElement}
      {!isValid && isTouched && (
        <p className={styles["error-text"]}>{errorText}</p>
      )}
    </div>
  );
}); // End of React.memo

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  element: PropTypes.oneOf(["input", "textarea"]),
  type: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  errorText: PropTypes.string,
  validators: PropTypes.array,
  onInput: PropTypes.func.isRequired,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialValid: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
