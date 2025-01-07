"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const StripeProtectedRoutes = ({ children }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only proceed if we're on the client
    if (typeof window !== "undefined") {
      setIsClient(true);

      const isPaymentInProgress = sessionStorage.getItem("paymentInProgress");

      if (
        isPaymentInProgress === "pending" ||
        isPaymentInProgress === "success" ||
        isPaymentInProgress === "failed"
      ) {
        // Redirect to the home page if a payment is in progress or completed
        router.replace("/");
      }
    }
  }, [router]);

  // Ensure we only render on the client side
  if (!isClient) return null;

  // Render the children if no redirect condition is met
  return <>{children}</>;
};

export default StripeProtectedRoutes;
