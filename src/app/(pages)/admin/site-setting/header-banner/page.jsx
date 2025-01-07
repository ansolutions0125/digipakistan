"use client";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { firestore, storage } from "../../../../../Backend/Firebase";
import Sidebar from "../../../../../components/AdminDashboard/Sidebar";
import { IoCloudUploadOutline } from "react-icons/io5";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { MdDelete, MdReportGmailerrorred } from "react-icons/md";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";
import CustomToast from "@/components/CoustomToast/CoustomToast";

const AddBanner = () => {
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

  const [formData, setFormData] = useState({
    site_header_banners: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  const [errors, setErrors] = useState({});
  const [showfileData, setShowfileData] = useState({
    site_header_banners: "",
    banner_status: "show",
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Set file details in showfileData for preview
      setShowfileData((prev) => ({
        ...prev,
        site_header_banners: file,
      }));

      // Check if the file size exceeds 3MB
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          site_header_banners: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          site_header_banners: "", // Clear the file if it's too large
        }));
        return;
      }

      // Clear previous errors if the file is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        site_header_banners: "",
      }));

      // Reference for Firebase storage
      // const storageRef = ref(storage, `site_header_banners/${file.name}`);
      // const uploadTask = uploadBytesResumable(storageRef, file);

      // // Track upload progress
      // uploadTask.on(
      //   "state_changed",
      //   (snapshot) => {
      //     const progress = Math.round(
      //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      //     );
      //     setUploadProgress(progress); // Update progress in state
      //   },
      //   (error) => {
      //     console.error("Upload failed:", error);
      //   },
      //   async () => {
      //     // Upload complete
      //     const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      //     setFormData((prev) => ({
      //       ...prev,
      //       site_header_banners: downloadURL, // Set URL in formData after upload
      //     }));
      //   }
      // );
      const imageURL = await uploadToCloudinary(file);
      setFormData((prev)=>({...prev,site_header_banners:imageURL}));

    }
  };

// Handle File upload ***************************************************************

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
  formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.log(error.message);
  }
};

// Handle file upload ***************************************************************



  const handleAddButton = async () => {
    try {
      await addDoc(collection(firestore, "site_header_banners_data"), {
        ...formData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        banner_status: "show",
      });

      // Show success toast
      showToast("Banner Successfully Added.", "success", 2000);

      setFormData({
        site_header_banners: "",
      });

      setShowfileData({
        site_header_banners: "",
      });

      // Optional delay or additional navigation logic
      setTimeout(() => {
        // Add any navigation or additional actions here if needed
      }, 1000); // Example delay to allow toast display
    } catch (error) {
      console.error("Error adding banner: ", error);
      showToast("Failed to add banner. Please try again.","error",2000);
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
        <div className="w-full">
          <div className="p-10">
            <div className="max-w-4xl mx-auto mt-10 p-5 border rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 heading-text">
                Add New Header Banner
              </h2>
              <div>
                <label className="block mb-1 font-medium">
                  Upload a course Thumbnail
                </label>
                <input
                  type="file"
                  accept=".jpg, .png, .pdf"
                  id="site_Header_banners"
                  name="site_Header_banners"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="site_Header_banners"
                  className="flex flex-col gap-2 items-center bg-primary/30 mt-5 rounded-md hover:bg-primary/20 cursor-pointer duration-500 justify-center py-10"
                >
                  <IoCloudUploadOutline size={40} className="text-gray-500" />
                  <h2 className="text-black text-center text-[1.1rem] font-medium">
                    Click to select or drag and drop your file here.
                  </h2>
                  <h6 className="text-[0.9rem]">
                    Accepted formats: jpg, png, pdf
                  </h6>
                  <p className="text-[0.8rem]">Max Size: 1MB</p>
                </label>

                {errors.site_header_banners && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <h6>
                      <MdReportGmailerrorred />
                    </h6>
                    <span>{errors.site_header_banners}</span>
                  </div>
                )}
                {uploadProgress !== 0 && (
                  <h5 className="mt-4">Uploading {uploadProgress}%</h5>
                )}
                {formData.site_header_banners && (
                  <div className="w-full border mt-5 rounded-md overflow-y-hidden lg:overflow-x-hidden overflow-x-scroll">
                    <table className="w-full table-auto ">
                      <thead>
                        <tr className="text-left border border-gray-200">
                          <th className="px-4 py-2">Preview Image</th>
                          <th className="px-4 py-2">Name</th>
                          <th className="px-4 py-2">Size</th>
                          <th className="px-4 py-2">Type</th>
                          <th className="px-4 py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2">
                            <img
                              src={formData.site_header_banners}
                              alt="site_header_banners"
                              className="w-[50px] h-[50px] object-cover"
                            />
                          </td>
                          <td className="border px-4 py-2 truncate">
                            {showfileData.site_header_banners.name}
                          </td>
                          <td className="border px-4 py-2 truncate">
                            {showfileData.site_header_banners.size} bytes
                          </td>
                          <td className="border px-4 py-2 truncate">
                            {showfileData.site_header_banners.type}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            <button
                              onClick={() => deletefromFORMDATA()}
                              className="text-red-500 hover:text-red-700"
                            >
                              <MdDelete />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                <button
                  onClick={handleAddButton}
                  disabled={!showfileData}
                  className="mt-3 py-2 px-4 bg-primary text-white rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default AddBanner;
