// src/hooks/useForm.js
import { useCallback, useReducer } from "react";

// Action Types
const INPUT_CHANGE = "INPUT_CHANGE";
const SET_FORM_DATA = "SET_FORM_DATA";
const TOUCH_INPUT = "TOUCH_INPUT";
const RESET_FORM = "RESET_FORM"; // Action to reset the form

const formReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE: {
      const updatedInputs = {
        ...state.inputs,
        [action.inputId]: {
          ...state.inputs[action.inputId],
          value: action.value,
          isValid: action.isValid,
          isTouched: state.inputs[action.inputId]?.isTouched || false, // Preserve touched state
        },
      };

      let formIsValid = true;
      for (const inputId in updatedInputs) {
        if (updatedInputs[inputId]) {
          formIsValid = formIsValid && updatedInputs[inputId].isValid;
        }
      }

      return {
        ...state,
        inputs: updatedInputs,
        isOverallValid: formIsValid,
      };
    }
    case SET_FORM_DATA: {
      // Ensure all inputs have value, isValid, and isTouched properties
      const formattedInputs = {};
      for (const inputId in action.inputs) {
        formattedInputs[inputId] = {
          value: action.inputs[inputId]?.value ?? "", // Use nullish coalescing
          isValid: action.inputs[inputId]?.isValid ?? false,
          isTouched: action.inputs[inputId]?.isTouched ?? true, // Assume touched when setting data
        };
      }
      return {
        inputs: formattedInputs,
        isOverallValid: action.formIsValid,
      };
    }
    case TOUCH_INPUT:
      // Only update if the input exists
      if (!state.inputs[action.inputId]) return state;
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            ...state.inputs[action.inputId],
            isTouched: true,
          },
        },
      };
    case RESET_FORM:
      // Reset each input to its initial state defined in initialInputs
      const resetInputs = {};
      for (const inputId in action.initialInputs) {
        resetInputs[inputId] = { ...action.initialInputs[inputId] }; // Create new object
      }
      return {
        inputs: resetInputs,
        isOverallValid: action.initialValidity,
      };
    default:
      return state;
  }
};

/**
 * Custom hook for managing form state including input values, validity, and overall form validity.
 * @param {object} initialInputs - Initial state for each input field. Structure: { inputId: { value: any, isValid: boolean, isTouched: boolean } }
 * @param {boolean} initialFormValidity - The initial validity state of the overall form.
 */
export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isOverallValid: initialFormValidity,
  });

  // Memoized handler for input changes from Input components
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: INPUT_CHANGE,
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []); // dispatch is stable and doesn't need to be in deps

  // Memoized handler for marking an input as touched
  const touchHandler = useCallback((id) => {
    dispatch({
      type: TOUCH_INPUT,
      inputId: id,
    });
  }, []);

  // Memoized function to manually set the entire form's data (e.g., when loading data)
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: SET_FORM_DATA,
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  // Memoized function to reset the form to its initial state
  const resetForm = useCallback(() => {
    dispatch({
      type: RESET_FORM,
      initialInputs: initialInputs,
      initialValidity: initialFormValidity,
    });
  }, [initialInputs, initialFormValidity]); // Depends on initial values

  return { formState, inputHandler, setFormData, touchHandler, resetForm };
};
