// src/components/Navigation/MainHeader.js
import React from "react";
import PropTypes from "prop-types";
import styles from "./MainHeader.module.css";

const MainHeader = ({ children }) => {
  return <header className={styles.mainHeader}>{children}</header>;
};

MainHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainHeader;
