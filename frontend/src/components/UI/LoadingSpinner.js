// src/components/UI/LoadingSpinner.js
import React from "react";
import PropTypes from "prop-types";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = ({ asOverlay }) => {
  return (
    <div className={`${asOverlay ? styles["loading-spinner__overlay"] : ""}`}>
      <div className={styles["lds-dual-ring"]}></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  asOverlay: PropTypes.bool, // If true, display as a full-page overlay
};

export default LoadingSpinner;
