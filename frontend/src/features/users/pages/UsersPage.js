// src/features/users/pages/UsersPage.js
import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../../components/Modal/ErrorModal";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";
import { useHttpClient } from "../../../hooks/useHttpClient";
// import styles from './UsersPage.module.css'; // Add styles if needed

const UsersPage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState(null); // Start as null

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Backend should return { users: [...] } or adjust based on actual response
        const responseData = await sendRequest(
          "/users",
          "GET",
          null,
          {},
          false // Fetching users list might be public or need auth? Adjust as needed.
          // If needs auth, middleware on backend should handle it.
        );
        // Assuming backend sends { users: [...] }
        setLoadedUsers(responseData.users || responseData || []); // Handle different response structures
      } catch (err) {
        // Error is handled by the hook
        console.error("Failed to fetch users:", err);
        setLoadedUsers([]); // Set empty on error
      }
    };

    fetchUsers();
  }, [sendRequest]); // Dependency array includes the stable sendRequest function

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="u-flex-center" style={{ marginTop: "5rem" }}>
          <LoadingSpinner />
        </div>
      )}
      {/* Render UsersList only when not loading and users data is available */}
      {!isLoading && loadedUsers && <UsersList users={loadedUsers} />}
      {/* Handle case where loading finished but no users (e.g., network error) */}
      {!isLoading && !loadedUsers && !error && (
        <div className="u-flex-center" style={{ marginTop: "5rem" }}>
          <p>Could not load users.</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default UsersPage;
