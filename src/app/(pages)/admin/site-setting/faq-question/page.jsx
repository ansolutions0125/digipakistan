"use client";
import React, { useEffect, useState } from "react";
import { firestore } from "../../../../../Backend/Firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import { IoMdAdd } from "react-icons/io";
import Sidebar from "../../../../../components/AdminDashboard/Sidebar";
import DashboardNavbar from "../../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../../components/AdminDashboard/DashboardPageInfo";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const AddFaqQuestions = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal(); // Close modal when clicking on overlay
    }
  };

  useEffect(() => {
    const getContacts = async () => {
      const q = collection(firestore, "site_admins_details");
      const querySnapshot = await getDocs(q);
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({ id: doc.id, ...doc.data() });
      });
      setAdminsData(temp);
    };
    getContacts();
  }, []);

  // Error handling.
  const [error, setError] = useState({
    faq_question: "",
    faq_answer: "",
    admin_password: "",
  });

  // Input fields data.
  const [input, setInput] = useState({
    faq_question: "",
    faq_answer: "",
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  // Handling Inputs.
  const HandleInput = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const [contactSuccessful, setContactSuccessful] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  // Input fields Validations.
  const validateInput = () => {
    let isValid = true;
    const newError = {
      faq_question: "",
      faq_answer: "",
    };

    if (!input.faq_question) {
      newError.faq_question = "Name is required.";
      isValid = false;
    }
    if (!input.faq_answer) {
      newError.client_phonenumber = "Phone number is required.";
      isValid = false;
    }
    if (!input.admin_password) {
      newError.admin_password = "Message cannot be empty.";
      isValid = false;
    } else if (input.admin_password.length === 4) {
      newError.admin_password = "Password must be at least 8 characters";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  // Form Submition / Data storing in "FIREBASE".
  const HandleFormSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(firestore, "site_faq_questions_answers_data"), {
      ...input,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    showToast(`${input.faq_answer} successfly added.`, "success", 2000);

    closeModal();
    setContactSuccessful(true);
    setInput({
      faq_question: "",
      faq_answer: "",
    });
    setError({}); // Clear errors on successful submission
    setCooldown(true);
    setCooldownTimer(3600);
  };

  // Countdown for cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown) {
      timer = setInterval(() => {
        setCooldownTimer((prev) => {
          if (prev <= 1) {
            setCooldown(false);
            clearInterval(timer);
            return 0; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer); // Clean up timer on unmount
  }, [cooldown]);

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
          <div className="px-10 py-12">
            <DashboardPageInfo
              DashboardPageInfo={"Add FAQ Question"}
              icons={<IoMdAdd size={20} />}
            />
            <div className="flex mt-10 flex-col items-center justify-center">
              <div
                className="flex items-center justify-center bg-opacity-50"
                onClick={handleOverlayClick}
              >
                <form
                  onSubmit={HandleFormSubmit}
                  className="bg-primary/80 border p-8 rounded-lg shadow-lg relative "
                >
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    Add New FAQ
                  </h2>
                  <input
                    type="text"
                    onChange={HandleInput}
                    placeholder="Question"
                    name="faq_question"
                    className="border p-2 w-full mb-4"
                  />
                  <textarea
                    type="email"
                    onChange={HandleInput}
                    name="faq_answer"
                    placeholder="Answer"
                    className="border p-2 w-full h-[150px] mb-4"
                  />
                  <button className="bg-primary text-white py-2 px-4 rounded">
                    Add FAQ
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default AddFaqQuestions;
