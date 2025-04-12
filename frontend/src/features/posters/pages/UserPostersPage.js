// src/features/posters/pages/UserPostersPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PosterList from '../components/PosterList';
import ErrorModal from '../../../components/Modal/ErrorModal';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { useHttpClient } from '../../../hooks/useHttpClient';
// import styles from './UserPostersPage.module.css'; // Add styles if needed

const UserPostersPage = () => {
  const [loadedPosters, setLoadedPosters] = useState(null); // Start as null
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { userId } = useParams(); // Get userId from URL param (ensure route matches)

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        // Use the correct API endpoint structure from backend routes
        const responseData = await sendRequest(
            `/posters/user/${userId}`,
            'GET',
            null,
            {},
            false // Fetching posters might be public
        );
        // Backend returns array directly now, or adjust based on actual response
        setLoadedPosters(responseData || []); // Handle null/undefined response
      } catch (err) {
        // Error is handled by the hook
        console.error("Failed to fetch user posters:", err);
        setLoadedPosters([]); // Set to empty array on error to avoid infinite loading state
      }
    };
    fetchPosters();
  }, [sendRequest, userId]); // Re-fetch if userId changes

  // Handler passed down to PosterListItem -> PosterList
  const posterDeletedHandler = (deletedPosterId) => {
    setLoadedPosters((prevPosters) =>
      prevPosters.filter((poster) => poster._id !== deletedPosterId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="u-flex-center" style={{marginTop: '5rem'}}>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPosters && (
        <PosterList
            posters={loadedPosters}
            onDeletePoster={posterDeletedHandler}
        />
      )}
       {/* Handle case where loading finished but no posters (e.g., network error) */}
      {!isLoading && !loadedPosters && !error && (
           <div className="u-flex-center" style={{marginTop: '5rem'}}>
               <p>Could not load posters.</p>
           </div>
       )}
    </React.Fragment>
  );
};

export default UserPostersPage;