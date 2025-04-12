// src/components/Modal/Modal.js
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import styles from "./Modal.module.css";

const ModalOverlay = (props) => {
  const { className, style, header, onSubmit, children, footer, footerClass } =
    props;

  const content = (
    <div className={`${styles.modal} ${className || ""}`} style={style}>
      {header && (
        <header className={`${styles["modal__header"]}`}>
          <h2>{header}</h2>
        </header>
      )}
      {/* Form wrapper allows submitting modal content */}
      <form
        onSubmit={
          onSubmit ? onSubmit : (event) => event.preventDefault() // Prevent default if no submit handler
        }
      >
        <div className={`${styles["modal__content"]}`}>{children}</div>
        {footer && (
          <footer className={`${styles["modal__footer"]} ${footerClass || ""}`}>
            {footer}
          </footer>
        )}
      </form>
    </div>
  );

  // Ensure the target element exists
  const targetElement = document.getElementById("modal-hook");
  if (!targetElement) {
    console.error("Modal target element 'modal-hook' not found in the DOM.");
    return null; // Don't render if target is missing
  }

  return ReactDOM.createPortal(content, targetElement);
};

const Modal = (props) => {
  const { show, onCancel, nodeRef } = props; // nodeRef for CSSTransition

  return (
    <React.Fragment>
      {show && <Backdrop onClick={onCancel} />}
      <CSSTransition
        nodeRef={nodeRef} // Pass nodeRef here
        in={show}
        mountOnEnter
        unmountOnExit
        timeout={200} // Match transition duration
        classNames={{
          // Use object format for clarity
          enter: styles["modal-enter"],
          enterActive: styles["modal-enter-active"],
          exit: styles["modal-exit"],
          exitActive: styles["modal-exit-active"],
        }}
      >
        {/* Pass all props down to ModalOverlay */}
        {/* Forward the ref to ModalOverlay if CSSTransition needs direct DOM access */}
        {/* Using nodeRef is the preferred way for React 18+ */}
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

// Add PropTypes for Modal and ModalOverlay
Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  nodeRef: PropTypes.object, // Ref for CSSTransition
  // Other props passed to ModalOverlay
  className: PropTypes.string,
  style: PropTypes.object,
  header: PropTypes.string,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
  footer: PropTypes.node,
  footerClass: PropTypes.string,
};

ModalOverlay.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  header: PropTypes.string,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
  footer: PropTypes.node,
  footerClass: PropTypes.string,
};

export default Modal;
