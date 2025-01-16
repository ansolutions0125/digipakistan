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
import Link from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/stores/authStore";
import userHooks from "@/Hooks/userHooks";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

const VerifyEmailComponent = ({ mode, oobCode }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setEmailVerified } = useAuthStore();
  const router = useRouter();

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
      <div className="flex items-center justify-center p-3 lg:p-5">
        <div className="w-full min-h-[60vh] rounded-xl bg-white flex items-center justify-center flex-col border shadow-2xl text-center p-5 lg:w-[40%]">
        {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <p>
            Redirecting, Please Wait ................
          </p>
        </div>
      ) : isVerified ? (
           <div className="flex items-center justify-center">
             <IoCheckmarkCircle className="text-9xl text-primary" />
            <h1 className="lg:text-3xl text-2xl font-bold">
              Hi {userData?.firstName? `${userData?.firstName} ` :"User"}
            </h1>
       
          <p className="mt-2">
            Your Email has Verified, complete the further process for enrollment
            in DigiPakistan NATIONAL SKILLS DEVELOPMENT PROGRAM.{" "}
          </p>
          <p className="mt-2 text-xl">
            آپ کا ای میل تصدیق ہو چکا ہے، ڈیجی پاکستان نیشنل اسکلز ڈیولپمنٹ
            پروگرام میں اندراج کے لیے مزید عمل مکمل کریں۔{" "}
          </p>

          <div className="flex justify-center items-center mt-5 gap-2">
            {userData? <Link
              onClick={() => buttonLoad()}
              href={"/terms-conditions"}
              className="bg-primary hover:bg-second duration-150 text-sm rounded-md p-2 text-white"
            >
              {loading ? "Loading...." : " Continue"}
            </Link>
            :<Link
              onClick={() => buttonLoad()}
              href={"/signin"}
              className="bg-primary hover:bg-second duration-150 text-sm rounded-md p-2 text-white"
            >
              {loading ? "Loading...." : " Signin"}
            </Link>
            }
          </div>
           </div>
      ):(  <div>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-red-600">
            The verification link has expired.
          </h1>
          <p className="mt-2 text-gray-700 text-[14px]">
            {error ||
              "There was an issue verifying your email. The link might have expired or been used already."}
          </p>
        </div>
      </div>)
}

</div>
</div>
</div>

  );
};

export default VerifyEmailComponent;



