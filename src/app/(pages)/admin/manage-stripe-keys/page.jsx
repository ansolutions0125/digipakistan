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

const StripeConfigManagement = () => {
  const [environment, setEnvironment] = useState("test");
  const [error, setError] = useState({
    stripe_Publishable_Key: "",
    stripe_Secret_Key: "",
    stripe_Webhook_Secret: "",
  });
  const [formData, setFormData] = useState({
    stripe_Publishable_Key: "",
    stripe_Secret_Key: "",
    stripe_Webhook_Secret: "",
    currency: "USD", // Default currency
  });
  const [documentRefs, setDocumentRefs] = useState([]);
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
      stripe_Publishable_Key: "",
      stripe_Secret_Key: "",
      stripe_Webhook_Secret: "",
    };

    if (!formData.stripe_Publishable_Key) {
      newError.stripe_Publishable_Key = "Publishable Key is required.";
      isValid = false;
    }
    if (!formData.stripe_Secret_Key) {
      newError.stripe_Secret_Key = "Secret Key is required.";
      isValid = false;
    }
    if (!formData.stripe_Webhook_Secret) {
      newError.stripe_Webhook_Secret = "Webhook Secret is required.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEnvironmentChange = (e) => {
    setEnvironment(e.target.value);
  };
  const handleCurrencyChange = (e) => {
    setFormData({ ...formData, currency: e.target.value });
  };
  const stripeCurrencies = [
    "USD",
    "EUR",
    "GBP",
    "CAD",
    "AUD",
    "JPY",
    "INR",
    "BRL",
    "ZAR",
    "SGD",
    "CNY",
    "HKD",
    "MXN",
    "NZD",
    "SEK",
    "NOK",
    "DKK",
    "CHF",
    "RUB",
    "KRW",
    "PLN",
    "TRY",
    "THB",
    "IDR",
    "MYR",
    "PHP",
    "CZK",
    "HUF",
    "ILS",
    "CLP",
  ];

  // Fetch existing keys from Firestore based on the selected environment
  useEffect(() => {
    const fetchStripeConfigs = async () => {
      try {
        const configCollection = collection(firestore, "config_stripe_keys");
        const querySnapshot = await getDocs(configCollection);

        const docs = querySnapshot.docs;
        setDocumentRefs(docs); // Store all document references for later updating

        if (docs.length > 0) {
          // Load form data based on environment: test (docs[0]) or live (docs[1])
          const configData =
            environment === "test" ? docs[0].data() : docs[1]?.data();
          setFormData({
            stripe_Publishable_Key: configData?.stripe_Publishable_Key || "",
            stripe_Secret_Key: configData?.stripe_Secret_Key || "",
            stripe_Webhook_Secret: configData?.stripe_Webhook_Secret || "",
            currency: configData?.currency || "USD",
          });
        }
      } catch (error) {
        showToast("Error fetching Stripe configurations.", "error", 5000);
        console.error("Error fetching Stripe configs:", error);
      }
    };

    fetchStripeConfigs();
  }, [environment]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    try {
      // Determine the correct document to update
      const docToUpdate =
        environment === "test" ? documentRefs[0] : documentRefs[1];
      if (docToUpdate) {
        await setDoc(doc(firestore, "config_stripe_keys", docToUpdate.id), {
          ...formData,
          environment,
        });
        showToast("Keys updated successfully", "success", 2000);

        // Reset formData after successful update
        setFormData({
          stripe_Publishable_Key: "",
          stripe_Secret_Key: "",
          stripe_Webhook_Secret: "",
        });
      } else {
        showToast("No document found to update", "error", 2000);
      }
    } catch (error) {
      showToast("Failed to update keys", "error", 2000);
      console.error("Error updating keys:", error);
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
              DashboardPageInfo={"Stripe Keys Management"}
              icons={<FaUser size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">Stripe Keys Management</h2>
              </div>
              <div className="p-5">
                <form
                  onSubmit={handleFormSubmit}
                  className="flex flex-col gap-2"
                >
                  <div>
                    <label
                      htmlFor="stripe-environment"
                      className="heading-text text-[13px]"
                    >
                      Set Payment Mode
                    </label>
                    <select
                      name="stripe-environment"
                      id="stripe-environment"
                      value={environment}
                      onChange={handleEnvironmentChange}
                      className="outline-none border px-2 mt-1 py-2 w-full rounded"
                    >
                      <option value="test">Test</option>
                      <option value="live">Live</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="currency"
                      className="heading-text text-[13px]"
                    >
                      Select Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleCurrencyChange}
                      className="outline-none border px-2 mt-1 py-2 w-full rounded"
                    >
                      {stripeCurrencies.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="stripe_Publishable_Key"
                      className="heading-text text-[13px]"
                    >
                      Publishable Key*
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="stripe_Publishable_Key"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.stripe_Publishable_Key}
                      placeholder={
                        environment === "test"
                          ? "Enter Test Publishable Key."
                          : "Enter Live Publishable Key."
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="stripe_Secret_Key"
                      className="heading-text text-[13px]"
                    >
                      Secret Key*
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="stripe_Secret_Key"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.stripe_Secret_Key}
                      placeholder={
                        environment === "test"
                          ? "Enter Test Secret Key."
                          : "Enter Live Secret Key."
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="stripe_Webhook_Secret"
                      className="heading-text text-[13px]"
                    >
                      Webhook Secret*
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="stripe_Webhook_Secret"
                      className="outline-none mt-1 border px-2 py-2 w-full rounded"
                      value={formData.stripe_Webhook_Secret}
                      placeholder={
                        environment === "test"
                          ? "Enter Test Webhook Signing Secret."
                          : "Enter Live Webhook Signing Secret."
                      }
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

export default StripeConfigManagement;
