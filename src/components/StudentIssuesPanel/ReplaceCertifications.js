"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);

  // Detect clicks outside the modal
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-lg relative w-1/2 h-[500px]"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-xl font-bold text-gray-600"
          >
            &times;
          </button>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
