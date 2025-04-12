// src/features/auth/pages/AuthPage.js
import React, { useState } from "react";
// Removed useNavigate as login now handles navigation via context/App.js potentially
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../utils/validators"; // Correct path
import { useForm } from "../../../hooks/useForm"; // Correct path
import { useHttpClient } from "../../../hooks/useHttpClient"; // Correct path
import { useAuth } from "../../../hooks/useAuth"; // Correct path
import Input from "../../../components/Input/Input"; // Correct path
import Button from "../../../components/Button/Button"; // Correct path
import ErrorModal from "../../../components/Modal/ErrorModal"; // Correct path
import LoadingSpinner from "../../../components/UI/LoadingSpinner"; // Correct path
import Card from "../../../components/Card/Card"; // Use Card component
import styles from "./AuthPage.module.css";

const AuthPage = () => {
  const { login } = useAuth(); // Get login function from context hook
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const { formState, inputHandler, setFormData, resetForm } = useForm(
    {
      // Initial state structure
      email: { value: "", isValid: false, isTouched: false },
      password: { value: "", isValid: false, isTouched: false },
      // username is added/removed dynamically
    },
    false // Initial form validity
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      // Switching to Login: Remove username input state
      const currentInputs = { ...formState.inputs };
      delete currentInputs.username; // Remove username field
      setFormData(
        currentInputs,
        // Check validity based only on remaining fields
        formState.inputs.email?.isValid && formState.inputs.password?.isValid
      );
    } else {
      // Switching to Signup: Add username input state
      setFormData(
        {
          ...formState.inputs,
          username: { value: "", isValid: false, isTouched: false }, // Add username field
        },
        false // Signup form is initially invalid
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (!formState.isOverallValid) {
      console.warn("Form is invalid.");
      // Consider touching all fields to show errors visually
      return;
    }

    try {
      let responseData;
      if (isLoginMode) {
        responseData = await sendRequest(
          "/users/login",
          "POST",
          {
            // Body as object, hook handles stringify
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          },
          {}, // No custom headers needed
          false // Login doesn't require auth token
        );
        // Extract user ID and token from the nested structure
        const userId = responseData.user?._id || responseData.userId;
        const token = responseData.token;
        if (!userId || !token)
          throw new Error(
            "Login failed: Missing user ID or token in response."
          );
        login(userId, token); // Call context login on success
      } else {
        // Signup mode
        responseData = await sendRequest(
          "/users/signup",
          "POST",
          {
            username: formState.inputs.username.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          },
          {},
          false // Signup doesn't require auth token
        );
        // After successful signup, log the user in automatically
        const userId = responseData.user?._id || responseData.userId;
        const token = responseData.token;
        if (!userId || !token)
          throw new Error(
            "Signup failed: Missing user ID or token in response."
          );
        login(userId, token); // Login after signup

        // Optionally reset form after signup: resetForm();
        // Navigation happens automatically via AuthProvider/App.js state change
      }
    } catch (err) {
      // Error handled by useHttpClient hook and displayed by ErrorModal
      console.error("Authentication failed:", err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className={styles.authentication}>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? "Login Required" : "Create Account"}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="username"
              type="text"
              label="Username"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a username."
              onInput={inputHandler}
              // Provide initial values if needed, though managed by switchModeHandler
              initialValue={formState.inputs.username?.value || ""}
              initialValid={formState.inputs.username?.isValid || false}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
            initialValue={formState.inputs.email.value}
            initialValid={formState.inputs.email.isValid}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(8)]} // Enforce 8 characters from model
            errorText="Password must be at least 8 characters long."
            onInput={inputHandler}
            initialValue={formState.inputs.password.value}
            initialValid={formState.inputs.password.isValid}
          />
          <Button
            type="submit"
            disabled={!formState.isOverallValid || isLoading}
          >
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button
          variant="inverse"
          onClick={switchModeHandler}
          disabled={isLoading}
        >
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default AuthPage;
