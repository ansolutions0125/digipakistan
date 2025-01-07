"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Using new hook for query params in Next.js 15
import { auth } from "../../../Backend/Firebase";
import { applyActionCode } from "firebase/auth";
import Link from "next/link"; // To navigate to the registration page
import Image from "next/image";
import userHooks from "@/Hooks/userHooks";
import useAuthStore from "@/stores/authStore";
import { Router, useRouter } from "next/router";

const EmailVerified = () => {
  const { userData } = userHooks();
  const searchParams = useSearchParams(); // Extract query params
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setEmailVerified } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (oobCode && mode === "verifyEmail") {
      verifyEmail(oobCode);
    }

    


    // Check if userData is available before sending the email
    if (userData && userData.id && oobCode && mode === "verifyEmail") {
      const sendEmail = async () => {
        // Prepare request body
        const requestBody = {
          fetchedUserData: userData,
          email_subject: "You're Almost There! Complete Your Admission Now",
        };

        try {
          const response = await fetch(
            "/api/emails/direct-emails/after-verification-sendmail",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody), // Convert to JSON string
            }
          );

          const responseData = await response.json();
          console.log("Backend Response:", responseData);
        } catch (error) {
          console.error("Error sending email:", error);
        }
      };

      sendEmail();
    }
  }, [oobCode, mode, userData]);

  // Function to verify the email using the 'oobCode'
  const verifyEmail = async (oobCode) => {
    try {
      await applyActionCode(auth, oobCode);
      setIsVerified(true);
      setEmailVerified(true);
    } catch (err) {
      console.error("Error verifying email:", err);
      setEmailVerified(false);
      setError(
        "There was an error verifying your email. Please check the link or try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div
        className={`transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />
      <div className="flex items-center justify-center h-screen ">
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="animate-spin h-16 w-16 border-4 border-t-transparent border-primary rounded-full"></div>
          </div>
        ) : isVerified ? (
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col h-screen justify-center items-center gap-5">
              <div className="border-2 border-white rounded-full p-3 bg-white">
                <Image
                  src={"/email-verify.gif"}
                  width={100}
                  height={100}
                  alt="email-verified"
                />
              </div>
              <div className="text-2xl font-bold text-center flex flex-col gap-1">
                <h1>Email Verified Successfully!</h1>
                <p>Your email has been verified.</p>
              </div>
              <Link href="/registration">
                <button className="border-primary border rounded mt-4 px-6 py-2">
                  Procced to Registration
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold text-red-600">
                The verification link has expired.
              </h1>
              <p className="mt-2 text-gray-700 text-[14px]">
                {error ||
                  "There was an issue verifying your email. The link might have expired or been used already."}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EmailVerified;
