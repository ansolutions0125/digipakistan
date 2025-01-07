"use client";

import { useState, useEffect } from "react";

export default function LoadingWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show loader for 1 second

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Site content */}
      <div
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="animate-spin h-16 w-16 border-4 border-t-transparent border-primary rounded-full"></div>
        </div>
      )}
    </div>
  );
}
