// components/UserProtectedRoutes.js
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import userHooks from "../Hooks/userHooks";
import useAuthStore from "@/stores/authStore";

const UserProtectedRoutes = ({
  children,
  userNotLogined,
  ifUserLoginedThen,
}) => {
  const { userData, loading } = userHooks();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (ifUserLoginedThen && userData) {
    router.push("/");
    return null;
  }

  // Render the children if conditions are met
  return children;
};

export default UserProtectedRoutes;
