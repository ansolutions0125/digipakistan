"use client";
import React, { useEffect, useState, use } from "react";
import Sidebar from "../../../../../components/AdminDashboard/Sidebar";
import { MdDelete, MdReportGmailerrorred } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { firestore, storage } from "../../../../../Backend/Firebase";
import { IoMdClose } from "react-icons/io";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import {
  getSingleCourseForUpdation,
  getSingleCourseForUser,
} from "../../../../../Backend/firebasefunctions";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const EditCourse = ({ params }) => {
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
  const unwrappedParams = use(params);

  const courseId = unwrappedParams.id;
  const [step, setStep] = useState(1);
  const [learningPoint, setLearningPoint] = useState("");
  const [whoisthecoursefor, setWhoisthecoursefor] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [course, setCourse] = useState(null);
  const [uploadProgressExamPicture, setUploadProgressExamPicture] = useState(0);
  const [
    uploadProgressExamCertificateLogo,
    setUploadProgressExamCertificateLogo,
  ] = useState(0);

  const [formData, setFormData] = useState({
    courseTitle: "",
    courseLongDescription: "",
    courseShortDescription: "",
    courseId: "",
    courseCategory: "",
    courseInstructor: "",
    coursePrice: 0,
    whatyouwillLearn: [],
    whoisthecoursefor: [],
    courseThumbnail: "",
    courseEnrollments: 0,
    seoDescription: "",
    seoKeywords: [],
    videoMedium: "Urdu & English",
    batchDuration: "2 to 4 Months",
    examCertificatePicture: "",
    examCertificateInPicture: "",
    instructorBrandLogo: "",
    courseStatus: "",
    courseCategoryId: "",
  });

  useEffect(() => {
    const courseFunction = async () => {
      const data = await getSingleCourseForUpdation(courseId);
      const courseData = data.data;

      setCourse(courseData);
      setFormData({
        courseTitle: courseData.courseTitle || "",
        courseLongDescription: courseData.courseLongDescription || "",
        courseShortDescription: courseData.courseShortDescription || "",
        courseId: courseData.courseId || "",
        courseCategory: courseData.courseCategory || "",
        coursePrice: courseData.coursePrice || 0,
        whatyouwillLearn: courseData.whatyouwillLearn || [],
        whoisthecoursefor: courseData.whoisthecoursefor || [],
        courseThumbnail: courseData.courseThumbnail || "",
        courseEnrollments: courseData.courseEnrollments || 0,
        seoDescription: courseData.seoDescription || "",
        seoKeywords: courseData.seoKeywords || [],
        videoMedium: courseData.videoMedium || "Urdu & English",
        batchDuration: courseData.batchDuration || "2 to 4 Months",
        examCertificatePicture: courseData.examCertificatePicture || "",
        examCertificateInPicture: courseData.examCertificateInPicture || "",
        courseInstructor: courseData.courseInstructor || "",
        instructorBrandLogo: courseData.instructorBrandLogo || "",
        courseStatus: courseData.courseStatus || "",
        courseCategoryId: courseData.courseCategoryId || "",
      });
    };
    courseFunction();
  }, [courseId]);

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

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.courseTitle)
        newErrors.courseTitle = "Course title is required.";
      if (!formData.courseLongDescription)
        newErrors.courseLongDescription = "Course description is required.";
      if (!formData.courseShortDescription)
        newErrors.courseShortDescription = "Course description is required.";
      if (!formData.courseId)
        newErrors.courseId = "Course description is required.";
      if (!formData.coursePrice)
        newErrors.coursePrice = "Course description is required.";
      if (formData.whoisthecoursefor.length === 0) {
        newErrors.whoisthecoursefor = "Please add at least 1 point.";
      }
      if (formData.whatyouwillLearn.length === 0) {
        newErrors.whatyouwillLearn = "Please add at least 1 point.";
      }
    } else if (step === 2) {
      if (!formData.courseThumbnail)
        newErrors.courseThumbnail = "Course media is required.";
    } else if (step === 3) {
      if (!formData.seoKeywords)
        newErrors.seoKeywords = "Please add at least 1 keyword.";
      if (!formData.seoDescription)
        newErrors.seoDescription = "Please add a description for SEO.";
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
        console.log("Course Data Submitted:", formData);
  
        // Update the course document in "courses" collection
        await updateDoc(doc(firestore, "courses", courseId), {
          ...formData,
          created_at: course?.created_at,
          updated_at: serverTimestamp(),
        });
  
        // Find the category document using courseCategoryId
        const categoryRef = doc(
          firestore,
          "certification_courses_category",
          formData.courseCategoryId // courseCategoryId from courseData
        );
  
        // Retrieve the current category data
        const categorySnap = await getDoc(categoryRef);
        if (categorySnap.exists()) {
          const categoryData = categorySnap.data();
  
          // Check if the course exists in the coursesInThisCertifications array
          const courseExists = categoryData.coursesInThisCertifications.some(
            (course) => course.courseId === formData.courseId
          );
  
          // Update or add the course in the array
          let updatedCourses;
          if (courseExists) {
            updatedCourses = categoryData.coursesInThisCertifications.map(
              (course) =>
                course.courseId === formData.courseId
                  ? { ...course, ...formData } // Update matching course
                  : course
            );
          } else {
            updatedCourses = [
              ...categoryData.coursesInThisCertifications,
              { ...formData }, // Add new course if it doesn't exist
            ];
          }
          
          // Write the updated array back to the Firestore
          await updateDoc(categoryRef, {
            coursesInThisCertifications: updatedCourses,
          });
          
  
          showToast(`Category updated successfully.`, "success", 2000);
        } else {
          showToast("Category not found.", "error", 5000);
        }
  
        showToast(`Course has been updated successfully.`, "success", 2000);
  
        // Reset the form data
        setFormData({
          courseTitle: "",
          courseLongDescription: "",
          courseShortDescription: "",
          courseId: "",
          courseCategoryId: "",
          coursePrice: 0,
          whatyouwillLearn: [],
          whoisthecoursefor: [],
          courseThumbnail: "",
          seoKeywords: [],
          videoMedium: "Urdu & English",
          batchDuration: "2 to 4 Months",
          examCertificateInPicture: "",
          examCertificatePicture: "",
          courseInstructor: "",
          courseEnrollments: 0,
          seoDescription: "",
          instructorBrandLogo: "",
        });
      } catch (error) {
        console.error("Error updating course:", error);
        showToast("An error occurred while updating the course.", "error", 5000);
      }
    }
  };

  const goToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const addLearningPoint = () => {
    if (learningPoint.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        whatyouwillLearn: [...prevData.whatyouwillLearn, learningPoint],
      }));
      setLearningPoint("");
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
      setWhoisthecoursefor("");
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

  const addSEOKeyWords = () => {
    if (seoKeywords.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        seoKeywords: [...prevData.seoKeywords, seoKeywords],
      }));
      setSeoKeywords("");
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

    let downloadURL = "";
    if (file) {
      setShowfileData((prev) => ({
        ...prev,
        courseThumbnail: file,
      }));
      const storageRef = ref(storage, `courseThumbnail/${file.name}`);
      await uploadBytes(storageRef, file);
      downloadURL = await getDownloadURL(storageRef);
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          courseThumbnail: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          courseThumbnail: "",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          courseThumbnail: "",
        }));
        setFormData((prev) => ({
          ...prev,
          courseThumbnail: downloadURL,
        }));
      }
    }
  };

  const handleFileChangeExamPic = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setShowfileData((prev) => ({
        ...prev,
        examCertificatePicture: file,
      }));

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

      setErrors((prevErrors) => ({
        ...prevErrors,
        examCertificatePicture: "",
      }));

      const storageRef = ref(storage, `examCertificatePicture/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgressExamPicture(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            examCertificatePicture: downloadURL,
          }));
        }
      );
    }
  };

  const handleFileChangeExamCertificateInPicture = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setShowfileData((prev) => ({
        ...prev,
        examCertificateInPicture: file,
      }));

      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          examCertificateInPicture: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          examCertificateInPicture: "",
        }));
        return;
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        examCertificateInPicture: "",
      }));

      const storageRef = ref(storage, `examCertificateInPicture/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgressExamCertificateLogo(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            examCertificateInPicture: downloadURL,
          }));
        }
      );
    }
  };

  const handleFileInstructorBrandLogo = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Set file details in showfileData for preview
      setShowfileData((prev) => ({
        ...prev,
        instructorBrandLogo: file,
      }));

      // Check if the file size exceeds 3MB
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          instructorBrandLogo: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          instructorBrandLogo: "", // Clear the file if it's too large
        }));
        return;
      }

      // Clear previous errors if the file is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        instructorBrandLogo: "",
      }));

      // Reference for Firebase storage
      const storageRef = ref(storage, `instructorBrandLogo/${file.name}`);
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
            instructorBrandLogo: downloadURL, // Set URL in formData after upload
          }));
        }
      );
    }
  };

  const toggleCourseStatus = () => {
    setFormData((prevData) => ({
      ...prevData,
      courseStatus: prevData.courseStatus === "active" ? "inactive" : "active",
    }));
  };

  console.log(formData);

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
          <div className="p-10">
            <div className="max-w-4xl mx-auto mt-10 p-5 border rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 heading-text">
                Edit Course
              </h2>

              {/* Navbar for Steps */}
              <div className="flex justify-between mb-5 border-b pb-2">
                {[
                  "Course Content",
                  "Course Media",
                  "Course SEO",
                  "Course Status",
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
                      <label>Course Title*</label>
                      <input
                        type="text"
                        name="courseTitle"
                        value={formData.courseTitle}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                      />
                      {errors.courseTitle && (
                        <p className="text-red-500 text-sm">
                          {errors.courseTitle}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Course Id*</label>
                      <input
                        type="text"
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                      />
                      {errors.courseId && (
                        <p className="text-red-500 text-sm">
                          {errors.courseId}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Course Instructor*</label>
                      <input
                        type="text"
                        name="courseInstructor"
                        value={formData.courseInstructor}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                      />
                      {errors.courseInstructor && (
                        <p className="text-red-500 text-sm">
                          {errors.courseInstructor}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Course Category*</label>
                      <select
                        className="block w-full p-2 border rounded mt-1 mb-3 outline-none"
                        name="courseCategory"
                        id="courseCategory"
                        onChange={handleChange}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label>Batch Duration*</label>
                      <input
                        className="block w-full p-2 border rounded mt-1 mb-3 outline-none"
                        name="batchDuration"
                        id="batchDuration"
                        value={formData.batchDuration}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label>Video Medium*</label>
                      <input
                        className="block w-full p-2 border rounded mt-1 mb-3 outline-none"
                        name="videoMedium"
                        id="videoMedium"
                        value={formData.videoMedium}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label>Course Short Description*</label>
                      <textarea
                        name="courseShortDescription"
                        value={formData.courseShortDescription}
                        onChange={handleChange}
                        className="w-full p-2 border h-[100px] resize-none rounded mt-1 mb-3"
                      />
                      {errors.courseShortDescription && (
                        <p className="text-red-500 text-sm">
                          {errors.courseShortDescription}
                        </p>
                      )}
                    </div>

                    <div>
                      <label>Course Long Description*</label>
                      <textarea
                        name="courseLongDescription"
                        value={formData.courseLongDescription}
                        onChange={handleChange}
                        className="w-full p-2 border h-[200px] resize-none rounded mt-1 mb-3"
                      />
                      {errors.courseLongDescription && (
                        <p className="text-red-500 text-sm">
                          {errors.courseLongDescription}
                        </p>
                      )}
                    </div>

                    <div>
                      <label>Course Price*</label>
                      <input
                        name="coursePrice"
                        type="number"
                        value={formData.coursePrice}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                      />
                      {errors.coursePrice && (
                        <p className="text-red-500 text-sm">
                          {errors.coursePrice}
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
                          placeholder="Add a course point"
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
                                    onClick={() =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        courseThumbnail: null,
                                      }))
                                    }
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

                      {errors.examCertificateInPicture && (
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
                                  {showfileData.examCertificatePicture?.name}
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.examCertificatePicture?.size}{" "}
                                  bytes
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.examCertificatePicture?.type}
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
                    <div className="mt-5">
                      <label className="block mb-1 font-medium">
                        Upload a Exam Certificate Logo
                      </label>
                      <input
                        type="file"
                        accept=".jpg, .png, .pdf"
                        id="examCertificateInPicture"
                        name="examCertificateInPicture"
                        className="hidden"
                        onChange={handleFileChangeExamCertificateInPicture}
                      />
                      <label
                        htmlFor="examCertificateInPicture"
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

                      {errors.examCertificateInPicture && (
                        <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <h6>
                            <MdReportGmailerrorred />
                          </h6>
                          <span>{errors.examCertificateInPicture}</span>
                        </div>
                      )}
                      {uploadProgressExamCertificateLogo !== 0 && (
                        <h5 className="mt-4">
                          Uploading {uploadProgressExamCertificateLogo}%
                        </h5>
                      )}
                      {formData.examCertificateInPicture && (
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
                                    src={formData.examCertificateInPicture}
                                    alt="examCertificateInPicture"
                                    className="w-[50px] h-[50px] object-cover"
                                  />
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.examCertificateInPicture.name}
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.examCertificateInPicture.size}{" "}
                                  bytes
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.examCertificateInPicture.type}
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
                    <div className="mt-5">
                      <label className="block mb-1 font-medium">
                        Upload a Instructor Brand Logo
                      </label>
                      <input
                        type="file"
                        accept=".jpg, .png, .pdf"
                        id="instructorBrandLogo"
                        name="instructorBrandLogo"
                        className="hidden"
                        onChange={handleFileInstructorBrandLogo}
                      />
                      <label
                        htmlFor="instructorBrandLogo"
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

                      {errors.instructorBrandLogo && (
                        <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <h6>
                            <MdReportGmailerrorred />
                          </h6>
                          <span>{errors.instructorBrandLogo}</span>
                        </div>
                      )}
                      {uploadProgressExamCertificateLogo !== 0 && (
                        <h5 className="mt-4">
                          Uploading {uploadProgressExamCertificateLogo}%
                        </h5>
                      )}
                      {formData.instructorBrandLogo && (
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
                                    src={formData.instructorBrandLogo}
                                    alt="instructorBrandLogo"
                                    className="w-[50px] h-[50px] object-cover"
                                  />
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.instructorBrandLogo?.name}
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.instructorBrandLogo?.size} bytes
                                </td>
                                <td className="border px-4 py-2 truncate">
                                  {showfileData.instructorBrandLogo?.type}
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
                {step === 4 && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-medium">Course Status</h3>
                    <div className="flex items-center">
                      <span className="mr-4">Current Status:</span>
                      <span
                        className={`px-4 py-1 rounded ${
                          formData.courseStatus === "active"
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {formData?.courseStatus?.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={toggleCourseStatus}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Toggle Status
                    </button>
                  </div>
                )}
              </div>

              <div className="stepper-buttons flex justify-between mt-5">
                {step > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Previous
                  </button>
                )}
                {step < 4 ? (
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
                    Update Course
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

export default EditCourse;
