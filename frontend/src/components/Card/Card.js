// src/components/Card/Card.js
import React from "react";
import PropTypes from "prop-types";
import styles from "./Card.module.css";

/**
 * A simple card component for wrapping content with padding and styling.
 */
const Card = ({ className, style, children }) => {
  const classes = [styles.card, className].join(" ").trim();

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Card;
