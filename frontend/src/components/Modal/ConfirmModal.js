// src/components/Modal/ConfirmModal.js
import React, { useRef } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "../Button/Button";
import styles from "./ConfirmModal.module.css"; // Specific styles if needed

const ConfirmModal = (props) => {
  const {
    show,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = false,
  } = props;
  const nodeRef = useRef(null); // Ref for CSSTransition

  return (
    <Modal
      nodeRef={nodeRef} // Pass ref to Modal
      show={show}
      onCancel={onClose}
      header={title}
      footerClass={styles.confirmModalFooter}
      footer={
        <React.Fragment>
          <Button variant="inverse" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmText}
          </Button>
        </React.Fragment>
      }
    >
      <p>{message}</p>
      {/* Optional: Add image preview if needed */}
      {props.imageUrl && (
        <div className={styles.imagePreview}>
          <img src={props.imageUrl} alt="Preview" />
        </div>
      )}
    </Modal>
  );
};

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  danger: PropTypes.bool, // For styling the confirm button
  imageUrl: PropTypes.string, // Optional image URL for preview
};

export default ConfirmModal;
