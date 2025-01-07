"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/AdminDashboard/Sidebar";
import { MdDelete, MdReportGmailerrorred } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firestore, storage } from "../../../../Backend/Firebase";
import { IoMdClose } from "react-icons/io";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { getAllCourses } from "../../../../Backend/firebasefunctions";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const AddCourseBundle = () => {
  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  useEffect(() => {
    const getallCourses = async () => {
      const allcourses = await getAllCourses();
      setCourses(allcourses.data);
      setAvailableCourses(allcourses.data);
      setFilteredCourses(allcourses.data);
    };
    getallCourses();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCourses(availableCourses);
    } else {
      setFilteredCourses(
        availableCourses.filter((course) =>
          course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, availableCourses]);

  const [step, setStep] = useState(1);
  const [learningPoint, setLearningPoint] = useState("");
  const [whoisthecoursefor, setWhoisthecoursefor] = useState("");
  const [examinformation, setExaminformation] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressExamPicture, setUploadProgressExamPicture] = useState(0);
  const [errors, setErrors] = useState({});
  const [showfileData, setShowfileData] = useState({
    courseBundleThumbnail: "",
    examCertificatePicture: "",
  });
  const [formData, setFormData] = useState({
    courseBundleTitle: "",
    courseBundleLongDescription: "",
    courseBundleShortDescription: "",
    courseBundleId: "",
    courseBundleCategory: "beginner",
    courseBundlePrice: 0,
    whatyouwillLearn: [],
    whoisthecoursefor: [],
    courseBundleThumbnail: "",
    seoDescription: "",
    selectedCourses: [],
    seoKeywords: [],
    examinformation: [],
    examCertificatePicture: "",
    videoMedium: "Urdu & English",
    batchDuration: "2 to 4 Months",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "courseBundlePrice" || name === "courseEnrollments"
          ? Number(value)
          : value,
    }));
  };

  // Validation for each step
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.courseTitle)
        newErrors.courseTitle = "Course title is required.";
      if (!formData.courseBundleLongDescription)
        newErrors.courseBundleLongDescription =
          "Course description is required.";
      if (!formData.courseBundleShortDescription)
        newErrors.courseBundleShortDescription =
          "Course description is required.";
      if (!formData.courseId)
        newErrors.courseId = "Course description is required.";
      if (!formData.coursePrice)
        newErrors.coursePrice = "Course description is required.";
      if (formData.whoisthecoursefor.length > 0) {
        newErrors.whoisthecoursefor = "Please add 1 point atleast";
      }
      if (formData.whatyouwillLearn.length > 0) {
        newErrors.whatyouwillLearn = "Please add 1 point atleast";
      }
    } else if (step === 2) {
      if (!formData.courseBundleThumbnail)
        newErrors.courseBundleThumbnail = "Course media is required.";
    } else if (step === 3) {
      if (!formData.seoKeywords)
        newErrors.seoKeywords = "Please add atleat 1 keyword";
      if (!formData.seoDescription)
        newErrors.seoDescription = "Please add a description for SEO";
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
      console.log("Course Data Submitted:", formData);
      // Submit the form data to backend or database

      await setDoc(doc(firestore, "courses_bundle", formData.courseBundleId), {
        ...formData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      toast.success("Course has been added successfuly", {
        position: "top-right",
        autoClose: 20000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setShowfileData({ courseBundleThumbnail: "" });
      setFilteredCourses([]);
      setSelectedCourses([]);
      setFormData({
        courseBundleTitle: "",
        courseBundleLongDescription: "",
        courseBundleShortDescription: "",
        courseBundleId: "",
        courseBundleCategory: "beginner",
        courseBundlePrice: 0,
        whatyouwillLearn: [],
        whoisthecoursefor: [],
        courseBundleThumbnail: "",
        BundleExamThumbnail: "",
        seoDescription: "",
        selectedCourses: [],
        seoKeywords: [],
        examinformation: [],
        videoMedium: "Urdu & English",
        batchDuration: "2 to 4 Months",
      });
    }
  };

  // Navbar step navigation
  const goToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const addLearningPoint = () => {
    if (learningPoint.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        whatyouwillLearn: [...prevData.whatyouwillLearn, learningPoint],
      }));
      setLearningPoint(""); // Clear the input after adding
    }
  };

  const removeLearningPoint = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      whatyouwillLearn: prevData.whatyouwillLearn.filter((_, i) => i !== index),
    }));
  };

  const addWhoisThisCourseforPoint = () => {
    if (whoisthecoursefor.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        whoisthecoursefor: [...prevData.whoisthecoursefor, whoisthecoursefor],
      }));
      setWhoisthecoursefor(""); // Clear the input after adding
    }
  };

  const removeWhoisThisCourseforPoint = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      whoisthecoursefor: prevData.whoisthecoursefor.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addexamInformation = () => {
    if (examinformation.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        examinformation: [...prevData.examinformation, examinformation],
      }));
      setExaminformation(""); // Clear the input after adding
    }
  };

  const removeexamInformation = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      examinformation: prevData.examinformation.filter((_, i) => i !== index),
    }));
  };

  const addSEOKeyWords = () => {
    if (seoKeywords.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        seoKeywords: [...prevData.seoKeywords, seoKeywords],
      }));
      setSeoKeywords(""); // Clear the input after adding
    }
  };

  const removeSEOKeyWords = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      seoKeywords: prevData.seoKeywords.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Set file details in showfileData for preview
      setShowfileData((prev) => ({
        ...prev,
        courseBundleThumbnail: file,
      }));

      // Check if the file size exceeds 3MB
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          courseBundleThumbnail: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          courseBundleThumbnail: "", // Clear the file if it's too large
        }));
        return;
      }

      // Clear previous errors if the file is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        courseBundleThumbnail: "",
      }));

      // Reference for Firebase storage
      const storageRef = ref(storage, `courseBundleThumbnail/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress); // Update progress in state
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          // Upload complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            courseBundleThumbnail: downloadURL, // Set URL in formData after upload
          }));
        }
      );
    }
  };
  const handleFileChangeExamPic = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Set file details in showfileData for preview
      setShowfileData((prev) => ({
        ...prev,
        examCertificatePicture: file,
      }));

      // Check if the file size exceeds 3MB
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          examCertificatePicture: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          examCertificatePicture: "", // Clear the file if it's too large
        }));
        return;
      }

      // Clear previous errors if the file is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        examCertificatePicture: "",
      }));

      // Reference for Firebase storage
      const storageRef = ref(storage, `examCertificatePicture/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgressExamPicture(progress); // Update progress in state
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          // Upload complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            examCertificatePicture: downloadURL, // Set URL in formData after upload
          }));
        }
      );
    }
  };

  const deletefromFORMDATA = () => {
    setFormData((prev) => ({
      ...prev,
      courseBundleThumbnail: null, // Clear file if invalid
    }));
    setUploadProgress(0);
  };

  const deletefromFORMDATA2 = () => {
    setFormData((prev) => ({
      ...prev,
      examCertificatePicture: null, // Clear file if invalid
    }));
    setUploadProgressExamPicture(0);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCourses(availableCourses);
    } else {
      setFilteredCourses(
        availableCourses.filter((course) =>
          course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, availableCourses]);

  const handleSelectCourse = (course) => {
    setSelectedCourses([...selectedCourses, course]);
    setAvailableCourses(
      availableCourses.filter((c) => c.courseTitle !== course.courseTitle)
    );
    setFormData((prevData) => ({
      ...prevData,
      selectedCourses: [...prevData.selectedCourses, course],
    }));
    setSearchTerm("");
  };

  const handleRemove = (courseTitle) => {
    const updatedSelectedCourses = selectedCourses.filter(
      (course) => course.courseTitle !== courseTitle
    );
    const removedCourse = courses.find(
      (course) => course.courseTitle === courseTitle
    );
    setSelectedCourses(updatedSelectedCourses);
    setAvailableCourses([...availableCourses, removedCourse]);
    setFormData((prevData) => ({
      ...prevData,
      selectedCourses: updatedSelectedCourses,
    }));
  };

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        <ToastContainer />
        <Sidebar />
        <div className="w-full">
          <div className="p-10">
            <div className="max-w-4xl mx-auto mt-10 p-5 border rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 heading-text">
                Add Course Bundle
              </h2>

              {/* Navbar for Steps */}
              <div className="flex justify-between mb-5 border-b pb-2">
                {[
                  "Course Bundle Content",
                  "Course Bundle Media",
                  "Course Bundle SEO",
                ].map((title, index) => (
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
                ))}
              </div>

              {/* Step Content */}
              <div className="stepper-content">
                {step === 1 && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label>Courses Bundle Title*</label>
                      <input
                        type="text"
                        name="courseBundleTitle"
                        value={formData.courseBundleTitle}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                      />
                      {errors.courseBundleTitle && (
                        <p className="text-red-500 text-sm">
                          {errors.courseBundleTitle}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Courses Bundle Id*</label>
                      <input
                        type="text"
                        name="courseBundleId"
                        value={formData.courseBundleId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                      />
                      {errors.courseBundleId && (
                        <p className="text-red-500 text-sm">
                          {errors.courseBundleId}
                        </p>
                      )}
                    </div>
                    <div className="stepper-content">
                      <div className="flex flex-col gap-2">
                        <div>
                          <label>Add Course To Bundle</label>
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search courses"
                            className="block w-full p-2 border rounded mt-1  outline-none"
                          />
                          {searchTerm && filteredCourses.length > 0 && (
                            <div className="bg-white border rounded shadow-md max-h-48 overflow-y-auto mt-1">
                              {filteredCourses.map((course, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => handleSelectCourse(course)}
                                  className="p-2 hover:bg-gray-200 cursor-pointer"
                                >
                                  {course.courseTitle}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="selected-courses mb-3">
                          {selectedCourses.map((course, idx) => (
                            <div
                              key={idx}
                              className="selected-course-item bg-red-200 my-1 p-2 rounded-md flex justify-between items-center"
                            >
                              <span>{course.courseTitle}</span>
                              <button
                                onClick={() => handleRemove(course.courseTitle)}
                                className="text-red-500 ml-2"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label>Add Bundle Price*</label>
                      <input
                        className="block w-full p-2 border rounded mt-1 mb-3 outline-none"
                        name="courseBundlePrice"
                        id="courseBundlePrice"
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label>Batch Duration*</label>
                      <input
                        className="block w-full p-2 border rounded mt-1 mb-3 outline-none"
                        name="batchDuration"
                        id="batchDuration"
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label>Video Medium*</label>
                      <input
                        className="block w-full p-2 border rounded mt-1 mb-3 outline-none"
                        name="videoMedium"
                        id="videoMedium"
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      {" "}
                      <label>Course Short Description*</label>
                      <textarea
                        name="courseBundleShortDescription"
                        value={formData.courseBundleShortDescription}
                        onChange={handleChange}
                        className="w-full p-2 border h-[100px] resize-none rounded mt-1 mb-3"
                      />
                      {errors.courseBundleShortDescription && (
                        <p className="text-red-500 text-sm">
                          {errors.courseBundleShortDescription}
                        </p>
                      )}
                    </div>

                    <div>
                      <label>Course Long Description*</label>
                      <textarea
                        name="courseBundleLongDescription"
                        value={formData.courseBundleLongDescription}
                        onChange={handleChange}
                        className="w-full p-2 border h-[200px] resize-none rounded mt-1 mb-3"
                      />
                      {errors.courseBundleLongDescription && (
                        <p className="text-red-500 text-sm">
                          {errors.courseBundleLongDescription}
                        </p>
                      )}
                    </div>

                    <div>
                      <label>What You Will Learn</label>
                      <div className="flex mb-3">
                        <input
                          type="text"
                          value={learningPoint}
                          onChange={(e) => setLearningPoint(e.target.value)}
                          placeholder="Add a learning point"
                          className="w-full p-2 border rounded-l outline-none"
                        />
                        <button
                          onClick={addLearningPoint}
                          className="bg-primary text-white px-4 rounded-r"
                        >
                          Add
                        </button>
                      </div>
                      <ul className="list-disc ml-6">
                        {formData.whatyouwillLearn.map((point, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center mb-2"
                          >
                            <span>{point}</span>
                            <button
                              onClick={() => removeLearningPoint(index)}
                              className="text-red-500 text-sm"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <label>Who is this course for*</label>
                      <div className="flex mb-3">
                        <input
                          type="text"
                          value={whoisthecoursefor}
                          onChange={(e) => setWhoisthecoursefor(e.target.value)}
                          placeholder="Add a who is this course for point"
                          className="w-full p-2 border rounded-l outline-none"
                        />
                        <button
                          onClick={addWhoisThisCourseforPoint}
                          className="bg-primary text-white px-4 rounded-r"
                        >
                          Add
                        </button>
                      </div>
                      <ul className="list-disc ml-6">
                        {formData.whoisthecoursefor.map((point, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center mb-2"
                          >
                            <span>{point}</span>
                            <button
                              onClick={() =>
                                removeWhoisThisCourseforPoint(index)
                              }
                              className="text-red-500 text-sm"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <label>Exam Information*</label>
                      <div className="flex mb-3">
                        <input
                          type="text"
                          value={examinformation}
                          onChange={(e) => setExaminformation(e.target.value)}
                          placeholder="Add a exam point"
                          className="w-full p-2 border rounded-l outline-none"
                        />
                        <button
                          onClick={addexamInformation}
                          className="bg-primary text-white px-4 rounded-r"
                        >
                          Add
                        </button>
                      </div>
                      <ul className="list-disc ml-6">
                        {formData.examinformation.map((point, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center mb-2"
                          >
                            <span>{point}</span>
                            <button
                              onClick={() => removeexamInformation(index)}
                              className="text-red-500 text-sm"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
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
                        id="courseBundleThumbnail"
                        name="courseBundleThumbnail"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="courseBundleThumbnail"
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

                      {errors.courseBundleThumbnail && (
                        <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <h6>
                            <MdReportGmailerrorred />
                          </h6>
                          <span>{errors.courseBundleThumbnail}</span>
                        </div>
                      )}
                      {uploadProgress !== 0 && (
                        <h5 className="mt-4">Uploading {uploadProgress}%</h5>
                      )}
                      {formData.courseBundleThumbnail && (
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
                                    src={formData.courseBundleThumbnail}
                                    alt="courseBundleThumbnail"
                                    className="w-[50px] h-[50px] object-cover"
                                  />
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.courseBundleThumbnail.name}
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.courseBundleThumbnail.size}{" "}
                                  bytes
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.courseBundleThumbnail.type}
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
                    <div className="mt-5">
                      <label className="block mb-1 font-medium">
                        Upload a Exam Certificate Picture
                      </label>
                      <input
                        type="file"
                        accept=".jpg, .png, .pdf"
                        id="examCertificatePicture"
                        name="examCertificatePicture"
                        className="hidden"
                        onChange={handleFileChangeExamPic}
                      />
                      <label
                        htmlFor="examCertificatePicture"
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

                      {errors.courseBundleThumbnail && (
                        <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <h6>
                            <MdReportGmailerrorred />
                          </h6>
                          <span>{errors.courseBundleThumbnail}</span>
                        </div>
                      )}
                      {uploadProgressExamPicture !== 0 && (
                        <h5 className="mt-4">
                          Uploading {uploadProgressExamPicture}%
                        </h5>
                      )}
                      {formData.examCertificatePicture && (
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
                                    src={formData.examCertificatePicture}
                                    alt="examCertificatePicture"
                                    className="w-[50px] h-[50px] object-cover"
                                  />
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.examCertificatePicture.name}
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.examCertificatePicture.size}{" "}
                                  bytes
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.examCertificatePicture.type}
                                </td>
                                <td className="border px-4 py-2 text-center">
                                  <button
                                    onClick={() => deletefromFORMDATA2()}
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
                  <div>
                    <div>
                      <label>Add SEO Description*</label>
                      <div className="flex mb-3">
                        <input
                          type="text"
                          value={formData.seoDescription}
                          onChange={handleChange}
                          name="seoDescription"
                          placeholder="Enter a SEO Description"
                          className="w-full p-2 border rounded-l outline-none"
                        />
                      </div>
                      <label>Add SEO Keywords*</label>
                      <div className="flex mb-3">
                        <input
                          type="text"
                          value={seoKeywords}
                          onChange={(e) => setSeoKeywords(e.target.value)}
                          placeholder="Add a SEO Keyword"
                          className="w-full p-2 border rounded-l outline-none"
                        />
                        <button
                          onClick={addSEOKeyWords}
                          className="bg-primary text-white px-4 rounded-r"
                        >
                          Add
                        </button>
                      </div>
                      {formData.seoKeywords.length > 0 && (
                        <ul className="list-disc p-5 rounded border grid grid-cols-6 gap-5">
                          {formData.seoKeywords.map((point, index) => (
                            <li
                              key={index}
                              className="flex w-full justify-between text-white items-center bg-red-500 p-2 rounded"
                            >
                              <span>{point}</span>
                              <button
                                onClick={() => removeSEOKeyWords(index)}
                                className="text-white text-sm"
                              >
                                <IoMdClose />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Stepper Buttons */}
              <div className="stepper-buttons flex justify-between mt-5">
                {step > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Previous
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
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
      </div>
    </AdminProtectedRoutes>
  );
};

export default AddCourseBundle;
