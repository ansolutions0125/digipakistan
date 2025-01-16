"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "../../Backend/Firebase";
import { applyActionCode, checkActionCode, getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import useAuthStore from "@/stores/authStore";
import userHooks from "@/Hooks/userHooks";
import { IoCheckmarkCircle } from "react-icons/io5";

const VerifyEmailComponent = ({ mode, oobCode }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setEmailVerified } = useAuthStore();

  useEffect(() => {
    if (oobCode && mode === "verifyEmail") {
      verifyEmail(oobCode);
    }
  }, [oobCode, mode]);

  const { userData } = userHooks();

  const verifyEmail = async (oobCode) => {
    try {
      const authInstance = getAuth();

      // Fetch action code info to get the user's email
      const actionCodeInfo = await checkActionCode(authInstance, oobCode);
      const userEmail = actionCodeInfo?.data?.email;

      if (!userEmail) {
        throw new Error(
          "Unable to fetch email associated with this action code."
        );
      }

      // Apply the action code to verify the email
      await applyActionCode(authInstance, oobCode);

      // Mark the email as verified in Firebase Auth
      console.log("Email verified successfully.");
      setIsVerified(true);
      setEmailVerified(true);

      // Find the user document in Firestore using the email
      const usersRef = collection(firestore, "users");
      const userQuery = query(usersRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        throw new Error("No user found with the provided email in Firestore.");
      }

      // Update the user's `isEmailVerified` field in Firestore
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, { isEmailVerified: true });
      if (userDoc && oobCode && mode === "verifyEmail") {
        const sendEmail = async () => {
          // Prepare request body
          const requestBody = {
            fetchedUserData: userDoc.data(),
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
      console.log("User email verified status updated in Firestore.");
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
    <div className="bg-gray-50 min-h-[70vh]">
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          Redirecting, Please wait ............
        </div>
      ) : isVerified ? (
          <div className="flex items-center justify-center p-3 lg:p-5">
            <div className="w-full min-h-[60vh] rounded-xl bg-white flex items-center justify-center flex-col border shadow-2xl text-center p-5 lg:w-[40%]">
              <div className="border-2 border-white rounded-full p-3 bg-white">
                <IoCheckmarkCircle size={100} className="text-primary" />
              </div>
              <div className="text-2xl font-bold text-center flex flex-col gap-1">
                <h1> Email Verified Successfully!</h1>
                <p className="font-normal">Hi! Your email has been verified.</p>
              </div>
              {userData ? (
                <Link href="/registration">
                  <button className="border-primary hover:bg-second text-white bg-primary border rounded mt-4 px-6 py-2">
                    Proceed to Registration
                  </button>
                </Link>
              ) : (
                <Link href="/signin">
                  <button className="border-primary hover:bg-second bg-primary text-white border rounded mt-4 px-6 py-2">
                    Login Now
                  </button>
                </Link>
              )}
            </div>
          </div>
      
      ) : (
        <div className="flex items-center justify-center p-3 lg:p-5">
            <div className="w-full min-h-[60vh] rounded-xl bg-white flex items-center justify-center flex-col border shadow-2xl text-center p-5 lg:w-[40%]">
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
  );
};

export default VerifyEmailComponent;
