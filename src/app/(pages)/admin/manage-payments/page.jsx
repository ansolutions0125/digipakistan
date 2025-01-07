"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/AdminDashboard/Sidebar";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../../../../Backend/Firebase";
import { toast, ToastContainer } from "react-toastify";
import { FaFilter } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import DashboardNavbar from "../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../components/AdminDashboard/DashboardPageInfo";
import { AiFillDollarCircle } from "react-icons/ai";
import {
  getSinglePaymentVerificationRequest,
  getSingleRegistrationData,
} from "../../../../Backend/firebasefunctions";
import Link from "next/link";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const ManagePayments = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [lastDoc, setLastDoc] = useState(null); // To track the last document for pagination
  const [hasMore, setHasMore] = useState(true); // Track if more data is available
  const [openModalId, setOpenModalId] = useState({
    adminId: "",
    userId: "",
  }); // Track which modal is open
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
      let courseQuery = query(collection(firestore, "payments"), limit(5));

      if (loadMore && lastDoc) {
        courseQuery = query(courseQuery, startAfter(lastDoc));
      }

      const courseSnapshot = await getDocs(courseQuery);
      const courses = courseSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (courses.length === 0 && loadMore) {
        showToast(`No more data to load..`, "info", 2000);
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
  const handleSingleSelectedAdmin = async (adminId) => {
    try {
      const adminRef = doc(firestore, "payments", adminId);
      await deleteDoc(adminRef);

      showToast(`Admin ${adminId} successfully deleted.`, "success", 2000);

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
        deleteDoc(doc(firestore, "payments", adminId))
      );
      await Promise.all(deletePromises);

      showToast("Selected Payments are deleted successfully.", "success", 2000);

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

  const handleModalOpen = (adminId, userId, application) => {
    setOpenModalId((prevData) =>
      prevData.adminId === adminId
        ? { adminId: null, userId: null, application: null }
        : { adminId, userId, application }
    );
  };

  const payments = adminsData.filter((admin) =>
    admin.courseEnrollingIn.toLowerCase().includes(searchTerm.toLowerCase())
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
              DashboardPageInfo={"Payment Verification Requests"}
              icons={<AiFillDollarCircle size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">Payment Verification Requests</h2>
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
                      UserId
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      PaymentFee
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Payment Status
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((data) => (
                    <tr key={data.id} className="border-b">
                      <td className="px-4 py-2 border-l-[1px]">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.includes(data.paymentId)}
                          onChange={() => handleSelectAdmin(data.paymentId)}
                        />
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        {data?.userData?.uid}
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        <span>${data.amount}</span>
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        {data.paymentStatus}
                      </td>
                      <td className="px-2 py-2 flex gap-1 border-l-[1px] border-r-[1px]">
                        <button
                          onClick={() => handleModalOpen(data.id, data.userId)}
                          className="p-2 rounded-lg"
                        >
                          <CiMenuKebab />
                        </button>
                      </td>
                      {openModalId.adminId === data.id && (
                        <div className="flex items-center justify-center z-50 absolute bg-opacity-50">
                          <div className="bg-white p-3 border w-[150px] -mt-2 -ml-7 rounded-lg shadow-lg space-y-4">
                            <div className="flex flex-col gap-1">
                              <Link
                                href={`/admim/payment-verification/${data.id}`}
                              >
                                <button className=" hover:underline">
                                  View Detials
                                </button>
                              </Link>
                              <button
                                onClick={() =>
                                  handleSingleSelectedAdmin(data.id)
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

export default ManagePayments;
