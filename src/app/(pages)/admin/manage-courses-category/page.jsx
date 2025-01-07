"use client";
import React, { useState, useEffect } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { getAllCertificationCategoryes } from "@/Backend/firebasefunctions";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/Backend/Firebase";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";
import Sidebar from "@/components/AdminDashboard/Sidebar";

const ManageCertifications = () => {
  const [certificationsData, setCertificationsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModalId, setOpenModalId] = useState(null);
  const [selectedCertifications, setSelectedCertifications] = useState([]);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const fetchedData = await getAllCertificationCategoryes();
      if (Array.isArray(fetchedData.data)) {
        setCertificationsData(fetchedData.data);
      } else {
        console.error("Fetched data is not an array:", fetchedData);
        setCertificationsData([]);
      }
    } catch (error) {
      console.error("Error fetching certifications:", error);
      setCertificationsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectCertification = (id) => {
    setSelectedCertifications((prev) =>
      prev.includes(id)
        ? prev.filter((certificationId) => certificationId !== id)
        : [...prev, id]
    );
  };

  const handleModalOpen = (id) => {
    setOpenModalId(openModalId === id ? null : id);
  };

  const toggleCategoryStatus = async (certificationsId) => {
    try {
      // Update local state for immediate UI changes
      setCertificationsData((prevData) =>
        prevData.map((item) =>
          item.certificationsId === certificationsId
            ? {
                ...item,
                status: item.status === "active" ? "inactive" : "active",
                coursesInThisCertifications: item.coursesInThisCertifications.map(
                  (course) => ({
                    ...course,
                    courseStatus:
                      item.status === "active" ? "inactive" : "active",
                  })
                ),
              }
            : item
        )
      );
  
      const categoriesRef = collection(
        firestore,
        "certification_courses_category"
      );
      const q = query(
        categoriesRef,
        where("certificationsId", "==", certificationsId)
      );
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.warn(
          `No document found with certificationsId: ${certificationsId}`
        );
        return;
      }
  
      const docRef = querySnapshot.docs[0].ref;
      const currentData = querySnapshot.docs[0].data();
  
      // Toggle the category status
      const newStatus = currentData.status === "active" ? "inactive" : "active";
  
      // Update the courses in certification_courses_category
      const updatedCourses = currentData.coursesInThisCertifications.map(
        (course) => ({
          ...course,
          courseStatus: newStatus === "inactive" ? "inactive" : "active",
        })
      );
  
      // Update the category's status and courses in Firestore
      await updateDoc(docRef, {
        status: newStatus,
        coursesInThisCertifications: updatedCourses,
      });
  
      // Update the courses in the "courses" collection
      const coursesRef = collection(firestore, "courses");
      const courseUpdatePromises = currentData.coursesInThisCertifications.map(
        async (course) => {
          const courseQuery = query(
            coursesRef,
            where("courseId", "==", course.courseId)
          );
          const courseSnapshot = await getDocs(courseQuery);
  
          if (!courseSnapshot.empty) {
            const courseDocRef = courseSnapshot.docs[0].ref;
            await updateDoc(courseDocRef, {
              courseStatus: newStatus === "inactive" ? "inactive" : "active",
            });
          } else {
            console.warn(`Course not found: ${course.courseId}`);
          }
        }
      );
  
      // Wait for all course updates to complete
      await Promise.all(courseUpdatePromises);
  
      console.log(`Category and related courses updated successfully.`);
    } catch (error) {
      console.error("Error toggling category and course statuses:", error);
    }
  };
  
  

  useEffect(() => {
    fetchCertifications();
  }, []);

  const filteredData = certificationsData.filter((data) =>
    (data.certificationsTitle || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        <Sidebar />
        <div className="w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <input
              type="text"
              placeholder="Search Certifications..."
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 border rounded-lg w-1/3"
            />
            <button
              onClick={() => setCertificationsData([])}
              className="p-2 bg-primary text-white rounded-lg"
            >
              Delete All
            </button>
          </div>

          <div className="container mx-auto p-4">
            <table className="w-full border-collapse border border-primary">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-2 border border-primary">Select</th>
                  <th className="px-4 py-2 border border-primary">
                    Certification ID
                  </th>
                  <th className="px-4 py-2 border border-primary">
                    Certification Title
                  </th>
                  <th className="px-4 py-2 border border-primary">
                    Courses Count
                  </th>
                  <th className="px-4 py-2 border border-primary">Status</th>
                  <th className="px-4 py-2 border border-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((data) => (
                    <tr key={data.id} className="hover:bg-primary/10">
                      <td className="px-4 py-2 border border-primary">
                        <input
                          type="checkbox"
                          checked={selectedCertifications.includes(data.id)}
                          onChange={() => handleSelectCertification(data.id)}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-2 border border-primary">
                        {data.certificationsId}
                      </td>
                      <td className="px-4 py-2 border border-primary">
                        {data.certificationsTitle}
                      </td>
                      <td className="px-4 py-2 border border-primary">
                        {data.coursesInThisCertifications?.length || 0}
                      </td>
                      <td className="px-4 py-2 border border-primary">
                        <button
                          onClick={() =>
                            toggleCategoryStatus(data.certificationsId)
                          }
                          className={`p-2 rounded-lg ${
                            data.status === "active"
                              ? "bg-primary text-white"
                              : "bg-gray-400 text-white"
                          }`}
                        >
                          {data.status === "active" ? "Enabled" : "Disabled"}
                        </button>
                      </td>
                      <td className="px-4 py-2 border border-primary relative">
                        <button
                          onClick={() => handleModalOpen(data.id)}
                          className="p-2"
                        >
                          <CiMenuKebab />
                        </button>
                        {openModalId === data.id && (
                          <div className="absolute top-8 right-0 bg-white border border-primary rounded shadow-lg">
                            <button className="block px-4 py-2 hover:bg-primary/10">
                              Edit
                            </button>
                            <button className="block px-4 py-2 hover:bg-primary/10">
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-4 text-gray-500"
                    >
                      No Certifications Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default ManageCertifications;
