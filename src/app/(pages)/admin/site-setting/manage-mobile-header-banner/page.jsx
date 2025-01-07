"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../../components/AdminDashboard/Sidebar";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../../../../Backend/Firebase";
import { toast, ToastContainer } from "react-toastify";
import { FaFilter } from "react-icons/fa";
import { GiTatteredBanner } from "react-icons/gi";
import { BsThreeDotsVertical } from "react-icons/bs";
import DashboardNavbar from "../../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../../components/AdminDashboard/DashboardPageInfo";
import Link from "next/link";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const ManageSiteHeaderBanners = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [lastDoc, setLastDoc] = useState(null); // To track the last document for pagination
  const [hasMore, setHasMore] = useState(true); // Track if more data is available
  const [openModalId, setOpenModalId] = useState(null); // Track which modal is open
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
      let courseQuery = query(
        collection(firestore, "site_header_mobile_banners_data"),
        limit(5)
      );

      if (loadMore && lastDoc) {
        courseQuery = query(courseQuery, startAfter(lastDoc));
      }

      const courseSnapshot = await getDocs(courseQuery);
      const courses = courseSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (courses.length === 0 && loadMore) {
        toast.info("No more data to load.");
        setHasMore(false); // Disables the button only after notifying
        return;
      }

      setAdminsData((prevCourses) => [...prevCourses, ...courses]);
      setLastDoc(courseSnapshot.docs[courseSnapshot.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load more courses.");
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  // Single admin deletion
  const handleSingleSelectedAdmin = async (banner) => {
    try {
      const bannerQuery = query(
        collection(firestore, "site_header_mobile_banners_data"),
        where("site_header_banners", "==", banner)
      );

      const querySnapshot = await getDocs(bannerQuery);

      if (!querySnapshot.empty) {
        // Assuming there's only one match per banner URL; otherwise, you'd loop through results
        const bannerDoc = querySnapshot.docs[0];
        await deleteDoc(bannerDoc.ref);

        showToast("Banner successfully deleted.", "success", 2000);

        setAdminsData((prevData) =>
          prevData.filter((admin) => admin.site_header_banners !== banner)
        );
        setSelectedAdmins((prevSelected) =>
          prevSelected.filter((id) => id !== banner)
        );
      } else {
        toast.error("Banner not found.");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner.");
    }
  };
  // Multiple admins deletion
  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedAdmins.map((banner) =>
        deleteDoc(doc(firestore, "site_header_mobile_banners_data", banner))
      );
      await Promise.all(deletePromises);

      showToast("Selected banners deleted successfully.", "success", 2000);

      setAdminsData((prevData) =>
        prevData.filter(
          (admin) => !selectedAdmins.includes(admin.site_header_banners)
        )
      );
      setSelectedAdmins([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting selected banners: ", error);
    }
  };

  const handleHideBanner = async (banner) => {
    try {
      const bannerQuery = query(
        collection(firestore, "site_header_mobile_banners_data"),
        where("site_header_banners", "==", banner)
      );

      const querySnapshot = await getDocs(bannerQuery);

      if (!querySnapshot.empty) {
        // Assuming there's only one match per banner URL; otherwise, you'd loop through results
        const bannerDoc = querySnapshot.docs[0];

        // Update the banner_status field to "hide"
        await updateDoc(bannerDoc.ref, { banner_status: "hide" });

        showToast("Banner status updated to hidden.", "success", 2000);

        // Update local state if needed
        setAdminsData((prevData) =>
          prevData.map((admin) =>
            admin.site_header_banners === banner
              ? { ...admin, banner_status: "hide" }
              : admin
          )
        );
      } else {
        toast.error("Banner not found.");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner status.");
    }
  };

  const handleShowBanner = async (banner) => {
    try {
      const bannerQuery = query(
        collection(firestore, "site_header_banners_data"),
        where("site_header_banners", "==", banner)
      );

      const querySnapshot = await getDocs(bannerQuery);

      if (!querySnapshot.empty) {
        // Assuming there's only one match per banner URL; otherwise, you'd loop through results
        const bannerDoc = querySnapshot.docs[0];

        // Update the banner_status field to "hide"
        await updateDoc(bannerDoc.ref, { banner_status: "show" });

        showToast("Banner status updated to active.", "success", 2000);

        // Update local state if needed
        setAdminsData((prevData) =>
          prevData.map((admin) =>
            admin.site_header_banners === banner
              ? { ...admin, banner_status: "show" }
              : admin
          )
        );
      } else {
        toast.error("Banner not found.");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner status.");
    }
  };

  // Toggle modal
  const handleModalOpen = (banner) => {
    setOpenModalId((prevModalId) => (prevModalId === banner ? null : banner));
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
          <div className="p-10">
            <DashboardPageInfo
              DashboardPageInfo={"Site Header Banners"}
              icons={<GiTatteredBanner size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">Site Header Banners</h2>
                <div className="flex items-center gap-3">
                  <FaFilter />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4 gap-y-28 gap-x-5 mt-10">
              {adminsData.map((data, idx) => (
                <div key={idx} className="w-full border rounded-lg relative">
                  <div className="relative z-20">
                    <div className="flex justify-between w-full items-center p-2">
                      <button
                        onClick={() =>
                          handleModalOpen(data.site_header_banners)
                        }
                        className="p-2 rounded-lg"
                      >
                        <BsThreeDotsVertical color="black" size={30} />
                      </button>
                      <span
                        className={`text-[0.8rem] px-3 py-1 text-white rounded-full ${
                          data.banner_status === "hide"
                            ? "bg-red-500"
                            : "bg-primary"
                        }`}
                      >
                        {data.banner_status === "hide" ? "Hidden" : "Active"}
                      </span>
                    </div>
                  </div>
                    <img
                      src={data.site_header_banners}
                      className="rounded-lg top-0 absolute w-full h-40 object-cover"
                      alt="Site Header Banner"
                    />

                  {/* Modal Logic */}
                  {openModalId === data.site_header_banners && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                      <div className="bg-white p-3 border w-[120px] rounded-lg shadow-lg space-y-4">
                        <div className="flex flex-col gap-1">
                          <Link href={`/`}>
                            <button className="hover:underline">
                              View Banner
                            </button>
                          </Link>
                          {data.banner_status === "hide" ? (
                            <button
                              onClick={() =>
                                handleShowBanner(data.site_header_banners)
                              }
                              className="hover:underline text-start"
                            >
                              Show
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleHideBanner(data.site_header_banners)
                              }
                              className="hover:underline text-start"
                            >
                              Hide
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleSingleSelectedAdmin(
                                data.site_header_banners
                              )
                            }
                            className="text-start hover:underline text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default ManageSiteHeaderBanners;
