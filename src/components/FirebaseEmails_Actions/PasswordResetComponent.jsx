"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth, firestore } from "../../Backend/Firebase"; // Adjust the path as needed
import Link from "next/link";
import Image from "next/image";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const PasswordResetComponent = ({ mode, actionCode }) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (actionCode && mode === "resetPassword") {
      setLoading(false);
    }
  }, [actionCode, mode]);

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    setMessage("");

    if (!actionCode) {
      setError(
        "Error: No reset code found. Please check the link or request a new one."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      // Verify the reset code
      const email = await verifyPasswordResetCode(auth, actionCode);
      console.log("Email associated with reset code:", email);

      // Confirm password reset
      await confirmPasswordReset(auth, actionCode, password);

      // Fetch user and registration data from Firestore
      const usersQuery = query(
        collection(firestore, "users"),
        where("email", "==", email)
      );
      const usersSnapshot = await getDocs(usersQuery);

      const regFormQuery = query(
        collection(firestore, "registration_form_data"),
        where("email", "==", email)
      );
      const regFormSnapshot = await getDocs(regFormQuery);

      // Update Firestore documents
      const userUpdatePromises = usersSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const currentPortalDetails = data.portalDetails || {};

        return updateDoc(doc.ref, {
          password,
          portalDetails: {
            ...currentPortalDetails,
            lms_password: password,
          },
        });
      });

      const regFormUpdatePromises = regFormSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const currentPortalDetails = data.portalDetails || {};

        return updateDoc(doc.ref, {
          password,
          portalDetails: {
            ...currentPortalDetails,
            lms_password: password,
          },
        });
      });

      // Make API requests
      const apiPromises = regFormSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const user_id = data.portalDetails?.id;

        if (!user_id) {
          console.error("user_id is missing in registration_form_data");
          return;
        }
        fetch("/api/updateuserpassword-from-resetpassword-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, user_id }),
        });
      });

      // Wait for all updates to complete
      await Promise.all([
        ...userUpdatePromises,
        ...regFormUpdatePromises,
        ...apiPromises,
      ]);

      setMessage("Your password has been reset successfully.");
      setIsReset(true);

      // Redirect to signin
      setTimeout(() => router.push("/signin"), 3000);
    } catch (err) {
      console.error("Error resetting password:", err);

      if (err.code === "auth/invalid-action-code") {
        setError(
          "The reset link is invalid or expired. Please request a new one."
        );
      } else {
        setError(
          err.message ||
            "There was an error resetting your password. Please check the link or try again."
        );
      }

      setIsReset(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        {loading ? (
          <>
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
              <div className="animate-spin h-16 w-16 border-4 border-t-transparent border-primary rounded-full"></div>
            </div>
          </>
        ) : isReset ? (
          <div className="flex flex-col h-screen justify-center items-center gap-5">
            <div className="border-2 border-white rounded-full p-3 bg-white">
              <Image
                src={"/pass_reset.gif"}
                width={200}
                height={200}
                alt="password-reset-success"
              />
            </div>
            <div className="text-2xl font-bold text-center">
              <h1>Password Reset Successfully!</h1>
              <Link href="/signin">
                <button className="mt-4 px-6 py-2 border rounded text-lg font-bold">
                  Go to Login
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center h-screen">
            <div className="w-1/2 border-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-6">
                Reset Your Password
              </h2>
              <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                  <label className="block text-gray-700">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:primary"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary/50"
                >
                  Reset Password
                </button>
              </form>
              {message && (
                <p className="mt-4 text-center text-green-500 font-medium">
                  {message}
                </p>
              )}
              {error && (
                <p className="mt-4 text-center text-red-500 font-medium">
                  {error}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PasswordResetComponent;
