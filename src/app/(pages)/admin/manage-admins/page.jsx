"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/AdminDashboard/Sidebar";
import { getAllAdmins } from "../../../../Backend/firebasefunctions";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../../../Backend/Firebase";
import { toast, ToastContainer } from "react-toastify";
import { FaFilter } from "react-icons/fa";
import DashboardPageInfo from "../../../../components/AdminDashboard/DashboardPageInfo";
import { MdAdminPanelSettings } from "react-icons/md";
import DashboardNavbar from "../../../../components/AdminDashboard/DashboardNavbar";
import { CiMenuKebab } from "react-icons/ci";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const ManageAdmins = () => {
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
  const [adminsData, setAdminsData] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModalId, setOpenModalId] = useState(null); // Track which modal is open

  useEffect(() => {
    const fetchAdmins = async () => {
      const data = await getAllAdmins();
      setAdminsData(data.data);
    };
    fetchAdmins();
  }, []);

  const handleSingleSelectedAdmin = async (adminId) => {
    try {
      const adminRef = doc(firestore, "site_admins_details", adminId);
      await deleteDoc(adminRef);
      showToast(`Admin ${adminId} successfully deleted.`, "info", 2000);

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

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedAdmins.map((adminId) =>
        deleteDoc(doc(firestore, "site_admins_details", adminId))
      );
      await Promise.all(deletePromises);
      showToast(`Selected admins deleted successfully.`, "info", 2000);

      setAdminsData((prevData) =>
        prevData.filter((admin) => !selectedAdmins.includes(admin.id))
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
      setSelectedAdmins(adminsData.map((admin) => admin.id));
    }
    setSelectAll(!selectAll);
  };

  const handleModalOpen = (adminId) => {
    setOpenModalId((prevModalId) => (prevModalId === adminId ? null : adminId));
  };

  const filteredAdmins = adminsData.filter(
    (admin) =>
      admin.admin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.admin_email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="w-full">
          <DashboardNavbar />
          <div className="p-10">
            <DashboardPageInfo
              DashboardPageInfo={"Manage Admins"}
              icons={<MdAdminPanelSettings size={30} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">Admins</h2>
                <div className="flex items-center gap-3">
                  <div className="border border-primary/50 rounded">
                    <input
                      placeholder="Search..."
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent outline-none px-3 py-2 text-sm"
                    />
                  </div>
                  <FaFilter />
                </div>
              </div>
              <table className="w-full secondfont bg-white">
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
                      Admin Name
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Admin Email
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((data, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2 border-l-[1px]">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.includes(data.id)}
                          onChange={() => handleSelectAdmin(data.id)}
                        />
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        {data.admin_name}
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        {data.admin_email.toLowerCase()}
                      </td>
                      <td className="px-2 py-2 flex gap-1 border-l-[1px] border-r-[1px]">
                        <button
                          onClick={() => handleModalOpen(data.id)}
                          className="p-2 rounded-lg"
                        >
                          <CiMenuKebab />
                        </button>
                      </td>
                      {openModalId === data.id && (
                        <div className="flex items-center justify-center z-50 absolute bg-opacity-50">
                          <div className="bg-white p-3 border -mt-2 ml-3 rounded-lg shadow-lg space-y-4">
                            <div className="flex flex-col gap-1">
                              <Link href={`/admin/edit-admin/${data.id}`}>
                                <button className=" hover:underline">
                                  Edit
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
                              <Link
                                href={`/admin/manage-permissions/${data.id}`}
                              >
                                <button className=" hover:underline">
                                  Manage Permissions
                                </button>
                              </Link>
                            </div>

                            {/* Render the action message */}
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
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default ManageAdmins;
