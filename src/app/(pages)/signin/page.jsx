"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import FooterCopyRights from "../../../components/Footer/FooterCopyRights";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../Backend/Firebase";
import Link from "next/link"; // Next.js's Link
import { useRouter } from "next/navigation"; // Next.js's useRouter
import Cookies from "js-cookie";
import { doc, getDoc } from "firebase/firestore";
import CryptoJS from "crypto-js";
import CustomToast from "../../../components/CoustomToast/CoustomToast";
import UserProtectedRoutes from "@/ProtectedRoutes/UserProtectedRoutes";
import Image from "next/image";
import PasswordResetModal from "@/components/PasswordReset/PasswordResetModal";
import { FaUser } from "react-icons/fa";
import Footer from "@/components/Footer/Footer";
import userHooks from "@/Hooks/userHooks";

const SignIn = () => {
  const router = useRouter(); // Replace useNavigate with useRouter
  const [handleLoading, setHandleLoading] = useState(false);
  const {userData} = userHooks();
  const [signInWithEmailAndPassword, user, loadingUser, errorUser] =
    useSignInWithEmailAndPassword(auth);

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const [input, setInput] = useState({
    email: "",
    password: "",
  });



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

 

  useEffect(()=>{
    if(userData && !userData.isEmailVerified){
        router.push("/registration/emailverify")
    }
  //   else if(userData && !userData.isVerified){
  //     router.push("/registration/emailverify")
  // }
    else if(userData && !userData.isProfileComplete){
      router.push("/registration/personalinfo")
  }
    else if(userData && !userData.feePaid){
      router.push("/registration/generate-challan")
  }
  else if(userData){
    router.push("/")
}
  },[])



  useEffect(() => {
    if (errorUser) {
      if (errorUser.code === "auth/user-not-found") {
        showToast(
          "User does not exist. Please check your email or sign up.",
          "error",
          2000
        );
      } else if (errorUser.code === "auth/wrong-password") {
        showToast("Incorrect password. Please try again.", "error", 2000);
      } else if (errorUser.code === "auth/invalid-email") {
        showToast(
          "Invalid email format. Please enter a valid email.",
          "error",
          2000
        );
      } else if (errorUser.code === "auth/invalid-credential") {
        showToast("Invalid email or password.", "error", 2000);
      } else {
        showToast(errorUser.message, "error", 2000);
      }
      setHandleLoading(false);
    }
  }, [errorUser]);

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // Track focus for each input independently
  const [focusState, setFocusState] = useState({
    email: false,
    password: false,
  });

  const handleFocus = (field) => {
    setFocusState({ ...focusState, [field]: true });
  };

  const handleBlur = (field) => {
    setFocusState({ ...focusState, [field]: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let validateErrors = {};
    
    // Validate input
    if (!formData.email) {
      validateErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validateErrors.email = "Invalid email format";
    }
    if (!formData.password) validateErrors.password = "Password is required";
    
    setError(validateErrors);
    
    if (Object.keys(validateErrors).length === 0) {
      setHandleLoading(true);
      
      try {
        setHandleLoading(true);
        // Attempt to sign in with plain password
        const userCredential = await signInWithEmailAndPassword(
          formData.email,
          formData.password // Pass the password as is (no decryption needed)
        );
        
        if (!userCredential?.user) {
         return showToast("User not Found","error",2000);
        }
        
        const user = userCredential.user;
  
        // Encrypt user data
        
  
        // Fetch additional user data from Firestore
        const userRef = doc(firestore, "users", user?.uid);
        const userDoc = await getDoc(userRef);
      
        if (userDoc.exists()) {
          const userData = userDoc?.data();

          // Set User data into cookie
          const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(userData),
            process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "SEcretKEy"
          ).toString();
          
          Cookies.set("user_data", encryptedData, {
            expires: 7,
            secure: true,
            sameSite: "Strict",
          });
          // Redirect based on user data
          if (!user.emailVerified) {
            // await user.sendEmailVerification();
            showToast("Verification email sent. Please verify your email.", "info");
            router.push("/registration/emailverify");
          } else if (!userData.isProfileComplete) {
            router.push("/registration/personalinfo");
          } else if (!userData.registrationStatus || userData.registrationStatus==="pending") {
            router.push("/registration/registration-status");
          } else if (!userData.paidFee) {
            router.push("/registration/generate-challan");
          } else {
            router.push("/");
          }
      
          showToast("Logged in successfully!", "success", 2000);
        } else {
          showToast("User not found", "error", 2000);
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        setHandleLoading(false);
        showToast(error.message || "An error occurred during sign-in.", "error", 2000);
      }finally{
        setHandleLoading(false);
      }
    }
  };
  
  

  return (
    <>
  <UserProtectedRoutes userNotLogined={true} ifUserLoginedThen={true}>
      <Navbar />
    
      <div className="apply_now_bg min-h-[70vh]">
        <div className="flex items-center justify-center p-3 lg:p-5">
          <div className="w-fu  ll min-h-[60vh] rounded-xl bg-white flex flex-col border shadow-2xl text-center lg:p-5 lg:w-[90%]">
            <img className="w-36 h-36 mx-auto" src="/logo.jpg" alt="" />
            <h1 className="lg:text-3xl text-2xl font-bold">Login</h1>
            
            <div className="flex flex-col lg:mx-auto text-center p-3 lg:w-[35rem] ">
              <form onSubmit={handleFormSubmit}>
                {/* Email */}
                <div className="relative mb-6">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={() => handleBlur("email")}
                    className={`w-full border-0 border-b-2 lg:px-2 py-2 text-sm focus:outline-none ${
                      error.email ? "border-red-700" : "border-gray-300"
                    }`}
                    placeholder=""
                  />
                  <label
                    className={`absolute left-1 text-gray-400 text-sm transition-all ${
                      focusState.email || formData.email
                        ? "top-[-14px] text-xs text-primary"
                        : "top-2"
                    }`}
                  >
                    Email
                  </label>
                  {error.email && (
                    <p className="text-right text-red-700">{error.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="relative mb-6">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    onFocus={() => handleFocus("password")}
                    className={`w-full border-0 border-b-2 px-2 py-2 text-sm focus:outline-none ${
                      error.password ? "border-red-700" : "border-gray-300"
                    }`}
                    placeholder=""
                  />
                  <label
                    className={`absolute left-1 text-gray-400 text-sm transition-all ${
                      focusState.password || formData.password
                        ? "top-[-14px] text-xs text-primary"
                        : "top-2"
                    }`}
                  >
                    Password
                  </label>
                  {error.password && (
                    <p className="text-right text-red-700">{error.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={handleLoading}
                  className="bg-primary py-3 px-5 text-white hover:bg-second rounded"
                >
                 {handleLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>
              <p className="mt-5 font-bold ">
                Not have an account?{" "}
                <span className="text-primary">
                  {" "}
                  <Link href="/registration/register">Signup</Link>{" "}
                </span>
              </p>
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
      </UserProtectedRoutes>
      <Footer />
    </>
  );
};

export default SignIn;
