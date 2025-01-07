"use client"
import React, { useEffect } from "react";
import { IoIosClose } from "react-icons/io";

const CustomToast = ({ message, type = "info", duration = 5000, onClose }) => {
  useEffect(() => {
    // Set a timeout based on the duration prop
    const timer = setTimeout(() => {
      onClose(); // Close the toast after the specified duration
    }, duration);

    return () => clearTimeout(timer); // Clear the timer on component unmount or onClose
  }, [message, duration, onClose]); // Dependency array includes only relevant dependencies

  return (
    <div className={`custom-toast custom-toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="custom-toast-close">
      <IoIosClose />
      </button>
    </div>
  );
};

export default CustomToast;
