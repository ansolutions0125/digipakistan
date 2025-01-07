// components/ProtectedRoute.js
"use client"; // Ensure client-side rendering

import React from "react";
import { useRouter } from "next/navigation";
import useAdmin from "../Hooks/adminHooks";

const AdminProtectedRoutes = ({ children, isLoginPage }) => {
  const { adminData, loading } = useAdmin();
  const router = useRouter();

  if (loading) {
    // Render a loading state while checking authentication
    return <div>Loading...</div>;
  }

  if (isLoginPage && adminData) {
    // Redirect to the admin dashboard if already logged in
    router.push("/admin/dashboard");
    return null; // Render nothing while redirecting
  }

  if (!adminData && !isLoginPage) {
    // Redirect to login page if no admin data is found
    router.push("/admin/login");
    return null; // Render nothing while redirecting
  }

  // Render children if admin is logged in and not on login page
  return <>{children}</>;
};

export default AdminProtectedRoutes;
