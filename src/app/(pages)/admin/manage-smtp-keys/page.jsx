"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/AdminDashboard/Sidebar";
import DashboardNavbar from "../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../components/AdminDashboard/DashboardPageInfo";
import { FaUser } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { firestore } from "../../../../Backend/Firebase";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import CustomToast from "../../../../components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const SmtpConfigManagement = () => {
  const [error, setError] = useState({
    SMTP_HOST: "",
    SMTP_PORT: "",
    SMTP_SECURE: "",
    SMTP_USER: "",
    SMTP_PASS: "",
    SMTP_EMAIL_FROM: "",
  });
  const [formData, setFormData] = useState({
    SMTP_HOST: "",
    SMTP_PORT: "",
    SMTP_SECURE: "false",
    SMTP_USER: "",
    SMTP_PASS: "",
    SMTP_EMAIL_FROM: "",
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

  const validateInput = () => {
    let isValid = true;
    const newError = {
      SMTP_HOST: "",
      SMTP_PORT: "",
      SMTP_SECURE: "",
      SMTP_USER: "",
      SMTP_PASS: "",
      SMTP_EMAIL_FROM: "",
    };

    if (!formData.SMTP_HOST) {
      newError.SMTP_HOST = "SMTP HOST is required.";
      isValid = false;
    }
    if (!formData.SMTP_PORT) {
      newError.SMTP_PORT = "SMTP PORT is required.";
      isValid = false;
    }
    if (!formData.SMTP_SECURE) {
      newError.SMTP_SECURE = "PLEASE SELECT A OPTION.";
      isValid = false;
    }
    if (!formData.SMTP_USER) {
      newError.SMTP_USER = "SMTP USER is required.";
      isValid = false;
    }
    if (!formData.SMTP_PASS) {
      newError.SMTP_PASS = "SMTP PASS is required.";
      isValid = false;
    }
    if (!formData.SMTP_EMAIL_FROM) {
      newError.SMTP_EMAIL_FROM = "SMTP EMAIL FROM is required.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSecureChange = (e) => {
    setFormData({ ...formData, SMTP_SECURE: e.target.value });
  };

  const secureOptions = ["true", "false"];

  // Fetch existing SMTP config from Firestore
  useEffect(() => {
    const fetchSmtpConfig = async () => {
      try {
        const configCollection = collection(firestore, "config_smtp_keys");
        const querySnapshot = await getDocs(configCollection);

        if (!querySnapshot.empty) {
          // Load form data from the first document in `config_smtp_keys` collection
          const configData = querySnapshot.docs[0].data();
          setFormData({
            SMTP_HOST: configData.SMTP_HOST || "",
            SMTP_PORT: configData.SMTP_PORT || "",
            SMTP_SECURE: configData.SMTP_SECURE || "",
            SMTP_USER: configData.SMTP_USER || "",
            SMTP_PASS: configData.SMTP_PASS || "",
            SMTP_EMAIL_FROM: configData.SMTP_EMAIL_FROM || "",
          });
        }
      } catch (error) {
        showToast("Error fetching SMTP configuration.", "error", 5000);
        console.error("Error fetching SMTP configuration:", error);
      }
    };

    fetchSmtpConfig();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    try {
      // Update or set the document in `config_smtp_keys` collection
      await setDoc(doc(firestore, "config_smtp_keys", "smtpConfig"), formData);
      showToast("SMTP configuration updated successfully", "success", 2000);

      // Optionally, reset formData after successful update
      setFormData({
        SMTP_HOST: "",
        SMTP_PORT: "",
        SMTP_SECURE: "",
        SMTP_USER: "",
        SMTP_PASS: "",
        SMTP_EMAIL_FROM: "",
      });
    } catch (error) {
      showToast("Failed to update SMTP configuration", "error", 2000);
      console.error("Error updating SMTP configuration:", error);
    }
  };

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        {toast.visible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        )}
        <Sidebar />
        <div className="w-full bg-bgcolor">
          <DashboardNavbar />
          <div className="p-10">
            <DashboardPageInfo
              DashboardPageInfo={"SMTP Keys Management"}
              icons={<FaUser size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">SMTP Keys Management</h2>
              </div>
              <div className="p-5">
                <form
                  onSubmit={handleFormSubmit}
                  className="flex flex-col gap-2"
                >
                  <div>
                    <label
                      htmlFor="SMTP_HOST"
                      className="heading-text text-[13px]"
                    >
                      SMTP HOST*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.SMTP_HOST}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="SMTP_HOST"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.SMTP_HOST}
                      placeholder={"Enter SMTP_HOST Key."}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="SMTP_PORT"
                      className="heading-text text-[13px]"
                    >
                      SMTP PORT*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.SMTP_PORT}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="SMTP_PORT"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.SMTP_PORT}
                      placeholder={"Enter SMTP_PORT."}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="SMTP_SECURE"
                      className="heading-text text-[13px]"
                    >
                      SMTP SECURE*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.SMTP_SECURE}
                      </span>
                    </label>
                    <select
                      name="SMTP_SECURE"
                      value={formData.SMTP_SECURE}
                      onChange={handleSecureChange}
                      className="outline-none border px-2 mt-1 py-2 w-full rounded"
                    >
                      {secureOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="SMTP_USER"
                      className="heading-text text-[13px]"
                    >
                      SMTP USER*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.SMTP_USER}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="SMTP_USER"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.SMTP_USER}
                      placeholder={"Enter SMTP_USERNAME."}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="SMTP_PASS"
                      className="heading-text text-[13px]"
                    >
                      SMTP PASSWORD*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.SMTP_PASS}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="SMTP_PASS"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.SMTP_PASS}
                      placeholder={"Enter SMTP_PASSWORD."}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="SMTP_EMAIL_FROM"
                      className="heading-text text-[13px]"
                    >
                      EMAIL FROM*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.SMTP_EMAIL_FROM}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="SMTP_EMAIL_FROM"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.SMTP_EMAIL_FROM}
                      placeholder={"Enter a sender email address."}
                    />
                  </div>
                  <div>
                    <button className="text-start mt-3 bg-primary py-2 px-3 hover:bg-second text-white rounded-md">
                      <span className="font-medium">Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default SmtpConfigManagement;
