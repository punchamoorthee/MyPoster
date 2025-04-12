// src/features/users/components/UsersListItem.js
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Card from "../../../components/Card/Card"; // Use Card component
import styles from "./UsersListItem.module.css";

const UsersListItem = ({ id, username, posterCount }) => {
  return (
    <li className={styles.userItem}>
      <Card className={styles.userItemContent}>
        {/* Link wraps the entire content */}
        <Link to={`/users/${id}/posters`} className={styles.userItemLink}>
          <div className={styles.userItemImage}>
            {/* Placeholder for user avatar - replace with actual image if available */}
            <div className={styles.avatarPlaceholder}>
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className={styles.userItemInfo}>
            <h2>{username}</h2>
            <h3>
              {posterCount} {posterCount === 1 ? "Poster" : "Posters"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

UsersListItem.propTypes = {
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  posterCount: PropTypes.number.isRequired,
};

export default UsersListItem;
