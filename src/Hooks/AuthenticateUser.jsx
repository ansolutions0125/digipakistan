"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userHooks from "@/Hooks/userHooks";

const AuthenticateUser = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userData, loading: userLoading } = userHooks(); // Ensure we handle loading state from userHooks

  useEffect(() => {
    const validateUser = async () => {
      try {
        // Wait for user data to load
        if (userLoading) return;

        // If no user data, redirect to signin
        if (!userData || !userData.id) {
          router.push("/signin");
          return;
        }

        // If email is not verified, allow access to the current route
        setLoading(false);
      } catch (error) {
        console.error("Error validating user:", error);
        router.push("/signin");
      }
    };

    validateUser();
  }, [router, userData, userLoading]);

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-16 w-16 border-4 border-t-transparent border-primary rounded-full"></div>
      </div>
    );
  }

  return children;
};

export default AuthenticateUser;