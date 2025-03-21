import "./modal.css";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Modal = ({ open, onClose, children, position, className = "" }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); // Close the modal
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className={`modal ${className}`}
      style={{ top: position.top, left: position.left }}
    >
      <div className="modal-content" ref={modalRef}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
