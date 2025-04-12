// src/components/Modal/ErrorModal.js
import React, { useRef } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "../Button/Button";

const ErrorModal = ({ error, onClear }) => {
  const nodeRef = useRef(null); // Ref for CSSTransition
  if (!error) {
    return null; // Don't render if no error
  }

  return (
    <Modal
      nodeRef={nodeRef} // Pass ref to Modal
      show={!!error} // Show if error is truthy
      onCancel={onClear} // Close modal on backdrop click or cancel
      header="An Error Occurred!"
      footer={<Button onClick={onClear}>Okay</Button>}
    >
      <p>{error}</p>
    </Modal>
  );
};

ErrorModal.propTypes = {
  error: PropTypes.string, // The error message
  onClear: PropTypes.func.isRequired, // Function to clear the error and close modal
};

export default ErrorModal;
