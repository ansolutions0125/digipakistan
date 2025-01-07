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

const PayProKeysManagement = () => {
  const [error, setError] = useState({
    client_id: "",
    client_secret: "",
    merchant_id: "",
  });
  const [formData, setFormData] = useState({
    client_id: "",
    client_secret: "",
    merchant_id: "",
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
      client_id: "",
      client_secret: "",
      merchant_id: "",
    };

    if (!formData.client_id) {
      newError.client_id = "Client ID is required.";
      isValid = false;
    }
    if (!formData.client_secret) {
      newError.client_secret = "Client Secret is required.";
      isValid = false;
    }
    if (!formData.merchant_id) {
      newError.merchant_id = "Merchant ID is required.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch existing payprokeys config from Firestore
  useEffect(() => {
    const fetchPayProKeysConfig = async () => {
      try {
        const configCollection = collection(firestore, "payprokeys");
        const querySnapshot = await getDocs(configCollection);

        if (!querySnapshot.empty) {
          // Load form data from the first document in `payprokeys` collection
          const configData = querySnapshot.docs[0].data();
          setFormData({
            client_id: configData.client_id || "",
            client_secret: configData.client_secret || "",
            merchant_id: configData.merchant_id || "",
          });
        }
      } catch (error) {
        showToast("Error fetching PayPro keys configuration.", "error", 5000);
        console.error("Error fetching PayPro keys configuration:", error);
      }
    };

    fetchPayProKeysConfig();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    try {
      // Update or set the document in `payprokeys` collection
      await setDoc(doc(firestore, "payprokeys", "payproConfig"), formData);
      showToast("PayPro keys updated successfully", "success", 2000);

      // Optionally, reset formData after successful update
      setFormData({
        client_id: "",
        client_secret: "",
        merchant_id: "",
      });
    } catch (error) {
      showToast("Failed to update PayPro keys", "error", 2000);
      console.error("Error updating PayPro keys:", error);
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
              DashboardPageInfo={"PayPro Keys Management"}
              icons={<FaUser size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">PayPro Keys Management</h2>
              </div>
              <div className="p-5">
                <form
                  onSubmit={handleFormSubmit}
                  className="flex flex-col gap-2"
                >
                  <div>
                    <label
                      htmlFor="client_id"
                      className="heading-text text-[13px]"
                    >
                      Client ID*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.client_id}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="client_id"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.client_id}
                      placeholder={"Enter Client ID."}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="client_secret"
                      className="heading-text text-[13px]"
                    >
                      Client Secret*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.client_secret}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="client_secret"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.client_secret}
                      placeholder={"Enter Client Secret."}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="merchant_id"
                      className="heading-text text-[13px]"
                    >
                      Merchant ID*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.merchant_id}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="merchant_id"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.merchant_id}
                      placeholder={"Enter Merchant ID."}
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

export default PayProKeysManagement;
