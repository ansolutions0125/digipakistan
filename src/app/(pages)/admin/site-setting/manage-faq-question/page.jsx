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
} from "firebase/firestore";
import { firestore } from "../../../../../Backend/Firebase";
import { toast, ToastContainer } from "react-toastify";
import { FaFilter, FaUser } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import DashboardNavbar from "../../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../../components/AdminDashboard/DashboardPageInfo";
import Link from "next/link";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const ManageFAQ_Questions = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [lastDoc, setLastDoc] = useState(null); // To track the last document for pagination
  const [hasMore, setHasMore] = useState(true); // Track if more data is available
  const [openModalId, setOpenModalId] = useState(null); // Track which modal is open
  const [searchTerm, setSearchTerm] = useState("");

  const [toastData, setToastData] = useState({
    message: "",
    type: "",
    visible: false,
    duration: 5000,
  });

  const showToast = (message, type = "info", duration = 2000) => {
    setToastData({ message, type, visible: true, duration });
  };

  const handleCloseToast = () => {
    setToastData({ ...toastData, visible: false });
  };

  const fetchFAQs = async (loadMore = false) => {
    try {
      let faqQuery = query(
        collection(firestore, "site_faq_questions_answers_data"),
        limit(5)
      );

      if (loadMore && lastDoc) {
        faqQuery = query(faqQuery, startAfter(lastDoc));
      }

      const faqSnapshot = await getDocs(faqQuery);
      const faqs = faqSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (faqs.length === 0 && loadMore) {
        showToast(`No more data to load..`, "info", 2000);

        setHasMore(false); // Disables the button only after notifying
        return;
      }

      setAdminsData((prevFAQs) => [...prevFAQs, ...faqs]);
      setLastDoc(faqSnapshot.docs[faqSnapshot.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to load more FAQs.");
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleSingleDelete = async (faqId) => {
    try {
      await deleteDoc(doc(firestore, "site_faq_questions_answers_data", faqId));

      showToast(`FAQ successfully deleted.`, "success", 2000);

      setAdminsData((prevData) => prevData.filter((faq) => faq.id !== faqId));
      setSelectedAdmins((prevSelected) =>
        prevSelected.filter((id) => id !== faqId)
      );
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ.");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedAdmins.map((faqId) =>
        deleteDoc(doc(firestore, "site_faq_questions_answers_data", faqId))
      );
      await Promise.all(deletePromises);

      showToast(`Selected FAQs deleted successfully.`, "success", 2000);

      setAdminsData((prevData) =>
        prevData.filter((faq) => !selectedAdmins.includes(faq.id))
      );
      setSelectedAdmins([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting selected FAQs: ", error);
    }
  };

  const handleSelectAdmin = (faqId) => {
    setSelectedAdmins((prevSelected) =>
      prevSelected.includes(faqId)
        ? prevSelected.filter((id) => id !== faqId)
        : [...prevSelected, faqId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(adminsData.map((faq) => faq.id));
    }
    setSelectAll(!selectAll);
  };

  const handleModalOpen = (faqId) => {
    setOpenModalId((prevModalId) => (prevModalId === faqId ? null : faqId));
  };

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        <ToastContainer />
        {toastData.visible && (
          <CustomToast
            message={toastData.message}
            type={toastData.type}
            duration={toastData.duration}
            onClose={handleCloseToast}
          />
        )}
        <Sidebar />
        <div className="w-full bg-bgcolor">
          <DashboardNavbar />
          <div className="p-10">
            <DashboardPageInfo
              DashboardPageInfo={"Manage FAQs"}
              icons={<FaUser size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white">
              <div className="flex justify-between py-3 w-full items-center px-5">
                <h2 className="font-medium">Manage FAQs</h2>
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
                      Question
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Answer
                    </th>
                    <th className="px-4 py-2 text-left border-l-[1px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adminsData.map((data, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2 border-l-[1px]">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.includes(data.id)}
                          onChange={() => handleSelectAdmin(data.id)}
                        />
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        {data.faq_question}
                      </td>
                      <td className="px-4 py-2 text-[0.8rem] border-l-[1px]">
                        {data.faq_answer}
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
                          <div className="bg-white p-3 border w-[150px] -mt-2 -ml-7 rounded-lg shadow-lg space-y-4">
                            <div className="flex flex-col gap-1">
                              <Link href={`/faq`}>
                                <button className=" hover:underline">
                                  View FAQ
                                </button>
                              </Link>
                              <Link
                                href={`/admin/edit-faq-questions/${data.id}`}
                              >
                                <button className=" hover:underline">
                                  Edit
                                </button>
                              </Link>
                              <button
                                onClick={() => handleSingleDelete(data.id)}
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
                  onClick={() => fetchFAQs(true)}
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

export default ManageFAQ_Questions;
