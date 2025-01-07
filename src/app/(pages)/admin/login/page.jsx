"use client"; // Ensure client-side rendering only

import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { IoIosLock } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { firestore } from "../../../../Backend/Firebase";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const Admindashboard = () => {
  const router = useRouter();
  const [input, setInput] = useState({
    admin_email: "",
    admin_password: "",
  });
  const [error, setError] = useState({
    admin_email: "",
    admin_password: "",
  });

  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const validateInput = () => {
    let isValid = true;
    const newError = {
      admin_email: "",
      admin_password: "",
    };

    if (!input.admin_email) {
      newError.admin_email = "Email is required.";
      isValid = false;
    }
    if (!input.admin_password) {
      newError.admin_password = "Password is required.";
      isValid = false;
    } else if (input.admin_password.length < 8) {
      newError.admin_password = "Password must be at least 8 characters.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      const adminQuery = query(
        collection(firestore, "site_admins_details"),
        where("admin_email", "==", input.admin_email)
      );

      const querySnapshot = await getDocs(adminQuery);

      if (!querySnapshot.empty) {
        const adminDoc = querySnapshot.docs[0];
        const adminData = adminDoc.data();

        if (
          adminData.admin_password === input.admin_password &&
          adminData.admin_email === input.admin_email
        ) {
          const payload = {
            email: adminData.admin_email,
            name: adminData.admin_name,
            role: adminData.role,
            password: adminData.password,
            id: adminDoc.id,
          };

          const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(payload),
            process.env.NEXT_PUBLIC_ADMIN_ENCRYPTION_KEY
          ).toString();

          Cookies.set("admin_data", encryptedData, {
            expires: 7,
          });

          setInput({ admin_email: "", admin_password: "" });

          toast.success("Successfully logged in.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          router.push("/admin/dashboard");
        } else {
          toast.error("Invalid password.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        toast.error("Admin not found.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error(error);
    }
  };

  return (
    <AdminProtectedRoutes isLoginPage={true}>
      <div className="w-full h-screen flex items-center justify-center">
        <ToastContainer />
        <div className="bg-primary w-full mx-10 lg:mx-0 lg:w-1/3 p-10 rounded-lg">
          <h1 className="text-center basefont text-5xl font-bold text-white">
            Admin Login
          </h1>
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-2 mt-8"
          >
            <div className="rounded-md py-3 px-4 bg-white gap-2 flex items-center">
              <MdEmail size={25} className="text-primary" />
              <input
                type="email"
                name="admin_email"
                onChange={handleInput}
                className="bg-transparent w-full outline-none"
                placeholder="Enter Email"
              />
              {error.admin_email && (
                <span className="text-red-500">{error.admin_email}</span>
              )}
            </div>
            <div className="rounded-md py-3 px-4 bg-white gap-2 flex items-center">
              <IoIosLock size={25} className="text-primary" />
              <input
                type="password"
                name="admin_password"
                onChange={handleInput}
                className="bg-transparent w-full outline-none"
                placeholder="Enter Password"
              />
              {error.admin_password && (
                <span className="text-red-500">{error.admin_password}</span>
              )}
            </div>
            <button className="w-full py-2 bg-white text-center basefont text-2xl font-bold rounded-lg hover:bg-gray-200 duration-500">
              Login
            </button>
          </form>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default Admindashboard;
