"use client";
import { auth, firestore } from "@/Backend/Firebase";
import userHooks from "@/Hooks/userHooks";
import { sendEmailVerification, onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CustomToast from "../CoustomToast/CoustomToast";
import { MdOutlineAttachEmail, MdOutlineEmail } from "react-icons/md";
import { CiMail } from "react-icons/ci";

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

    // useEffect(()=>{
    //     const auth = getAuth();
    //     const user = auth.currentUser;
    //     if(user?.emailVerified){
    //         router.push("/registration/emailverified")
    //     }
        
        

    // },[auth]);

    // Listen for email verification status change using onAuthStateChanged
    useEffect(() => {
        const refreshVerificationStatus = async () => {
          const user = auth.currentUser;
    
          if (user && user.emailVerified) {
            if (userData?.id){
              const userRef = doc(firestore, "users", userData.id);
    
              try {
                const userDoc = await getDoc(userRef);
                // Update the user's email verification status in Firestore
                await updateDoc(userRef, { isEmailVerified: true });
    
                // Prepare request body for the API
                const requestBody = {
                  fetchedUserData: userData,
                  email_subject: "You're Almost There! Complete Your Admission Now",
                };
    
                // Call the API
                const response = await fetch('/api/emails/direct-emails/after-verification-sendmail', {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(requestBody),
                });
    
                const data = await response.json();
                console.log("API HITTED");
                console.log("Backend Response:", data);
    
                // Redirect to the verified page
                router.push("/registration/emailverified");
              } catch (error) {
                console.error("Error updating verification status:", error);
              }
            }
    
            // Show success toast
            showToast("Your email has been verified successfully.", "success", 2000);
          }
        };
    
        // Ensure auth state is loaded before calling the refresh function
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            refreshVerificationStatus();
          }
        });
    
        return () => unsubscribe(); // Cleanup listener on unmount
      }, [userData, router]); // Add dependencies for userData and router
      
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
        <div className="bg-gray-100 min-h-[70vh]">
            <div className="flex items-center justify-center p-3 lg:p-5">
                <div className="w-full min-h-[60vh] rounded-xl bg-white flex flex-col border shadow-2xl text-center p-5 lg:w-[40%]">
                   <div className="flex flex-col justify-center items-center">
                   <CiMail className="text-8xl"/>
                    <h1 className="lg:text-3xl text-2xl font-bold">
                        Hi {userData.firstName} {userData.lastName}
                    </h1>
                   </div>
                    <p className="mt-2">
                        First verify your email{" "}
                        <span className="text-red-500">{userData.email}</span> account as all communication will be done via email.
                    </p>

                    <div className="flex justify-center items-center mt-5 gap-2">
                        <p>To verify Email</p>
                        <button
                            onClick={buttonLoad}
                            className="bg-primary disabled:bg-gray-100 hover:bg-second duration-150 text-sm rounded-md p-2 text-white"
                            disabled={isVerificationDisabled || userData?.isEmailVerified} // Disable the button when verification is in progress
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
