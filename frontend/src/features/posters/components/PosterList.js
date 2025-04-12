// src/features/posters/components/PosterList.js
import React from "react";
import PropTypes from "prop-types";

import PosterListItem from "./PosterListItem";
import Card from "../../../components/Card/Card"; // Use Card for the "No posters" message
import Button from "../../../components/Button/Button"; // Use Button component
import styles from "./PosterList.module.css";

const PosterList = ({ posters, onDeletePoster }) => {
  if (!posters || posters.length === 0) {
    return (
      <div className={styles.noPostersFound}>
        <Card className={styles.noPostersCard}>
          <h2>No posters found.</h2>
          <p>Maybe create one?</p>
          <Button to="/posters/new">Share Poster</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className={styles.posterList}>
      {posters.map((poster) => (
        <PosterListItem
          key={poster._id}
          id={poster._id}
          imageUrl={poster.imageUrl}
          title={poster.title}
          year={poster.year}
          description={poster.description}
          trailerUrl={poster.trailerUrl}
          creatorId={poster.creator} // Pass creatorId for comparison
          onDelete={onDeletePoster} // Pass down the delete handler
        />
      ))}
    </ul>
  );
};

PosterList.propTypes = {
  posters: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      description: PropTypes.string,
      trailerUrl: PropTypes.string,
      creator: PropTypes.string.isRequired,
    })
  ),
  onDeletePoster: PropTypes.func.isRequired,
};

export default PosterList;
