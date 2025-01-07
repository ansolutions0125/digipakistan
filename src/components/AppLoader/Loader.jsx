"use client";
import React, { useEffect, useState } from "react";

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading process (e.g., fetching data)
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Example: Hide loader after 2 seconds
  }, []);

  return (
    <div
      className={`${
        isLoading ? "opacity-100" : "opacity-0"
      } transition-opacity duration-1000 bg-white w-full h-screen flex items-center justify-center`}
    >
      <div className="loadingspinner">
        <div id="square1"></div>
        <div id="square2"></div>
        <div id="square3"></div>
        <div id="square4"></div>
        <div id="square5"></div>
      </div>
    </div>
  );
};

export default Loader;
