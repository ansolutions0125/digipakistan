"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/AdminDashboard/Sidebar";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import { firestore } from "../../../../Backend/Firebase";
import { toast, ToastContainer } from "react-toastify";
import { FaFilter } from "react-icons/fa";
import { CiEdit, CiMenuKebab } from "react-icons/ci";
import DashboardNavbar from "../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../components/AdminDashboard/DashboardPageInfo";
import { SiCoursera } from "react-icons/si";
import Link from "next/link";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const ManageBundleCourses = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [openModalId, setOpenModalId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCourses = async (loadMore = false) => {
    try {
      let courseQuery = query(
        collection(firestore, "courses_bundle"),
        limit(5)
      );
      if (loadMore && lastDoc) {
        courseQuery = query(courseQuery, startAfter(lastDoc));
      }

      const courseSnapshot = await getDocs(courseQuery);
      const courses = courseSnapshot.docs.map((doc) => ({
        ...doc.data(),
        courseBundleId: doc.id,
      }));

      setAdminsData((prevCourses) => [...prevCourses, ...courses]);
      setLastDoc(courseSnapshot.docs[courseSnapshot.docs.length - 1]);
      setHasMore(!courseSnapshot.empty);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load more courses.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSingleSelectedAdmin = async (adminId) => {
    try {
      const adminRef = doc(firestore, "courses_bundle", adminId);
      await deleteDoc(adminRef);

      toast.warning(`Course bundle ${adminId} successfully deleted.`, {
        position: "top-right",
        autoClose: 5000,
      });

      setAdminsData((prevData) =>
        prevData.filter((admin) => admin.courseBundleId !== adminId)
      );
      setSelectedAdmins((prevSelected) =>
        prevSelected.filter((id) => id !== adminId)
      );
    } catch (error) {
      console.error("Error deleting admin: ", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedAdmins.map((adminId) =>
        deleteDoc(doc(firestore, "courses_bundle", adminId))
      );
      await Promise.all(deletePromises);

      toast.warning("Selected bundles deleted successfully.", {
        position: "top-right",
        autoClose: 5000,
      });

      setAdminsData((prevData) =>
        prevData.filter(
          (admin) => !selectedAdmins.includes(admin.courseBundleId)
        )
      );
      setSelectedAdmins([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting selected admins: ", error);
    }
  };

  const handleSelectAdmin = (adminId) => {
    setSelectedAdmins((prevSelected) =>
      prevSelected.includes(adminId)
        ? prevSelected.filter((id) => id !== adminId)
        : [...prevSelected, adminId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(adminsData.map((admin) => admin.courseBundleId));
    }
    setSelectAll(!selectAll);
  };

  const handleModalOpen = (adminId) => {
    setOpenModalId((prevModalId) => (prevModalId === adminId ? null : adminId));
  };

  const courses = adminsData.filter(
    (admin) =>
      admin.courseBundleTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      admin.courseBundleId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        <ToastContainer />
        <Sidebar />
        <div className="w-full bg-bgcolor">
          <DashboardNavbar />
          <div className="p-10">
            <DashboardPageInfo
              DashboardPageInfo={"Manage Courses Bundle"}
              icons={<SiCoursera size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">Manage Courses Bundle</h2>
                <div className="flex items-center gap-3">
                  <div className="border py-1 rounded px-2">
                    <input
                      placeholder="Search..."
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent outline-none"
                    />
                  </div>
                  <FaFilter />
                </div>
              </div>
              <table className="w-full secondfont">
                <thead>
                  <tr className="border">
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Course Title
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Course Price
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Student Enrolled
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((data) => (
                    <tr key={data.courseBundleId} className="border-b">
                      <td className="px-4 py-2 border-l-[1px]">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.includes(data.courseBundleId)}
                          onChange={() =>
                            handleSelectAdmin(data.courseBundleId)
                          }
                        />
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        {data.courseBundleTitle}
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        {data.courseBundlePrice}
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        Total Enrolled:{" "}
                        {data?.courseBundleTotalEnrolledStudents?.length || 0}
                      </td>
                      <td className="px-2 py-2 flex gap-1 border-l-[1px] border-r-[1px]">
                        <button
                          onClick={() => handleModalOpen(data.courseBundleId)}
                          className="p-2 rounded-lg"
                        >
                          <CiMenuKebab />
                        </button>
                      </td>
                      {openModalId === data.courseBundleId && (
                        <div className="flex items-center justify-center z-50 absolute bg-opacity-50">
                          <div className="bg-white p-3 border w-[150px] -mt-2 -ml-10 rounded-lg shadow-lg space-y-4">
                            <div className="flex flex-col gap-1">
                              <Link href={`/course/${data.courseBundleId}`}>
                                <button className="hover:underline">
                                  View Course
                                </button>
                              </Link>
                              <Link
                                href={`/admin/edit-course-bundle/${data.courseBundleId}`}
                              >
                                <button className="hover:underline">
                                  Edit
                                </button>
                              </Link>
                              <button
                                onClick={() =>
                                  handleSingleSelectedAdmin(data.courseBundleId)
                                }
                                className="text-start hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedAdmins.length > 1 && (
              <button
                onClick={handleDeleteSelected}
                className="bg-red-500 text-white px-4 mt-4 py-2 rounded"
                disabled={selectedAdmins.length === 0}
              >
                Delete Selected {selectedAdmins.length}
              </button>
            )}
            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={() => fetchCourses(true)}
                  className="bg-primary text-center text-white px-4 mt-4 py-2 rounded"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default ManageBundleCourses;
