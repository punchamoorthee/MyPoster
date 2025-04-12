// src/components/Modal/TrailerModal.js
import React, { useRef } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "../Button/Button";
import styles from "./TrailerModal.module.css";

// Basic check for YouTube embed URL format
const isValidEmbedUrl = (url) => {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.hostname === "www.youtube.com" &&
      parsedUrl.pathname.startsWith("/embed/")
    );
  } catch (e) {
    return false;
  }
};

const TrailerModal = (props) => {
  const { show, onClose, title, year, imageUrl, trailerUrl } = props;
  const nodeRef = useRef(null); // Ref for CSSTransition
  const hasValidTrailer = isValidEmbedUrl(trailerUrl);

  return (
    <Modal
      nodeRef={nodeRef} // Pass ref to Modal
      show={show}
      onCancel={onClose}
      header={`${title} (${year})`} // Combine title and year in header
      footer={<Button onClick={onClose}>Close</Button>}
      className={styles.trailerModal} // Apply specific styling class
    >
      <div className={styles.modalContent}>
        {imageUrl && (
          <div className={styles.posterContainer}>
            <img
              src={imageUrl}
              alt={`${title} Poster`}
              className={styles.posterImage}
            />
          </div>
        )}
        <div className={styles.trailerContainer}>
          {hasValidTrailer ? (
            <iframe
              src={trailerUrl}
              title={`${title} Trailer`}
              allowFullScreen
              className={styles.trailerIframe}
            ></iframe>
          ) : (
            <p className={styles.noTrailerText}>
              No trailer available or invalid embed link provided.
            </p>
          )}
        </div>
      </div>
      {props.description && (
        <p className={styles.description}>{props.description}</p>
      )}
    </Modal>
  );
};

TrailerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  imageUrl: PropTypes.string,
  trailerUrl: PropTypes.string,
  description: PropTypes.string, // Optional description
};

export default TrailerModal;
