"use client";
import React, { useEffect, useState, useRef } from "react";
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
import { FaFilter, FaUser } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import DashboardNavbar from "../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../components/AdminDashboard/DashboardPageInfo";
import axios from "axios";
import CustomToast from "../../../../components/CoustomToast/CoustomToast";
import Link from "next/link";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const ManageUsers = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [lastDoc, setLastDoc] = useState(null); // To track the last document for pagination
  const [hasMore, setHasMore] = useState(true); // Track if more data is available
  const [openModalId, setOpenModalId] = useState(null); // Track which modal is open
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
    duration: 5000,
  });

  const modalRef = useRef(null);

  const showToast = (message, type = "info", duration = 2000) => {
    setToast({ message, type, visible: true, duration });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  const fetchUsers = async (loadMore = false) => {
    try {
      let userQuery = query(collection(firestore, "users"), limit(5));

      if (loadMore && lastDoc) {
        userQuery = query(userQuery, startAfter(lastDoc));
      }

      const userSnapshot = await getDocs(userQuery);
      const users = userSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (users.length === 0 && loadMore) {
        showToast(`No more data to load.`, "info");
        setHasMore(false);
        return;
      }

      setAdminsData((prevUsers) => [...prevUsers, ...users]);
      setLastDoc(userSnapshot.docs[userSnapshot.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load more users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenModalId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSingleSelectedAdmin = async (userId) => {
    try {
      const userRef = doc(firestore, "users", userId);
      await deleteDoc(userRef);
      const response = await axios.delete("/api/delete-users", {
        headers: {
          "Content-Type": "application/json",
        },
        data: { uids: [userId] }, // Send the user ID in an array
      });
      showToast(`User ${userId} successfully deleted.`, "success");
      setAdminsData((prevData) => prevData.filter((user) => user.id !== userId));
      setSelectedAdmins((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      );
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedAdmins.map(async (userId) => {
        const userRef = doc(firestore, "users", userId);
        await deleteDoc(userRef);

        await axios.delete("https://digi-skills-back-end.vercel.app/delete-users", {
          headers: {
            "Content-Type": "application/json",
          },
          data: { uids: selectedAdmins }, // Send an array of user IDs
        });
      });

      await Promise.all(deletePromises);

      showToast("Selected users are deleted successfully.", "success");

      setAdminsData((prevData) =>
        prevData.filter((user) => !selectedAdmins.includes(user.id))
      );
      setSelectedAdmins([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting selected users: ", error);
    }
  };

  const handleSelectAdmin = (userId) => {
    setSelectedAdmins((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(adminsData.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleModalOpen = (userId) => {
    setOpenModalId((prevModalId) => (prevModalId === userId ? null : userId));
  };

  const filteredUsers = adminsData.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <ToastContainer />
        <Sidebar />
        <div className="w-full bg-bgcolor">
          <DashboardNavbar />
          <div className="p-10">
            <DashboardPageInfo
              DashboardPageInfo={"Users"}
              icons={<FaUser size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white ">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">Users</h2>
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
                      Full Name
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">Email</th>
                    <th className="px-4 py-2 text-left border-l-[1px]">UID</th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2 border-l-[1px]">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.includes(user.id)}
                          onChange={() => handleSelectAdmin(user.id)}
                        />
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        {user?.firstName} {user?.lastName}
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        {user?.email}
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        {user?.id}
                      </td>
                      <td
                        ref={modalRef}
                        className="px-2 py-2 flex gap-1 border-l-[1px] border-r-[1px]"
                      >
                        <button
                          onClick={() => handleModalOpen(user.id)}
                          className="p-2 rounded-lg"
                        >
                          <CiMenuKebab />
                        </button>
                        {openModalId === user.id && (
                          <div className="absolute bg-white p-3 border w-[150px] rounded-lg shadow-lg">
                            <div className="flex flex-col gap-1">
                              <Link href={`/admin/user/${user.id}`}>
                                <button className="hover:underline">
                                  View User
                                </button>
                              </Link>
                              <Link href={`/admin/edit-user/${user.id}`}>
                                <button className="hover:underline">Edit</button>
                              </Link>
                              <button
                                onClick={() => handleSingleSelectedAdmin(user.id)}
                                className="text-start hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
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
                  onClick={() => fetchUsers(true)}
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

export default ManageUsers;
