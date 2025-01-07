"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/AdminDashboard/Sidebar";
import DashboardNavbar from "../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../components/AdminDashboard/DashboardPageInfo";
import { FaKey } from "react-icons/fa";
import { firestore } from "../../../../Backend/Firebase";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import CustomToast from "../../../../components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const ThinkificKeysManagement = () => {
  const [error, setError] = useState({
    thinkific_api_key: "",
    thinkific_subdomain: "",
  });

  const [formData, setFormData] = useState({
    thinkific_api_key: "",
    thinkific_subdomain: "",
  });

  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
    duration: 5000,
  });

  const showToast = (message, type = "info", duration = 5000) => {
    setToast({ message, type, visible: true, duration });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  const validateInput = () => {
    let isValid = true;
    const newError = {
      thinkific_api_key: "",
      thinkific_subdomain: "",
    };

    if (!formData.thinkific_api_key) {
      newError.thinkific_api_key = "Thinkific API Key is required.";
      isValid = false;
    }
    if (!formData.thinkific_subdomain) {
      newError.thinkific_subdomain = "Thinkific Subdomain is required.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchThinkificKeysConfig = async () => {
      try {
        const configCollection = collection(firestore, "thinkifickeys");
        const querySnapshot = await getDocs(configCollection);

        if (!querySnapshot.empty) {
          const configData = querySnapshot.docs[0].data();
          setFormData({
            thinkific_api_key: configData.thinkific_api_key || "",
            thinkific_subdomain: configData.thinkific_subdomain || "",
          });
        }
      } catch (error) {
        showToast(
          "Error fetching Thinkific keys configuration.",
          "error",
          5000
        );
        console.error("Error fetching Thinkific keys configuration:", error);
      }
    };

    fetchThinkificKeysConfig();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    try {
      await setDoc(
        doc(firestore, "thinkifickeys", "thinkificConfig"),
        formData
      );
      showToast("Thinkific keys updated successfully", "success", 2000);

      setFormData({
        thinkific_api_key: "",
        thinkific_subdomain: "",
      });
    } catch (error) {
      showToast("Failed to update Thinkific keys", "error", 2000);
      console.error("Error updating Thinkific keys:", error);
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
              DashboardPageInfo={"Thinkific Keys Management"}
              icons={<FaKey size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">Thinkific Keys Management</h2>
              </div>
              <div className="p-5">
                <form
                  onSubmit={handleFormSubmit}
                  className="flex flex-col gap-2"
                >
                  <div>
                    <label
                      htmlFor="thinkific_api_key"
                      className="heading-text text-[13px]"
                    >
                      Thinkific API Key*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.thinkific_api_key}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="thinkific_api_key"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.thinkific_api_key}
                      placeholder={"Enter Thinkific API Key."}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="thinkific_subdomain"
                      className="heading-text text-[13px]"
                    >
                      Thinkific Subdomain*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.thinkific_subdomain}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="thinkific_subdomain"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.thinkific_subdomain}
                      placeholder={"Enter Thinkific Subdomain."}
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

export default ThinkificKeysManagement;
