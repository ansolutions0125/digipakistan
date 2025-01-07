import React from 'react';

const TickMarkAnimation = () => {
  return (
    <div className="checkmark-container">
      <svg
        className="checkmark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
      >
        <circle
          className="checkmark-circle"
          cx="26"
          cy="26"
          r="25"
          fill="none"
        />
        <path
          className="checkmark-check"
          fill="none"
          d="M14 27l7 7 16-16"
        />
      </svg>
    </div>
  );
};

export default TickMarkAnimation;