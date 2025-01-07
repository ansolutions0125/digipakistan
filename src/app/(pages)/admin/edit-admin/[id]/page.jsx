"use client";

import React, { useEffect, useState } from "react";
import { firestore } from "../../../../../Backend/Firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../../../../components/AdminDashboard/Sidebar";
import { useRouter, useParams } from "next/navigation";
import DashboardNavbar from "../../../../../components/AdminDashboard/DashboardNavbar";
import { getSingleAdmin } from "../../../../../Backend/firebasefunctions";
import DashboardPageInfo from "@/components/AdminDashboard/DashboardPageInfo";
import { MdAdminPanelSettings } from "react-icons/md";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const page = () => {
  const router = useRouter();
  const { id } = useParams();
  const [adminData, setAdminData] = useState(null);

  const [input, setInput] = useState({
    admin_email: "",
    admin_name: "",
    admin_password: "",
  });

  const [error, setError] = useState({
    admin_email: "",
    admin_name: "",
    admin_password: "",
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      const data = await getSingleAdmin(id);
      setAdminData(data.data);
      setInput({
        admin_email: data.data.admin_email,
        admin_name: data.data.admin_name,
        admin_password: data.data.admin_password,
      });
    };
    fetchAdminData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const validateInput = () => {
    const newError = {
      admin_email: "",
      admin_name: "",
      admin_password: "",
    };
    let isValid = true;

    if (!input.admin_email) {
      newError.admin_email = "Email is required.";
      isValid = false;
    }
    if (!input.admin_name) {
      newError.admin_name = "Name is required.";
      isValid = false;
    }
    if (!input.admin_password) {
      newError.admin_password = "Password is required.";
      isValid = false;
    } else if (input.admin_password.length < 8) {
      newError.admin_password = "Password must be at least 8 characters.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    try {
      await updateDoc(doc(firestore, "site_admins_details", id), {
        ...input,
        updated_at: serverTimestamp(),
      });
      toast.success(`${input.admin_name} successfully updated.`, {
        position: "top-right",
        autoClose: 5000,
      });
      setInput({ admin_email: "", admin_name: "", admin_password: "" });
      setError({});
      router.push("/admin/manage-admins");
    } catch (error) {
      toast.error("Failed to update admin. Please try again.");
      console.error("Error updating admin:", error);
    }
  };

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full bg-bgcolor">
        <ToastContainer />
        <Sidebar />
        <div className="w-full">
          <DashboardNavbar />
          <div className="py-10 max-w-5xl mx-auto">
            <DashboardPageInfo
              DashboardPageInfo={"Manage Admins"}
              icons={<MdAdminPanelSettings size={30} />}
            />
            <div className="flex h-full flex-col items-center justify-center">
              <form
                onSubmit={handleFormSubmit}
                className="bg-primary/80 border p-8 rounded-lg shadow-lg w-full max-w-md"
              >
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Edit Admin Details
                </h2>
                <input
                  type="text"
                  name="admin_name"
                  value={input.admin_name}
                  onChange={handleInputChange}
                  placeholder="Admin Name"
                  className="border p-2 w-full mb-4"
                />
                {error.admin_name && (
                  <p className="text-red-500 text-sm mb-2">
                    {error.admin_name}
                  </p>
                )}
                <input
                  type="email"
                  name="admin_email"
                  value={input.admin_email}
                  onChange={handleInputChange}
                  placeholder="Admin Email"
                  className="border p-2 w-full mb-4"
                />
                {error.admin_email && (
                  <p className="text-red-500 text-sm mb-2">
                    {error.admin_email}
                  </p>
                )}
                <input
                  type="password"
                  name="admin_password"
                  value={input.admin_password}
                  onChange={handleInputChange}
                  placeholder="Admin Password"
                  className="border p-2 w-full mb-4"
                />
                {error.admin_password && (
                  <p className="text-red-500 text-sm mb-2">
                    {error.admin_password}
                  </p>
                )}
                <button
                  type="submit"
                  className="bg-primary text-white py-2 px-4 rounded"
                >
                  Update Admin
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default page;
