"use client";

import React, { useEffect, useState } from "react";
import { firestore } from "../../../../Backend/Firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdAdd } from "react-icons/io";
import Sidebar from "../../../../components/AdminDashboard/Sidebar";
import DashboardNavbar from "../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../components/AdminDashboard/DashboardPageInfo";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const AddAdmin = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  const [input, setInput] = useState({
    id: uuidv4(),
    admin_email: "",
    admin_name: "",
    admin_password: "",
    created_at: serverTimestamp(),
    updated_at: Date.now(),
  });

  const [error, setError] = useState({
    admin_email: "",
    admin_name: "",
    admin_password: "",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  useEffect(() => {
    const fetchAdminsData = async () => {
      const querySnapshot = await getDocs(
        collection(firestore, "site_admins_details")
      );
      const admins = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdminsData(admins);
    };
    fetchAdminsData();
  }, []);

  const validateInput = () => {
    let isValid = true;
    const errors = { admin_email: "", admin_name: "", admin_password: "" };

    if (!input.admin_email) {
      errors.admin_email = "Email is required.";
      isValid = false;
    }
    if (!input.admin_name) {
      errors.admin_name = "Name is required.";
      isValid = false;
    }
    if (!input.admin_password) {
      errors.admin_password = "Password is required.";
      isValid = false;
    } else if (input.admin_password.length < 8) {
      errors.admin_password = "Password must be at least 8 characters.";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    const newAdmin = {
      ...input,
      id: uuidv4(),
      created_at: serverTimestamp(),
      updated_at: Date.now(),
    };

    try {
      await setDoc(
        doc(firestore, "site_admins_details", newAdmin.id),
        newAdmin
      );
      setAdminsData((prevData) => [...prevData, newAdmin]);
      showToast(`${input.admin_name} successfully added.`, "success", 2000);
      closeModal();
      setCooldown(true);
      setCooldownTimer(3600);
      setInput({ admin_email: "", admin_name: "", admin_password: "" });
      setError({});
    } catch (error) {
      toast.error("Failed to add admin. Please try again.");
      console.error("Error adding admin:", error);
    }
  };

  useEffect(() => {
    let timer;
    if (cooldown) {
      timer = setInterval(() => {
        setCooldownTimer((prev) => {
          if (prev <= 1) {
            setCooldown(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        <ToastContainer />
        {toast.visible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        )}
          <Sidebar />
        <div className="w-full">
          <DashboardNavbar />
          <div className="px-10 py-12">
            <DashboardPageInfo
              DashboardPageInfo="Add Admin"
              icons={<IoMdAdd size={20} />}
            />
            <div className="flex flex-col items-center justify-center">
              <div
                className="flex items-center justify-center mt-8"
                onClick={handleOverlayClick}
              >
                <form
                  onSubmit={handleFormSubmit}
                  className="border border-primary/50 p-8 rounded-lg shadow-lg relative max-w-lg"
                >
                  <h2 className="text-xl font-semibold mb-4 text-primary">
                    Add New Admin
                  </h2>
                  <input
                    type="text"
                    onChange={handleInputChange}
                    placeholder="Name.."
                    name="admin_name"
                    className="border p-2 px-3 w-full mb-4 text-sm rounded border-primary/30 bg-transparent"
                  />
                  <input
                    type="email"
                    onChange={handleInputChange}
                    name="admin_email"
                    placeholder="Email.."
                    className="border p-2 px-3 w-full mb-4 text-sm rounded border-primary/30 bg-transparent"
                  />
                  <input
                    type="password"
                    onChange={handleInputChange}
                    name="admin_password"
                    placeholder="Password.."
                    className="border p-2 px-3 w-full mb-4 text-sm rounded border-primary/30 bg-transparent"
                  />
                  <button className="bg-primary/70 hover:bg-primary/90 duration-200 text-white py-2 px-5 rounded">
                    Add Admin
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default AddAdmin;
