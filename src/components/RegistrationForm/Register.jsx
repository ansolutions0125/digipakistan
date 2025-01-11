  "use client";
  import Link from "next/link";
  import React, { useState } from "react";
  import CustomToast from "@/components/CoustomToast/CoustomToast";
  import { v4 as uuidv4 } from "uuid";
  import { auth, firestore } from "@/Backend/Firebase";
  import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
    serverTimestamp,
  } from "firebase/firestore";
  import { useRouter } from "next/navigation";
  import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
  import Cookies from "js-cookie";
  import CryptoJS from "crypto-js";

  const Register = () => {

    const [loading,setLoading] =useState(false);
    const [toast, setToast] = useState({
      message: "",
      type: "",
      visible: false,
      duration: 5000,
    });
    const router = useRouter();

    const showToast = (message, type = "info", duration = 20000) => {
      setToast({ message, type, visible: true, duration });
    };

    const handleCloseToast = () => {
      setToast({ ...toast, visible: false });
    };

    // States
    const [emailExists, setEmailExists] = useState(false);
    const [createUserWithEmailAndPassword, user, loadingUser, errorUser] =
      useCreateUserWithEmailAndPassword(auth);

    // Form Data
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      isEmailVerified: false,
      isProfileComplete:false,
      registrationStatus:"pending",
      isPaidFee:false,
      created_at: serverTimestamp(),
      updated_at: Date.now(),
    });

    const [error, setError] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    const [focusState, setFocusState] = useState({
      firstName: false,
      lastName: false,
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

    // Check if email already exists in Firestore
    const checkEmailExists = async (email) => {
      try {
        const usersRef = collection(firestore, "users");
        const emailQuery = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(emailQuery);

        if (!querySnapshot.empty) {
          setEmailExists(true);
          return true;
        } else {
          setEmailExists(false);
          return false;
        }
      } catch (error) {
        console.error("Error checking email:", error);
        showToast("Error checking email existence. Please try again.", "error");
        return false;
      }
    };

    const handleFormSubmit = async(e) => {
      e.preventDefault();
      
      let validateErrors = {};

      if (!formData.firstName) {
        validateErrors.firstName = "First Name is required";
        showToast("Please Enter First Name.", "error", 2000);
      }
      if (!formData.lastName) {
        validateErrors.lastName = "Last Name is required";
        showToast("Please Enter Last Name.", "error", 2000);
      }
  
      if (!formData.email) {
        validateErrors.email = "Email is required";
        showToast("Please Enter Email.", "error", 2000);
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        validateErrors.email = "Invalid email format";
        showToast("Please Enter Correct Email", "error", 2000);
      }
      if (!formData.password) {
        validateErrors.password = "Password is required";
        showToast("Please Enter Password", "error", 2000);
      }
      if (formData.password.length < 6) {
        validateErrors.password = "Password must be at least 6 characters long";
        showToast("Password must be at least 6 characters long", "error", 2000);
      }
      

      setError(validateErrors);
      if (Object.keys(validateErrors).length > 0) {
        return;
      }

      try {
        setLoading(true);
        const emailAlreadyExists = await checkEmailExists(formData.email);

        if (emailAlreadyExists) {
          showToast(
            "Account already exists. Please login or use a different email.",
            "error",
            5000
          );
        } else {
          // Create user with email and password
          const result = await createUserWithEmailAndPassword(
            formData.email,
            formData.password
          );

          if (result) {
            const approvelTimee = new Date(
              new Date().getTime() + 4 * 60 * 60 * 1000);

            const createdUser = result.user;
            const userId = createdUser.uid;

            // Save additional user data in Firestore
            const userRef = doc(firestore, "users", userId);
            const encryptedPassword= CryptoJS.AES.encrypt(
              formData.password,
              process.env.NEXT_PUBLIC_SECRET_KEY || "SEcretKEy" ).toString();
            await setDoc(userRef, {
              id: userId,
              ...formData,
              password:encryptedPassword,
              updated_at: new Date().toISOString(),
              approvalTime:approvelTimee.toISOString()});

            showToast(
              "Account created succes sfully! Please login now.",
              "success",
              5000
            );
            router.push("/signin");
            console.log("Registering user with:", formData.email, formData.password);
          }
        }
      } catch (error) {
        console.error("Error during registration:", error.message);
        showToast(`Error: ${error.message}`, "error", 5000)
      }finally{
        setLoading(false);
      }
    };

    return (
      <div className="apply_now_bg min-h-[70vh]">
        <div className="flex items-center justify-center p-3 lg:p-5">
          <div className="w-full min-h-[60vh] rounded-xl bg-white flex flex-col border shadow-2xl text-center p-5 lg:w-[90%]">
            <img className="w-36 h-36 mx-auto" src="/logo.jpg" alt="logo" />
            <h1 className="lg:text-3xl text-2xl font-bold">Registration</h1>
            {emailExists && (
              <p className="text-red-500">
                Your account already exists. Please login to access your account.
              </p>
            )}
            <div className="flex flex-col lg:mx-auto text-center p-5 lg:w-[35rem]">
              <form onSubmit={handleFormSubmit}>
                {/* First Name */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => handleFocus("firstName")}
                    onBlur={() => handleBlur("firstName")}
                    className={`w-full border-2 p-3 text-sm focus:outline-none ${
                      error.firstName ? "border-red-700" : "border-gray-300"
                    }`}
                    placeholder=""
                  />
                  <label
                    className={`absolute left-1  text-gray-400 text-sm transition-all ${
                      focusState.firstName || formData.firstName
                       ? "top-[-15px] p-2 text-xs text-primary bg-white"
                         : "top-[-15px] p-2 bg-white"
                    }`}
                  >
                    First Name
                  </label>
                  {error.firstName && (
                    <p className="text-left text-red-700 text-xs">
                      {error.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => handleFocus("lastName")}
                    onBlur={() => handleBlur("lastName")}
                    className={`w-full border-2 p-3 text-sm focus:outline-none ${
                      error.lastName ? "border-red-700" : "border-gray-300"
                    }`}
                    placeholder=""
                  />
                  <label
                    className={`absolute left-1  text-gray-400 text-sm transition-all ${
                      focusState.lastName || formData.lastName
                       ? "top-[-15px] p-2 text-xs text-primary bg-white"
                         : "top-[-15px] p-2 bg-white"
                    }`}
                  >
                    Last Name
                  </label>
                  {error.lastName && (
                    <p className="text-left text-red-700 text-xs">
                      {error.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="relative mb-6">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={() => handleBlur("email")}
                    className={`w-full border-2 p-3 text-sm focus:outline-none ${
                      error.email ? "border-red-700" : "border-gray-300"
                    }`}
                    placeholder=""
                  />
                  <label
                    className={`absolute left-1  text-gray-400 text-sm transition-all ${
                      focusState.email || formData.email
                       ? "top-[-15px] p-2 text-xs text-primary bg-white"
                         : "top-[-15px] p-2 bg-white"
                    }`}
                  >
                    Email
                  </label>
                  {error.email && (
                    <p className="text-left text-red-700 text-xs">
                      {error.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="relative mb-6">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus("password")}
                    onBlur={() => handleBlur("password")}
                    className={`w-full border-2 p-3 text-sm focus:outline-none ${
                      error.password ? "border-red-700" : "border-gray-300"
                    }`}
                    placeholder=""
                  />
                  <label
                    className={`absolute left-1  text-gray-400 text-sm transition-all ${
                      focusState.password || formData.password
                       ? "top-[-15px] p-2 text-xs text-primary bg-white"
                         : "top-[-15px] p-2 bg-white"
                    }`}
                  >
                    Password
                  </label>
                  {error.password && (
                    <p className="text-left text-red-700 text-xs">
                      {error.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary p-3 text-white hover:bg-second rounded "
                >
                  {loading ? "Loading..." : "Register"}
                </button>
              </form>
              <p className="mt-5 font-bold ">
                Have an account?{" "}
                <span className="text-primary">
                  {" "}
                  <Link href="/signin">Login</Link>{" "}
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
    );
  };

  export default Register;
