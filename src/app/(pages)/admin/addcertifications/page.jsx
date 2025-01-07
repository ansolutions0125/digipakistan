"use client";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../../../components/AdminDashboard/Sidebar";
import { firestore } from "../../../../Backend/Firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { getAllCourses } from "../../../../Backend/firebasefunctions";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const AddCourseBundle = () => {
  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [coursesInThisCategory, setcoursesInThisCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageLoading,setImageLoading] = useState(false)
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
    duration: 5000,
  });

  const imageRef =useRef();
  const showToast = (message, type = "info", duration = 20000) => {
    setToast({ message, type, visible: true, duration });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

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

  const [errors, setErrors] = useState({});
  const [image,setImage]=  useState(null);

  const [formData, setFormData] = useState({
    certificationsId: "",
    certificationsTitle: "",
    type: "",
    coursesInThisCertifications: [],
    img:"",
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

    if (!formData.certificationsId)
      newErrors.certificationsId = "Category Id is required.";
    if (!formData.certificationsTitle)
      newErrors.certificationsTitle = "Category Title is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      console.log("Course Data Submitted:", formData);
      // Submit the form data to backend or database

      await setDoc(
        doc(
          firestore,
          "certification_courses_category",
          formData.certificationsId
        ),
        {
          ...formData,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        }
      );
      showToast(
        "Certification Category has been added successfuly",
        "success",
        2000
      );
      setFilteredCourses([]);
      setcoursesInThisCategory([]);
      setFormData({
        certificationsId: "",
        certificationsTitle: "",
        coursesInThisCertifications: [],
      });
    }
  };

  console.log(formData);

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


// Cloudinary

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
  formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);

  try {
    setImageLoading(true)
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
    setImageLoading(false);
    return data.secure_url;
  } catch (error) {
    console.log(error.message);
  }
};
// Cloudinary End



  const handleFileChange = async(e)=>{
    const file = e.target.files[0];
    const imageURL = await uploadToCloudinary(file);
    
    setFormData({...formData,img:imageURL})
    setImage(imageURL);
  }

  const handleSelectCourse = (course) => {
    setcoursesInThisCategory([...coursesInThisCategory, course]);
    setAvailableCourses(
      availableCourses.filter((c) => c.courseTitle !== course.courseTitle)
    );
    setFormData((prevData) => ({
      ...prevData,
      coursesInThisCertifications: [
        ...prevData.coursesInThisCertifications,
        course,
      ],
    }));
    setSearchTerm("");
  };

  const handleRemove = (courseTitle) => {
    const updatedcoursesInThisCategory = coursesInThisCategory.filter(
      (course) => course.courseTitle !== courseTitle
    );
    const removedCourse = courses.find(
      (course) => course.courseTitle === courseTitle
    );
    setcoursesInThisCategory(updatedcoursesInThisCategory);
    setAvailableCourses([...availableCourses, removedCourse]);
    setFormData((prevData) => ({
      ...prevData,
      coursesInThisCertifications: updatedcoursesInThisCategory,
    }));
  };

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        <ToastContainer />
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
          <div className="py-10">
            <div className="max-w-5xl mx-auto mt-10 p-5 border rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 heading-text">
                Add New Certifications
              </h2>

              {/* Navbar for Steps */}
              <div className="flex justify-between mb-5 border-b pb-2">
                <button
                  className={`pb-1 px-2 font-semibold ${"border-b-2 border-primary text-primary"}`}
                >
                  Courses Certifications
                </button>
              </div>

              {/* Step Content */}
              <div className="stepper-content">
                <div className="flex flex-col gap-3">
                  <div>
                    <label>Certifications Title*</label>
                    <input
                      type="text"
                      name="certificationsTitle"
                      value={formData.certificationsTitle}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    />
                    {errors.certificationsTitle && (
                      <p className="text-red-500 text-sm">
                        {errors.certificationsTitle}
                      </p>
                    )}
                  </div>
                  <div>
                    <label>Certifications Id*</label>
                    <input
                      type="text"
                      name="certificationsId"
                      value={formData.certificationsId}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    />
                    {errors.certificationsId && (
                      <p className="text-red-500 text-sm">
                        {errors.certificationsId}
                      </p>
                    )}
                  </div>
                  <div className="stepper-content">
                    <div className="flex flex-col gap-3">
                      <label>Certifications Type*</label>
                      <select
                        className="p-3 border mb-3"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="Fast Track">Fast Track</option>
                        <option value="6 Months">6 Months</option>
                      </select>
                      {errors.certificationsTitle && (
                        <p className="text-red-500 text-sm">
                          {errors.certificationsTitle}
                        </p>
                      )}
                    </div>
                      <div className="flex flex-col gap-3">
                        <label>Certifications Type*</label>
                        <div className="flex gap-2 " >
                            <input type="file"
                            ref={imageRef}
                            hidden
                            onChange={handleFileChange}
                            name="img"
                            />
                          <button className="bg-blue-400 text-white p-3 mb-3 rounded disabled:bg-gray-600 disabled:text-gray-400"  disabled={imageLoading} onClick={()=>imageRef.current.click()} >{imageLoading ? "Please Wait":"Upload Icon"} </button>

                        {image && <img className="w-10 h-10" src={image} alt="image" /> }
                        {image && <p className=" text-sm text-red-600" onClick={()=>setImage("")}>Remove</p>}
                        </div>
                      {/* {errors.img && (
                        <p className="text-red-500 text-sm">
                          {errors.img}
                        </p>
                      )} */}
                    </div>

                       
                    <button
                      onClick={handleSubmit}
                      className="py-2 px-6 text-white bg-primary rounded-md"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default AddCourseBundle;
