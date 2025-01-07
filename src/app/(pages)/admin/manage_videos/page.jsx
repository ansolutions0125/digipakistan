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
import { FaFilter } from "react-icons/fa";
import { CiEdit, CiMenuKebab } from "react-icons/ci";
import DashboardNavbar from "../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../components/AdminDashboard/DashboardPageInfo";
import Link from "next/link";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import { IoIosVideocam } from "react-icons/io";

const ManageCourses = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [openModalId, setOpenModalId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const fetchCourses = async (loadMore = false) => {
    try {
      let courseQuery = query(collection(firestore, "site_videos"), limit(5));
      if (loadMore && lastDoc) {
        courseQuery = query(courseQuery, startAfter(lastDoc));
      }

      const courseSnapshot = await getDocs(courseQuery);
      const courses = courseSnapshot.docs.map((doc) => ({
        ...doc.data(),
        courseId: doc.id,
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

  // Single admin deletion
  const handleSingleSelectedAdmin = async (adminId) => {
    try {
      const adminRef = doc(firestore, "site_videos", adminId);
      await deleteDoc(adminRef);

      showToast("course has been deleted", "success", 2000);
      setAdminsData((prevData) =>
        prevData.filter((admin) => admin.id !== adminId)
      );
      setSelectedAdmins((prevSelected) =>
        prevSelected.filter((id) => id !== adminId)
      );
    } catch (error) {
      console.error("Error deleting admin: ", error);
    }
  };

  // Multiple admins deletion
  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedAdmins.map((adminId) =>
        deleteDoc(doc(firestore, "site_videos", adminId))
      );
      await Promise.all(deletePromises);

      showToast("Selected courses has been deleted", "success", 2000);
      setAdminsData((prevData) =>
        prevData.filter((admin) => !selectedAdmins.includes(admin.id))
      );
      setSelectedAdmins([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting selected admins: ", error);
    }
  };

  // Handle individual selection
  const handleSelectAdmin = (adminId) => {
    setSelectedAdmins((prevSelected) =>
      prevSelected.includes(adminId)
        ? prevSelected.filter((id) => id !== adminId)
        : [...prevSelected, adminId]
    );
  };

  // Toggle all selections
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(adminsData.map((admin) => admin.id));
    }
    setSelectAll(!selectAll);
  };

  const handleModalOpen = (adminId) => {
    setOpenModalId((prevModalId) => (prevModalId === adminId ? null : adminId));
  };

  const courses = adminsData.filter(
    (admin) =>
      admin.video_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.video_vimeoId.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              DashboardPageInfo={"Manage Videos"}
              icons={<IoIosVideocam size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">Videos</h2>
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
                      Video Title
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Vimeo Id
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((data, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2 border-l-[1px]">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.includes(data.courseId)}
                          onChange={() => handleSelectAdmin(data.courseId)}
                        />
                      </td>
                      <td className="px-4 py-2 max-w-xl text-[0.8rem] border-l-[1px]">
                        {data.video_title}
                      </td>

                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                       {data?.video_vimeoId}
                      </td>
                      <td className="px-2 py-2 flex gap-1 border-l-[1px] border-r-[1px]">
                        <button
                          onClick={() => handleModalOpen(data.video_vimeoId)}
                          className="p-2 rounded-lg"
                        >
                          <CiMenuKebab />
                        </button>
                      </td>
                      {openModalId === data.video_vimeoId && (
                        <tr className="flex items-center justify-center z-50 absolute bg-opacity-50">
                          <div className="bg-white p-3 border w-[150px] -mt-2 rounded-lg shadow-lg space-y-4">
                            <div className="flex flex-col gap-1">
                              <Link href={`/edit_videos/${data.video_vimeoId}`}>
                                <button className=" hover:underline">
                                  View Course
                                </button>
                              </Link>
                              <Link
                                href={`/admin/edit_videos/${data.video_vimeoId}`}
                              >
                                <button className=" hover:underline">
                                  Edit
                                </button>
                              </Link>
                              <button
                                onClick={() =>
                                  handleSingleSelectedAdmin(data.video_vimeoId)
                                }
                                className="text-start hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </tr>
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

export default ManageCourses;