// src/components/Navigation/NavLinks.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Use the hook
import Button from "../components/Button/Button"; // Adjust path if needed
import styles from "./NavLinks.module.css";

const NavLinks = () => {
  const { isLoggedIn, userId, logout } = useAuth(); // Get auth state and functions

  return (
    <ul className={styles.navLinks}>
      <li>
        {/* Use NavLink for active styling */}
        <NavLink to="/" end>
          {" "}
          {/* 'end' prop for exact matching */}
          {/* Use function child for active class or style */}
          {({ isActive }) => (
            <Button variant={isActive ? "secondary" : "default"}>HOME</Button>
          )}
        </NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to={`/users/${userId}/posters`}>
            {({ isActive }) => (
              <Button variant={isActive ? "secondary" : "default"}>
                MY POSTERS
              </Button>
            )}
          </NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink to="/posters/new">
            {({ isActive }) => (
              <Button variant={isActive ? "secondary" : "default"}>
                ADD POSTER
              </Button>
            )}
          </NavLink>
        </li>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to="/auth">
            {({ isActive }) => (
              <Button variant={isActive ? "secondary" : "default"}>
                LOGIN
              </Button>
            )}
          </NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          {/* Logout is an action, not a link */}
          <Button onClick={logout} variant="inverse">
            LOGOUT
          </Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
