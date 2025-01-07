"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page404 = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the previous page after 3 seconds
    const timer = setTimeout(() => {
      router.back();
    }, 3000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="flex flex-col w-full justify-center gap-3 items-center">
        <h1 className="text-7xl text-center text-primary animate-pulse">
          404 Not Found
        </h1>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Page404;
