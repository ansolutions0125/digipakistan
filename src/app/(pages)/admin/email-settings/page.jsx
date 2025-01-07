"use client";

import { firestore } from "@/Backend/Firebase";
import { getAllEmailSettings } from "@/Backend/firebasefunctions";
import DashboardNavbar from "@/components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "@/components/AdminDashboard/DashboardPageInfo";
import Sidebar from "@/components/AdminDashboard/Sidebar";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";

const page = () => {
  const [emailSettings, setEmailSettings] = useState([]);
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
    const fetchEmailSettings = async () => {
      const data = await getAllEmailSettings();
      setEmailSettings(data.data);
    };
    fetchEmailSettings();
  }, []);

  const updateEmailStatus = async (id, status) => {
    try {
      const emailQuery = query(
        collection(firestore, "email_notify_settings"),
        where("backend_notify_message", "==", id)
      );

      const querySnapshot = await getDocs(emailQuery);

      if (!querySnapshot.empty) {
        // Get the first matching document
        const emailDoc = querySnapshot.docs[0]; // Access the first document

        // Update the email_status field
        await updateDoc(emailDoc.ref, { email_status: status });

        // Update the UI by modifying the local state
        setEmailSettings((prevSettings) =>
          prevSettings.map((setting) =>
            setting.backend_notify_message === id
              ? { ...setting, email_status: status }
              : setting
          )
        );

        if (status === "active") {
          showToast(`Email status updated to "${status}"`, "success", 3000);
        }

        if (status === "inactive") {
          showToast(`Email status updated to "${status}"`, "info", 3000);
        }
      } else {
        console.log(`No document found with backend_notify_message: ${id}`);
        showToast(
          `No document found with backend_notify_message: ${id}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating email status:", error);
      showToast("Error updating email status. Please try again.", "error");
    }
  };

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        <Sidebar />
        {toast.visible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        )}
        <div className="w-full">
          <DashboardNavbar />
          <div className="max-w-[60rem] mx-auto">
            <div className="py-10">
              <DashboardPageInfo
                DashboardPageInfo={"Email Settings"}
                icons={<FaUser size={20} />}
              />
              <div className="py-10">
                <h1 className="mb-3 font-semibold">Student Notifications</h1>
                <div className="bg-gray-200 rounded-md">
                  {emailSettings.map((data, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col rounded-t-md border-b-gray-300 border"
                    >
                      <div className="p-5 flex justify-between items-center w-full">
                        <h2>{data.backend_notify_message}</h2>
                        <div className="flex gap-4">
                          {/* Activate Button */}
                          {data.email_status !== "active" && (
                            <button
                              onClick={() =>
                                updateEmailStatus(
                                  data.backend_notify_message,
                                  "active"
                                )
                              }
                            >
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={data.email_status === "active"}
                                  readOnly
                                  className="sr-only peer"
                                />
                                <div
                                  className={`peer ring-0 rounded-full outline-none duration-300 after:duration-500 w-12 h-12 shadow-md 
                                 bg-green-600 after:content-["✔️"] after:rotate-0
                                after:rounded-full after:absolute after:outline-none after:h-10 after:w-10 after:bg-gray-50 
                                after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-hover:after:scale-75`}
                                ></div>
                              </label>
                            </button>
                          )}

                          {/* Deactivate Button */}
                          {data.email_status === "active" && (
                            <button
                              onClick={() =>
                                updateEmailStatus(
                                  data.backend_notify_message,
                                  "inactive"
                                )
                              }
                              className=""
                            >
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={data.email_status === "inactive"}
                                  readOnly
                                  className="sr-only peer"
                                />
                                <div
                                  className={`peer ring-0 rounded-full outline-none duration-300 after:duration-500 w-12 h-12 shadow-md 
                                 bg-rose-400 after:content-["✖️"] after:rotate-0
                                after:rounded-full after:absolute after:outline-none after:h-10 after:w-10 after:bg-gray-50 
                                after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-hover:after:scale-75`}
                                ></div>
                              </label>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default page;
