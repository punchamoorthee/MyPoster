// src/features/users/components/UsersList.js
import React from "react";
import PropTypes from "prop-types";

import UsersListItem from "./UsersListItem";
import Card from "../../../components/Card/Card"; // Use Card component
import styles from "./UsersList.module.css";

const UsersList = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className={styles.noUsersFound}>
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className={styles.usersList}>
      {users.map((user) => (
        <UsersListItem
          key={user._id} // Use _id from backend
          id={user._id}
          username={user.username}
          posterCount={user.posters?.length || 0} // Use optional chaining and default value
        />
      ))}
    </ul>
  );
};

UsersList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      // posters array might not always be populated depending on backend query
      posters: PropTypes.arrayOf(PropTypes.any),
    })
  ),
};

export default UsersList;
