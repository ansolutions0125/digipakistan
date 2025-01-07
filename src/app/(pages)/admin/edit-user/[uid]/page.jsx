"use client";
import React, { useEffect, useState, use } from "react";
import { firestore } from "../../../../../Backend/Firebase";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../../../../components/AdminDashboard/Sidebar";
import DashboardNavbar from "../../../../../components/AdminDashboard/DashboardNavbar";
import { getSingleUser } from "../../../../../Backend/firebasefunctions";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const EditUser = ({ params }) => {
  const unwrappedParams = use(params); // Unwraps the params Promise

  const uid = unwrappedParams.uid;
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const adminData = async () => {
      const data = await getSingleUser(uid);
      setAdminData(data.data);
    };
    adminData();
  }, []);

  // Error handling.
  const [error, setError] = useState({
    email: "",
    firstName: "",
    password: "",
    lastName: "",
  });

  // Input fields data.
  const [input, setInput] = useState({
    email: adminData?.email,
    firstName: adminData?.firstName,
    password: adminData?.password,
    lastName: adminData?.lastName,
  });

  // Handling Inputs.
  const HandleInput = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Input fields Validations.
  const validateInput = () => {
    let isValid = true;
    const newError = {
      email: "",
      firstName: "",
      password: "",
      lastName: "",
    };

    if (!input.email) {
      newError.email = "Name is required.";
      isValid = false;
    }
    if (!input.firstName) {
      newError.client_phonenumber = "Phone number is required.";
      isValid = false;
    }
    if (!input.password) {
      newError.password = "Message cannot be empty.";
      isValid = false;
    } else if (input.password.length === 4) {
      newError.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  // Form Submition / Data storing in "FIREBASE".
  const HandleFormSubmit = async (e) => {
    e.preventDefault();

    await updateDoc(doc(firestore, "users", uid), {
      ...input,
      uid: adminData.uid,
      created_at: adminData.created_at,
      updated_at: serverTimestamp(),
    });

    toast.success(`${input.firstName} successfly updated.`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setInput({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    });
    setError({}); // Clear errors on successful submission
    setInput({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    });
  };

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        <ToastContainer />
        <Sidebar />

        <div className="w-full ml-[17rem]">
          <DashboardNavbar />
          <div className="flex h-full flex-col items-center justify-center">
            <div className="flex items-center justify-center bg-opacity-50">
              <form
                onSubmit={HandleFormSubmit}
                className="bg-primary/80 border p-8 rounded-lg shadow-lg relative w-1/2"
              >
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Edit User Details
                </h2>
                <input
                  type="text"
                  onChange={HandleInput}
                  name="firstName"
                  placeholder={adminData?.firstName}
                  className="border p-2 w-full mb-4"
                />
                <input
                  type="text"
                  onChange={HandleInput}
                  name="lastName"
                  placeholder={adminData?.lastName}
                  className="border p-2 w-full mb-4"
                />
                <input
                  type="email"
                  onChange={HandleInput}
                  name="email"
                  placeholder={adminData?.email}
                  className="border p-2 w-full mb-4"
                />
                <input
                  type="password"
                  onChange={HandleInput}
                  placeholder={adminData?.password}
                  name="password"
                  className="border p-2 w-full mb-4"
                />
                <button className="bg-primary text-white py-2 px-4 rounded">
                  Update User
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default EditUser;
