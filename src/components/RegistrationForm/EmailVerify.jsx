"use client";
import { auth, firestore } from "@/Backend/Firebase";
import userHooks from "@/Hooks/userHooks";
import { sendEmailVerification, onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CustomToast from "../CoustomToast/CoustomToast";

const EmailVerify = () => {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        message: "",
        type: "",
        visible: false,
        duration: 5000,
    });
    const [isVerificationDisabled, setIsVerificationDisabled] = useState(false); // Track if verification is disabled

    const { userData } = userHooks(); // Get user data from custom hook
    const router = useRouter();
    const showToast = (message, type = "info", duration = 20000) => {
        setToast({ message, type, visible: true, duration });
    };

    const handleCloseToast = () => {
        setToast({ ...toast, visible: false });
    };

    useEffect(()=>{
        const auth = getAuth();
        const user = auth.currentUser;
        if(user?.emailVerified){
            router.push("/registration/emailverified")
        }
    },[]);

    // Listen for email verification status change using onAuthStateChanged
    useEffect(() => {
      
      const refreshVerificationStatus = async () => {
          const user = auth.currentUser; // Get current user
          if (user && user.emailVerified) {
              if (userData?.id) {
                  const userRef = doc(firestore, "users", userData.id);
                  await updateDoc(userRef, { isEmailVerified: true });
                  showToast("Your email has been verified successfully.", "success", 2000);
                  router.push("/registration/emailverified");
              }
          }
      };

      refreshVerificationStatus();

      // Set an interval to refresh the status every 1 minute
      const interval = setInterval(refreshVerificationStatus, 1000); 

      // Cleanup the interval on unmount
      return () => clearInterval(interval);
  }, []);

    const buttonLoad = async () => {
        if (isVerificationDisabled) return; // Prevent multiple requests

        setLoading(true);
        setIsVerificationDisabled(true); // Disable verification button

        try {
            const currentUser = auth.currentUser; 

            if (!currentUser) {
                showToast("User is not authenticated.", "error");
                return;
            }
            await sendEmailVerification(currentUser);
            showToast(
                "An email has been sent to your email, please verify your email by clicking the URL provided.",
                "success",
                20000
            );
        } catch (error) {
            console.log(error);
            if (error.code === 'auth/too-many-requests') {
                showToast("You are sending requests too quickly. Please try again later.", "error", 20000);
            } else {
                showToast(error.message, "error", 20000);
            }
        } finally {
            setLoading(false);
            setTimeout(() => {
                setIsVerificationDisabled(false); // Re-enable after a delay (e.g., 5 minutes)
            }, 100000); 
        }
    };

    if (!userData) return null;

    return (
        <div className="apply_now_bg min-h-[70vh]">
            <div className="flex items-center justify-center p-3 lg:p-5">
                <div className="w-full min-h-[60vh] rounded-xl bg-white flex flex-col border shadow-2xl text-center p-5 lg:w-[90%]">
                    <img className="w-40 mx-auto" src="/email.gif" alt="Email Verification" />
                    <h1 className="lg:text-3xl text-2xl font-bold">
                        Hi {userData.firstName} {userData.lastName}
                    </h1>
                    <p className="mt-2">
                        First verify your email{" "}
                        <span className="text-red-500">{userData.email}</span> account as all communication will be done via email.
                    </p>

                    <div className="flex justify-center items-center mt-5 gap-2">
                        <p>To verify Email</p>
                        <button
                            onClick={buttonLoad}
                            className="bg-primary hover:bg-second duration-150 text-sm rounded-md p-2 text-white"
                            disabled={isVerificationDisabled} // Disable the button when verification is in progress
                        >
                            {loading ? "Sending Email...." : "Click Here"}
                        </button>
                    </div>
                </div>
            </div>
            {toast.visible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        )}
        </div>
    );
};

export default EmailVerify;
