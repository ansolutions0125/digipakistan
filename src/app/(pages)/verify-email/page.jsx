"use client";
import { auth } from "@/Backend/Firebase";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import Navbar from "@/components/Navbar/Navbar";
import userHooks from "@/Hooks/userHooks";
import useAuthStore from "@/stores/authStore";
import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

const Page = () => {
  const navigate = useRouter();
  const { setEmailSent, setVerified, isEmailSent } = useAuthStore();
  const { userData } = userHooks(); // Ensure that userData contains user info, such as email
  const [signInWithEmailAndPassword, user, loadingUser, errorUser] =
    useSignInWithEmailAndPassword(auth);
  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
    duration: 5000,
  });

  const showToast = (message, type = "info", duration = 20000) => {
    setToast({ message, type, visible: true, duration });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  useEffect(() => {
    if (user) {
      // Check if the user is signed in and if their email is verified
      if (user.user.emailVerified) {
        // Optionally navigate to another page after successful login
        showToast("Your Account is already verified.", "success", 20000);
      } else {
        // Resend verification email if the email is not verified
      }
    }
  }, [user, navigate]);

  const sendUserEmail = async (e) => {
    const user = await signInWithEmailAndPassword(
      userData.email,
      userData.password
    );
    if (!user.user.emailVerified) {
      sendEmailVerification(user.user);
      showToast(
        "A email has been sent to your email, please verify you email by clicking on the url provided in your mail.",
        "success",
        20000
      );
      setEmailSent();
    }
  };

  return (
    <div>
      {toast.visible && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleCloseToast}
        />
      )}
      <Navbar />
      <div className="max-w-6xl mx-auto h-screen p-4">
        <div className="flex flex-col items-center w-full h-full justify-center">
          <h1 className="text-4xl heading-text">Verify Your Email</h1>
          <p className="w-1/2 text-center mt-3">
            Please verify your account by clicking on the 'Send Email' button
            below. A verification link will be sent to your email. Once you
            verify, you can access all features of your account. Thank you!
          </p>
          <div className="flex items-center gap-5 mt-10">
            <button className="btn-primary px-7 py-2" onClick={sendUserEmail}>
              Send Email
            </button>
          </div>
        </div>
      </div>
      <FooterCopyRights bg={"bg-primary py-4 text-center text-white"} />
    </div>
  );
};

export default Page;
