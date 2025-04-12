// src/components/Modal/Backdrop.js
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styles from "./Backdrop.module.css";

const Backdrop = ({ onClick }) => {
  const content = <div className={styles.backdrop} onClick={onClick}></div>;

  // Ensure the target element exists
  const targetElement = document.getElementById("backdrop-hook");
  if (!targetElement) {
    console.error(
      "Backdrop target element 'backdrop-hook' not found in the DOM."
    );
    return null; // Don't render if target is missing
  }

  return ReactDOM.createPortal(content, targetElement);
};

Backdrop.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Backdrop;
