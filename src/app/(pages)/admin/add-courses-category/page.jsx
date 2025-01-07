"use client";
import React, { useEffect, useState } from "react";
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
  const [filteredCourses, setFilteredCourses] = useState([]);

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

  const [formData, setFormData] = useState({
    certificationId: "",
    certificationTitle: "",
    coursesInThisCertification: [],
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

    if (!formData.categoryId) newErrors.categoryId = "Category Id is required.";
    if (!formData.categoryTitle)
      newErrors.categoryTitle = "Category Title is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      console.log("Course Data Submitted:", formData);
      // Submit the form data to backend or database

      await setDoc(doc(firestore, "courses_category", formData.categoryId), {
        ...formData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      showToast("Category has been added successfuly", "success", 2000);
      setFilteredCourses([]);
      setcoursesInThisCategory([]);
      setFormData({
        categoryId: "",
        categoryTitle: "",
        coursesInThisCategory: [],
      });
    }
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
    setcoursesInThisCategory([...coursesInThisCategory, course]);
    setAvailableCourses(
      availableCourses.filter((c) => c.courseTitle !== course.courseTitle)
    );
    setFormData((prevData) => ({
      ...prevData,
      coursesInThisCategory: [...prevData.coursesInThisCategory, course],
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
      coursesInThisCategory: updatedcoursesInThisCategory,
    }));
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
                Add New Category
              </h2>

              {/* Navbar for Steps */}
              <div className="flex justify-between mb-5 border-b pb-2">
                <button
                  className={`pb-1 px-2 font-semibold ${"border-b-2 border-primary text-primary"}`}
                >
                  Courses Category
                </button>
              </div>

              {/* Step Content */}
              <div className="stepper-content">
                <div className="flex flex-col gap-3">
                  <div>
                    <label>Category Title*</label>
                    <input
                      type="text"
                      name="categoryTitle"
                      value={formData.categoryTitle}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    />
                    {errors.categoryTitle && (
                      <p className="text-red-500 text-sm">
                        {errors.categoryTitle}
                      </p>
                    )}
                  </div>
                  <div>
                    <label>Category Id*</label>
                    <input
                      type="text"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    />
                    {errors.categoryId && (
                      <p className="text-red-500 text-sm">
                        {errors.categoryId}
                      </p>
                    )}
                  </div>
                  <div className="stepper-content">
                    <div className="flex flex-col gap-2">
                      <div>
                        <label>Add Course To This Category*</label>
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
                        {coursesInThisCategory.map((course, idx) => (
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
