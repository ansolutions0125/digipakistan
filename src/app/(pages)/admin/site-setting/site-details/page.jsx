"use client";
import React, { useEffect, useState } from "react";
import { firestore } from "../../../../../Backend/Firebase";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../../../../components/AdminDashboard/Sidebar";
import DashboardNavbar from "../../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../../components/AdminDashboard/DashboardPageInfo";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";
import { IoSettings } from "react-icons/io5";

// Helper function for validating URLs
const isValidURL = (url) => {
  const re = /^(https?:\/\/)?([\w\d\-]+\.)+[\w\-]{2,}(\/.*)?$/i;
  return re.test(url);
};

// Helper function for validating email format
const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
};

// Helper function for validating phone number
const isValidPhone = (phone) => {
  const re = /^[0-9]{11}$/;
  return re.test(phone);
};

const AddOrUpdateSiteDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [seoKeywords, setSeoKeywords] = useState("");
  const [siteDetails, setSiteDetails] = useState({
    siteName: "",
    tagline: "",
    email: "",
    phoneNumber: "",
    address: "",
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    seoKeywords: [],
    twitter:""
  });
  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
    address: "",
    siteName: "",
    tagline: "",
    socialLinks: "",
  });

  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
    duration: 5000,
  });

  // Toast Notification
  const showToast = (message, type = "info", duration = 5000) => {
    setToast({ message, type, visible: true, duration });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  // Fetch current site details if any (for updating)
  const fetchSiteDetails = async () => {
    const docRef = doc(firestore, "site_details", "siteDetailsId"); // Replace "siteDetailsId" with actual document ID if exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSiteDetails(docSnap.data());
    } else {
      showToast("No site details found", "warning");
    }
  };

  useEffect(() => {
    fetchSiteDetails();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      email: "",
      phoneNumber: "",
      address: "",
      siteName: "",
      tagline: "",
      socialLinks: "",
    });

    // Validate form fields
    let formValid = true;
    const newErrors = { ...errors };

    if (!siteDetails.siteName) {
      formValid = false;
      newErrors.siteName = "Site name is required.";
    }
    if (!siteDetails.tagline) {
      formValid = false;
      newErrors.tagline = "Tagline is required.";
    }
    if (!siteDetails.email || !isValidEmail(siteDetails.email)) {
      formValid = false;
      newErrors.email = "Please enter a valid email address.";
    }
    if (!siteDetails.phoneNumber || !isValidPhone(siteDetails.phoneNumber)) {
      formValid = false;
      newErrors.phoneNumber = "Please enter a valid phone number (11 digits).";
    }
    if (!siteDetails.address) {
      formValid = false;
      newErrors.address = "Address is required.";
    }

    const socialLinks = [
      siteDetails.facebook,
      siteDetails.instagram,
      siteDetails.linkedin,
      siteDetails.youtube,
      siteDetails.twitter
    ];

    if (socialLinks.some((link) => link && !isValidURL(link))) {
      formValid = false;
      newErrors.socialLinks = "All social media links must be valid URLs.";
    }

    if (!formValid) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      const docRef = doc(firestore, "site_details", "siteDetailsId"); // Example of adding/updating site details
      await setDoc(docRef, {
        ...siteDetails,
        updated_at: serverTimestamp(),
      });
      showToast("Site details saved successfully", "success", 2000);
    } catch (error) {
      console.error(error);
      showToast("Failed to save site details", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const addSEOKeyWords = () => {
    if (seoKeywords.trim()) {
      setSiteDetails((prevData) => {
        // Ensure seoKeywords is an array before spreading
        const updatedKeywords = Array.isArray(prevData.seoKeywords)
          ? [...prevData.seoKeywords, seoKeywords.trim()]
          : [seoKeywords.trim()];
        return { ...prevData, seoKeywords: updatedKeywords };
      });
      setSeoKeywords(""); // Clear the input after adding
    }
  };

  const removeSEOKeyWords = (index) => {
    setSiteDetails((prevData) => {
      const updatedKeywords = Array.isArray(prevData.seoKeywords)
        ? prevData.seoKeywords.filter((_, i) => i !== index)
        : [];
      return { ...prevData, seoKeywords: updatedKeywords };
    });
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
          <div className="px-10 py-12">
            <DashboardPageInfo
              DashboardPageInfo={"Add or Update Site Details"}
              icons={<IoSettings size={20} />}
            />
            <div className="flex mt-10 justify-center">
              <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
                <form>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Site Name
                    </label>
                    <input
                      type="text"
                      name="siteName"
                      value={siteDetails.siteName}
                      onChange={(e) =>
                        setSiteDetails({
                          ...siteDetails,
                          siteName: e.target.value,
                        })
                      }
                      className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.siteName && (
                      <p className="text-sm text-red-600">{errors.siteName}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Tagline
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      value={siteDetails.tagline}
                      onChange={(e) =>
                        setSiteDetails({
                          ...siteDetails,
                          tagline: e.target.value,
                        })
                      }
                      className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.tagline && (
                      <p className="text-sm text-red-600">{errors.tagline}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={siteDetails.email}
                      onChange={(e) =>
                        setSiteDetails({
                          ...siteDetails,
                          email: e.target.value,
                        })
                      }
                      className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={siteDetails.phoneNumber}
                      onChange={(e) =>
                        setSiteDetails({
                          ...siteDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-600">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={siteDetails.address}
                      onChange={(e) =>
                        setSiteDetails({
                          ...siteDetails,
                          address: e.target.value,
                        })
                      }
                      rows="3"
                      className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>

                  {/* Social Media Links */}
                  {["facebook", "instagram", "linkedin", "youtube","twitter"].map(
                    (platform) => (
                      <div key={platform} className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {platform} Link
                        </label>
                        <input
                          type="url"
                          name={platform}
                          value={siteDetails[platform]}
                          onChange={(e) =>
                            setSiteDetails({
                              ...siteDetails,
                              [platform]: e.target.value,
                            })
                          }
                          className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )
                  )}

                  <label>Add SEO Keywords*</label>
                  <div className="flex mb-3">
                    <input
                      type="text"
                      value={seoKeywords} // Bind to individual keyword state
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="Add a SEO Keyword"
                      className="w-full p-2 border rounded-l outline-none"
                    />
                    <button
                      type="button" // Use button type to prevent form submission
                      onClick={addSEOKeyWords}
                      className="bg-primary text-white px-4 rounded-r"
                    >
                      Add
                    </button>
                  </div>
                  {Array.isArray(siteDetails.seoKeywords) &&
                    siteDetails.seoKeywords.length > 0 && (
                      <ul className="list-none grid grid-cols-5 gap-4 p-5 rounded border bg-gray-50">
                      {siteDetails.seoKeywords.map((keyword, index) => (
                        <li
                          key={index}
                          className="flex flex-col justify-between items-center p-3 bg-white shadow rounded-lg text-center"
                        >
                          <span className="text-gray-800 font-medium mb-2">{keyword}</span>
                          <button
                            type="button"
                            onClick={() => removeSEOKeyWords(index)}
                            className="text-red-600 text-xs hover:text-red-800"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                    
                    )}

                  {errors.socialLinks && (
                    <p className="text-sm text-red-600">{errors.socialLinks}</p>
                  )}

                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full py-3 mt-4 text-white font-semibold rounded-md ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isLoading ? "Saving..." : "Save Details"}
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

export default AddOrUpdateSiteDetails;
