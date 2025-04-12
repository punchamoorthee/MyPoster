// src/components/Button/Button.js
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Button.module.css"; // Import CSS Module

const Button = (props) => {
  const {
    children,
    type = "button", // Default type
    onClick,
    disabled = false,
    href,
    to,
    exact,
    variant = "primary", // 'primary', 'secondary', 'danger', 'inverse' etc.
    size = "default", // 'default', 'small', 'large'
    className, // Allow passing custom classes
    ...rest // Pass other props like aria-label, etc.
  } = props;

  // Dynamically create class names using CSS Modules
  const classes = [
    styles.button,
    styles[`button--${variant}`], // e.g., styles['button--primary']
    styles[`button--size-${size}`], // e.g., styles['button--size-default']
    disabled ? styles["button--disabled"] : "",
    className,
  ]
    .join(" ")
    .trim();

  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} exact={exact} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  to: PropTypes.string,
  exact: PropTypes.bool,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "inverse",
    "default",
  ]), // Add more as needed
  size: PropTypes.oneOf(["small", "default", "large"]),
  className: PropTypes.string,
};

export default Button;
