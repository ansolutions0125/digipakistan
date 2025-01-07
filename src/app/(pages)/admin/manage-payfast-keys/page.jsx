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

const currencyOptions = [
  "USD",
  "EUR",
  "GBP",
  "ZAR",
  "PKR"
  // Add more currencies as needed
];

const PayFastKeysManagement = () => {
  const [error, setError] = useState({
    merchant_id: "",
    secured_key: "",
    currency_code: "",
    checkout_url: "",
    tokenApiUrl: "",
  });

  const [formData, setFormData] = useState({
    merchant_id: "",
    secured_key: "",
    currency_code: "",
    checkout_url: "",
    tokenApiUrl: "",
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
      merchant_id: "",
      secured_key: "",
      currency_code: "",
      checkout_url: "",
      tokenApiUrl: "",
    };

    if (!formData.merchant_id) {
      newError.merchant_id = "Merchant ID is required.";
      isValid = false;
    }
    if (!formData.secured_key) {
      newError.secured_key = "Secured Key is required.";
      isValid = false;
    }
    if (!formData.currency_code) {
      newError.currency_code = "Currency Code is required.";
      isValid = false;
    }
    if (!formData.checkout_url) {
      newError.checkout_url = "Checkout URL is required.";
      isValid = false;
    }
    if (!formData.tokenApiUrl) {
      newError.tokenApiUrl = "Token API URL is required.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchPayFastKeysConfig = async () => {
      try {
        const configCollection = collection(firestore, "payfastkeys");
        const querySnapshot = await getDocs(configCollection);

        if (!querySnapshot.empty) {
          const configData = querySnapshot.docs[0].data();
          setFormData({
            merchant_id: configData.merchant_id || "",
            secured_key: configData.secured_key || "",
            currency_code: configData.currency_code || "",
            checkout_url: configData.checkout_url || "",
            tokenApiUrl: configData.tokenApiUrl || "",
          });
        }
      } catch (error) {
        showToast("Error fetching PayFast keys configuration.", "error", 5000);
        console.error("Error fetching PayFast keys configuration:", error);
      }
    };

    fetchPayFastKeysConfig();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    try {
      await setDoc(doc(firestore, "payfastkeys", "payfastConfig"), formData);
      showToast("PayFast keys updated successfully", "success", 2000);

      setFormData({
        merchant_id: "",
        secured_key: "",
        currency_code: "",
        checkout_url: "",
        tokenApiUrl: "",
      });
    } catch (error) {
      showToast("Failed to update PayFast keys", "error", 2000);
      console.error("Error updating PayFast keys:", error);
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
              DashboardPageInfo={"PayFast Keys Management"}
              icons={<FaUser size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">PayFast Keys Management</h2>
              </div>
              <div className="p-5">
                <form
                  onSubmit={handleFormSubmit}
                  className="flex flex-col gap-2"
                >
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
                    <label
                      htmlFor="secured_key"
                      className="heading-text text-[13px]"
                    >
                      Secured Key*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.secured_key}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="secured_key"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.secured_key}
                      placeholder={"Enter Secured Key."}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="currency_code"
                      className="heading-text text-[13px]"
                    >
                      Currency Code*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.currency_code}
                      </span>
                    </label>
                    <select
                      onChange={handleInputChange}
                      name="currency_code"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.currency_code}
                    >
                      <option value="">Select Currency</option>
                      {currencyOptions.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="checkout_url"
                      className="heading-text text-[13px]"
                    >
                      Checkout URL*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.checkout_url}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="checkout_url"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.checkout_url}
                      placeholder={"Enter Checkout URL."}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="tokenApiUrl"
                      className="heading-text text-[13px]"
                    >
                      Token API URL*{" "}
                      <span className="text-[11px] ml-2 text-red-500">
                        {error.tokenApiUrl}
                      </span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="tokenApiUrl"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.tokenApiUrl}
                      placeholder={"Enter Token API URL."}
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

export default PayFastKeysManagement;
