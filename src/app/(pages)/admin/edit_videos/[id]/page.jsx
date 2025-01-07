"use client";
import React, { useState, use, useEffect } from "react";
import Sidebar from "../../../../../components/AdminDashboard/Sidebar";
import { MdDelete, MdReportGmailerrorred } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firestore, storage } from "../../../../../Backend/Firebase";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";
import { getSingleVideo } from "@/Backend/firebasefunctions";

const AddCourse = ({ params }) => {
  const id = params.id;
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

  const [step, setStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [
    uploadProgressExamCertificateLogo,
    setUploadProgressExamCertificateLogo,
  ] = useState(0);

  const [formData, setFormData] = useState({
    video_title: "",
    video_vimeoId: "",
    video_thumbnail: "",
    video_description: "",
  });

  const [videos, setVideos] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const data = await getSingleVideo(id);
      setVideos(data.data);
      setFormData({
        video_title: data.data.video_title || "",
        video_vimeoId: data.data.video_vimeoId || "",
        video_thumbnail: data.data.video_thumbnail || "",
        video_description: data.data.video_description || "",
      });
    };
    fetchVideo();
  }, []);

  const [errors, setErrors] = useState({});
  const [showfileData, setShowfileData] = useState({
    courseThumbnail: "",
    examCertificateInPicture: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "coursePrice" || name === "courseEnrollments"
          ? Number(value)
          : value,
    }));
  };

  // Validation for each step
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.video_title)
        newErrors.video_title = "Video title is required.";
      if (!formData.video_vimeoId)
        newErrors.video_vimeoId = "Video id is required.";
      if (!formData.video_description)
        newErrors.video_description = "Video description is required.";
    } else if (step === 2) {
      if (!formData.video_thumbnail)
        newErrors.video_thumbnail = "Video media is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        console.log("Updating Video Data:", formData);

        // Update the document in Firestore
        const docRef = doc(firestore, "site_videos", id);
        await updateDoc(docRef, {
          ...formData,
          updated_at: serverTimestamp(),
        });

        showToast(`Video has been updated successfully.`, "info", 2000);

        setFormData({
          video_title: "",
          video_vimeoId: "",
          video_thumbnail: "",
          video_description: "",
        });
      } catch (error) {
        console.error("Error updating document:", error);
        showToast(
          `Failed to update the video. Please try again.`,
          "error",
          3000
        );
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Set file details in showfileData for preview
      setShowfileData((prev) => ({
        ...prev,
        video_thumbnail: file,
      }));

      // Check if the file size exceeds 3MB
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          video_thumbnail: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          video_thumbnail: "", // Clear the file if it's too large
        }));
        return;
      }

      // Clear previous errors if the file is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        video_thumbnail: "",
      }));

      // Reference for Firebase storage
      const storageRef = ref(storage, `video_thumbnail/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgressExamCertificateLogo(progress); // Update progress in state
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          // Upload complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            video_thumbnail: downloadURL, // Set URL in formData after upload
          }));
        }
      );
    }
  };

  // Navbar step navigation
  const goToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  console.log(formData);

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
            <h2 className="text-2xl font-bold mb-4 heading-text">Edit Video</h2>

            {/* Navbar for Steps */}
            <div className="flex justify-evenly mb-5 border-b pb-2">
              {["Video Content", "Video Media", "Video Submition"].map(
                (title, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index + 1)}
                    className={`pb-1 px-2 font-semibold ${
                      step === index + 1
                        ? "border-b-2 border-primary text-primary"
                        : "text-gray-500"
                    }`}
                  >
                    {title}
                  </button>
                )
              )}
            </div>

            {/* Step Content */}
            <div className="stepper-content px-10">
              {step === 1 && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label>Video Title*</label>
                    <input
                      type="text"
                      name="video_title"
                      value={formData.video_title}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    />
                    {errors.video_title && (
                      <p className="text-red-500 text-sm">
                        {errors.video_title}
                      </p>
                    )}
                  </div>
                  <div>
                    <label>Video Id*</label>
                    <input
                      type="text"
                      name="video_vimeoId"
                      value={formData.video_vimeoId}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    />
                    {errors.video_vimeoId && (
                      <p className="text-red-500 text-sm">
                        {errors.video_vimeoId}
                      </p>
                    )}
                  </div>
                  <div>
                    <label>Video Description*</label>
                    <input
                      type="text"
                      name="video_description"
                      value={formData.video_description}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    />
                    {errors.video_description && (
                      <p className="text-red-500 text-sm">
                        {errors.video_description}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Upload a course Thumbnail
                    </label>
                    <input
                      type="file"
                      accept=".jpg, .png, .pdf"
                      id="courseThumbnail"
                      name="courseThumbnail"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="courseThumbnail"
                      className="flex flex-col gap-2 items-center bg-primary/30 mt-5 rounded-md hover:bg-primary/20 cursor-pointer duration-500 justify-center py-10"
                    >
                      <IoCloudUploadOutline
                        size={40}
                        className="text-gray-500"
                      />
                      <h2 className="text-black text-center text-[1.1rem] font-medium">
                        Click to select or drag and drop your file here.
                      </h2>
                      <h6 className="text-[0.9rem]">
                        Accepted formats: jpg, png, pdf
                      </h6>
                      <p className="text-[0.8rem]">Max Size: 1MB</p>
                    </label>

                    {errors.courseThumbnail && (
                      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <h6>
                          <MdReportGmailerrorred />
                        </h6>
                        <span>{errors.courseThumbnail}</span>
                      </div>
                    )}
                    {uploadProgress !== 0 && (
                      <h5 className="mt-4">Uploading {uploadProgress}%</h5>
                    )}
                    {formData.courseThumbnail && (
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
                                  src={formData.courseThumbnail}
                                  alt="courseThumbnail"
                                  className="w-[50px] h-[50px] object-cover"
                                />
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.courseThumbnail.name}
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.courseThumbnail.size} bytes
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.courseThumbnail.type}
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
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="py-10 flex justify-center flex-col items-center">
                  <h1 className="text-4xl">Thank you</h1>
                  <p>Click on the sumbit button to submit this video.</p>
                </div>
              )}
            </div>

            <div className="stepper-buttons flex justify-center gap-3 mt-3">
              {step > 1 && (
                <button
                  onClick={handlePrevious}
                  className="bg-slate-300 hover:bg-primary/90 duration-200 text-white px-4 py-2 rounded"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="bg-primary/70 hover:bg-primary/90 duration-200 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default AddCourse;
