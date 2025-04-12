// src/components/Navigation/MainNavigation.js
import React from "react";
import { Link } from "react-router-dom";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import styles from "./MainNavigation.module.css";

const MainNavigation = () => {
  return (
    <MainHeader>
      {/* Consider adding a Drawer for mobile navigation */}
      {/* <button className={styles.menuButton}>...</button> */}

      <h1 className={styles.mainNavigationTitle}>
        <Link to="/">POSTERATI</Link>
      </h1>
      <nav className={styles.mainNavigationLinks}>
        <NavLinks />
      </nav>
    </MainHeader>
  );
};

export default MainNavigation;
