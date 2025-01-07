import React from "react";

const CircelLoading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="animate-spin h-16 w-16 border-4 border-t-transparent border-primary rounded-full"></div>
    </div>
  );
};

export default CircelLoading;
