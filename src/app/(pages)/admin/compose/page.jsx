"use client";
import { firestore } from "@/Backend/Firebase";
import { getAllCourses, getAllUsers } from "@/Backend/firebasefunctions";
import DashboardNavbar from "@/components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "@/components/AdminDashboard/DashboardPageInfo";
import Sidebar from "@/components/AdminDashboard/Sidebar";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import dfemt from "@/components/DefaulteEmailTemplate/dfemt";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaImage,
  FaItalic,
  FaListOl,
  FaListUl,
  FaLongArrowAltRight,
  FaUnderline,
  FaUser,
} from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import {
  MdClose,
  MdKeyboardCommandKey,
  MdOutlineKeyboardCommandKey,
} from "react-icons/md";
import { TbQuestionMark } from "react-icons/tb";

const page = () => {
  const [content, setContent] = useState("<p>No Data Provided Yet.</p>");
  const [emailSearchQuery, setEmailSearchQuery] = useState("");
  const [activeCommands, setActiveCommands] = useState({});
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedCoursesUsers, setSelectedCoursesUsers] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [emailSubject, setEmailSubject] = useState("");
  const editorRef = useRef(null);
  const [openShortcut, setOpenShortcut] = useState(false);

  const handleToggleOpenShortCut = () => {
    setOpenShortcut(!openShortcut);
  };

  const handleCommand = (command, value = null) => {
    if (editorRef.current) {
      document.execCommand(command, false, value);
    }
  };

  useEffect(() => {
    const fetchCoursesData = async () => {
      const data = await getAllCourses();
      setCourseData(data.data);
    };

    fetchCoursesData();
  }, []);

  const updateActiveCommands = () => {
    setActiveCommands({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      fontsize: document.queryCommandState("font-size"),
    });
  };

  const updateContent = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML); // Update state with HTML
      updateActiveCommands(); // Update active commands while typing
    }
  };

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

  const selectOptions = [
    { value: "allusers", label: "All Users" },
    { value: "specficuser", label: "Specific Users" },
    {
      value: "users_enrolled_in_a_course",
      label: "Users Enrolled in a Course",
    },
  ];

  const [selectedOption, setSelectedOption] = useState("All Users");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    setSelectedOption(option.label);

    if (option.label === "Specific Users") {
      setSelectedCoursesUsers([]);
    }

    if (option.label === "Users Enrolled in a Course") {
      setSelectedEmails([]);
    }

    setIsOpen(false);
  };

  const [selectedOptionCourse, setSelectedOptionCourse] =
    useState("Select a course");
  const [isOpenCourse, setIsOpenCourse] = useState(false);
  const handleSelectCourse = (option) => {
    setSelectedOptionCourse(option.courseTitle);
    setSelectedCoursesUsers(option.courseEnrollments);

    setIsOpenCourse(false);
  };

  // Search User
  const checkEmailExists = async (email) => {
    if (!email) return;
    try {
      const usersRef = collection(firestore, "users");
      const emailQuery = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        setFetchedUserData(userDoc);
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  useEffect(() => {
    checkEmailExists(emailSearchQuery);
  }, [emailSearchQuery]);

  const handleAddToSendEmail = async (data) => {
    setEmailSearchQuery("");
    setFetchedUserData(null);
    setSelectedEmails((prevEmails) => [...prevEmails, data]);
  };

  const handleRemoveEmail = (uid) => {
    setSelectedEmails((prevEmails) =>
      prevEmails.filter((email) => email.uid !== uid)
    );
  };

  const handleSendEmails = async (e) => {
    e.preventDefault();

    if (!emailSubject || !content) {
      alert("Email subject and content cannot be empty.");
      return;
    }

    try {
      let users;

      if (selectedOption === "All Users") {
        const response = await getAllUsers(); // Fetch all users
        users = response.data;

        // Add to Firestore queue for "All Users"
        await addDoc(collection(firestore, "emails_queue_data"), {
          data: users,
        });

        console.log(
          "%c Email Queue Data Has Been Created for All Users.",
          "background: #222; color: #bada55; font-size: 16px; font-weight: bold;"
        );
      }

      // Prepare the request body based on the selected option
      let requestBody = {
        fetchedUserData: null,
        email_subject: emailSubject,
        email_template: content,
      };

      if (selectedOption === "Specific Users") {
        requestBody.fetchedUserData = selectedEmails;
      } else if (selectedOption === "Users Enrolled in a Course") {
        requestBody.userIds = selectedCoursesUsers; // Assuming `user.id` is the unique identifier
      }

      // Send request to backend
      const response = await fetch("/api/send-queued-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody), // Convert to JSON string
      });

      const responseData = await response.json();
      console.log("Backend Response:", responseData);
      alert("Emails sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while sending emails.");
    }
  };

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        <Sidebar />
        {toast.visible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        )}
        <div className="w-full">
          <DashboardNavbar />
          <div className="max-w-[60rem] mx-auto">
            {openShortcut && (
              <div
                onClick={() => handleToggleOpenShortCut()}
                className="fixed z-50 bg-black/50 inset-1 flex items-center justify-center"
              >
                <span className="bg-white p-10 rounded-lg">
                  <h3 className=" mb-4 text-xl font-bold text-center">Keyboard Shortcuts</h3>
                  <ul className="flex flex-col gap-2">
                    <li className="flex border border-primary p-3 rounded-lg items-center gap-2">
                      <MdOutlineKeyboardCommandKey size={25} />{" "}
                      <div className="flex items-center gap-3">
                        <span className="font-bold">Ctrl + B</span>
                        <FaLongArrowAltRight />
                        <span className="font-medium">Bold Text</span>
                      </div>
                    </li>
                    <li className="flex border border-primary p-3 rounded-lg items-center gap-2">
                      <MdOutlineKeyboardCommandKey size={25} />{" "}
                      <div className="flex items-center gap-3">
                        <span className="font-bold">Ctrl + U</span>
                        <FaLongArrowAltRight />
                        <span className="font-medium">Underlined Text</span>
                      </div>
                    </li>
                    <li className="flex border border-primary p-3 rounded-lg items-center gap-2">
                      <MdOutlineKeyboardCommandKey size={25} />{" "}
                      <div className="flex items-center gap-3">
                        <span className="font-bold">Ctrl + I</span>
                        <FaLongArrowAltRight />
                        <span className="font-medium">Ittalic Text</span>
                      </div>
                    </li>
                  </ul>
                </span>
              </div>
            )}
            <div className="py-10">
              <DashboardPageInfo
                DashboardPageInfo={"Compose Email"}
                icons={<FaUser size={20} />}
              />
              <div className="flex flex-col p-10 mt-10">
                <label
                  htmlFor="email_to"
                  className="text-[13px] mb-1 font-semibold text-gray-600"
                >
                  Send to
                </label>
                <div className="flex items-center gap-7">
                  <div className="relative w-[220px]">
                    {/* Selected Option */}
                    <div
                      id={"email_to"}
                      className="bg-gray-100 border border-gray-300 rounded-md py-2 px-4 flex justify-between items-center cursor-pointer"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <span className="text-[13px]">{selectedOption}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transform ${
                          isOpen ? "rotate-180" : ""
                        } transition-transform duration-200`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 001.414 0L10 6.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* Dropdown Options */}
                    {isOpen && (
                      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg">
                        {selectOptions.map((option) => (
                          <li
                            key={option.value}
                            className="py-2 px-4 text-[13px] hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(option)}
                          >
                            {option.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="-mt-6">
                    {selectedOption === "Specific Users" ? (
                      <div className="flex flex-col gap-2 relative">
                        <label
                          htmlFor="email_to"
                          className="text-[13px] flex gap-1 items-center font-semibold text-gray-600"
                        >
                          Select users <TbQuestionMark />
                        </label>
                        <div className="w-full flex items-center rounded-md border border-primary border-r-0 bg-white">
                          <input
                            type="text"
                            value={emailSearchQuery}
                            onChange={(e) =>
                              setEmailSearchQuery(e.target.value)
                            }
                            placeholder="Search a user by email..."
                            className="py-1.5 pl-2 pr-1 text-[13px] bg-transparent placeholder:text-[13px] w-full outline-none"
                          />
                          <div className="bg-primary h-auto py-[0.6rem] rounded-tr-md rounded-br-md px-3 text-white">
                            <CiSearch />
                          </div>
                        </div>
                        {fetchedUserData ? (
                          <div
                            onClick={() =>
                              handleAddToSendEmail(fetchedUserData)
                            }
                            className="absolute top-16 mb-10"
                          >
                            <div className="flex cursor-pointer flex-col gap-1 bg-gray-200 p-5 rounded-md w-[200px]">
                              <span className="text-[12px]">
                                {fetchedUserData.firstName}{" "}
                                {fetchedUserData.lastName}
                              </span>
                              <span className="text-[12px] font-bold">
                                {fetchedUserData.email}
                              </span>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : selectedOption === "Users Enrolled in a Course" ? (
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="email_to"
                          className="text-[13px] font-semibold text-gray-600"
                        >
                          Select course
                        </label>
                        <div className="relative w-[300px]">
                          {/* Selected Option */}
                          <div
                            id={"email_to"}
                            className="bg-gray-100 border border-gray-300 rounded-md py-2 px-4 flex justify-between items-center cursor-pointer"
                            onClick={() => setIsOpenCourse(!isOpenCourse)}
                          >
                            <span className="text-[13px] truncate">
                              {selectedOptionCourse}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-5 w-5 transform ${
                                isOpenCourse ? "rotate-180" : ""
                              } transition-transform duration-200`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 9.707a1 1 0 001.414 0L10 6.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>

                          {/* Dropdown Options */}
                          {isOpenCourse && (
                            <ul className="absolute z-10 max-h-[150px] overflow-y-scroll bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg">
                              {courseData.map((option, idx) => (
                                <li
                                  key={option.courseTitle}
                                  className="py-2 px-4 text-[13px] hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleSelectCourse(option)}
                                >
                                  {option.courseTitle}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-3 gap-4 w-1/2">
                    {selectedCoursesUsers.slice(0, 6).map((data, idx) => (
                      <div
                        key={idx}
                        className="py-3 rounded-md flex items-center justify-between px-5 text-[13px] bg-gray-50 border-primary border"
                      >
                        <span className="truncate w-1/2">{data}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-3 gap-4 w-1/2">
                    {selectedEmails.map((data, idx) => (
                      <div
                        key={idx}
                        className="py-3 rounded-md flex items-center justify-between px-5 text-[13px] bg-gray-50 border-primary border"
                      >
                        <span> {data.firstName}</span>
                        <div
                          className="cursor-pointer"
                          onClick={() => handleRemoveEmail(data.uid)}
                        >
                          <MdClose />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex flex-col">
                  <label
                    htmlFor="subject"
                    className="text-[13px] mb-2 font-semibold text-gray-600"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a email subject. (Required)"
                    id="subject"
                    name="subject"
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="py-2 rounded-md border-gray-300 border pl-2 pr-1 text-[13px] bg-white placeholder:text-[13px] w-1/2 outline-none"
                  />
                </div>
                <div className="mt-5 flex justify-between">
                  <label
                    htmlFor="subject"
                    className="text-[20px] mb-2 font-semibold text-gray-800"
                  >
                    Message
                  </label>
                  <span className="underline text-[13px] cursor-pointer font-bold">
                    Switch to HTML Editor
                  </span>
                </div>
                <div>
                  <div className="flex border flex-col border-gray-400 border-b-0 rounded-lg">
                    {/* Editor */}
                    <div
                      contentEditable
                      ref={editorRef}
                      onInput={updateContent}
                      className="border py-4 px-4 h-[200px] overflow-y-scroll max-h-[200px] bg-white rounded shadow-sm"
                      style={{ outline: "none" }}
                    ></div>
                    {/* Toolbar */}
                    <div className="flex justify-between rounded-b-lg w-full border  p-4 bg-gray-200 items-center">
                      <div className="flex gap-2">
                        {/* Font Size */}
                        <select
                          onChange={(e) =>
                            handleCommand("fontSize", e.target.value)
                          }
                          defaultValue={2}
                          className={`px-2 py-1 rounded ${
                            activeCommands.fontsize
                              ? "bg-gray-400"
                              : "bg-gray-300"
                          }`}
                        >
                          <option value="2">Heading 5</option>
                          <option value="3.5">Heading 4</option>
                          <option value="4">Heading 3</option>
                          <option value="5.5">Heading 2</option>
                          <option value="8">Heading 1</option>
                        </select>

                        {/* Bold */}
                        <button
                          onClick={() => handleCommand("bold")}
                          className={`px-2 py-1 bg-gray-300 hover:bg-gray-300 rounded ${
                            activeCommands.bold ? "bg-gray-400" : "bg-gray-300"
                          }`}
                        >
                          <FaBold />
                        </button>

                        {/* Italic */}
                        <button
                          onClick={() => handleCommand("italic")}
                          className={`px-2 py-1 bg-gray-300 hover:bg-gray-300 rounded ${
                            activeCommands.italic
                              ? "bg-gray-400"
                              : "bg-gray-300"
                          }`}
                        >
                          <FaItalic />
                        </button>

                        {/* Underline */}
                        <button
                          onClick={() => handleCommand("underline")}
                          className={`px-2 py-1 bg-gray-300 hover:bg-gray-300 ${
                            activeCommands.underline
                              ? "bg-gray-400"
                              : "bg-gray-300"
                          } rounded`}
                        >
                          <FaUnderline />
                        </button>

                        {/* Text Alignment */}
                        <button
                          onClick={() => handleCommand("justifyLeft")}
                          className={`px-2 py-1 bg-gray-300 hover:bg-gray-300 ${
                            activeCommands.justifyLeft
                              ? "bg-gray-400"
                              : "bg-gray-300"
                          } rounded`}
                        >
                          <FaAlignLeft />
                        </button>
                        <button
                          onClick={() => handleCommand("justifyCenter")}
                          className={`px-2 py-1 ${
                            activeCommands.justifyCenter
                              ? "bg-gray-400"
                              : "bg-gray-300"
                          } bg-gray-300 hover:bg-gray-300 rounded`}
                        >
                          <FaAlignCenter />
                        </button>
                        <button
                          onClick={() => handleCommand("justifyRight")}
                          className={`px-2 py-1 ${
                            activeCommands.justifyRight
                              ? "bg-gray-400"
                              : "bg-gray-300"
                          } hover:bg-gray-300 rounded`}
                        >
                          <FaAlignRight />
                        </button>

                        {/* Insert Image */}
                        <button
                          onClick={() => {
                            const imageUrl = prompt("Enter image URL:");
                            if (imageUrl) {
                              handleCommand("insertImage", imageUrl);
                            }
                          }}
                          className={`px-2 py-1 ${
                            activeCommands.insertImage
                              ? "bg-gray-400"
                              : "bg-gray-300"
                          } hover:bg-gray-300 rounded`}
                        >
                          <FaImage />
                        </button>
                        {/* Ordered List */}
                        <button
                          onClick={() => handleCommand("insertOrderedList")}
                          className={`px-2 py-1 ${
                            activeCommands.insertOrderedList
                              ? "bg-gray-400"
                              : "bg-gray-300"
                          } bg-gray-300 hover:bg-gray-300 rounded`}
                        >
                          <FaListOl />
                        </button>

                        {/* Unordered List */}
                        <button
                          onClick={() => handleCommand("insertUnorderedList")}
                          className={`px-2 py-1 ${
                            activeCommands.insertUnorderedList
                              ? "bg-gray-400"
                              : "bg-gray-300"
                          } bg-gray-300 hover:bg-gray-300 rounded`}
                        >
                          <FaListUl />
                        </button>
                      </div>
                      <div
                        onClick={() => handleToggleOpenShortCut()}
                        className="p-2 bg-gray-300 rounded-md cursor-pointer"
                      >
                        <MdKeyboardCommandKey />
                      </div>
                    </div>
                    {/* Retrieve HTML Button */}
                  </div>
                  <div className="flex gap-2">
                    {" "}
                    <button
                      onClick={handleSendEmails}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded"
                    >
                      Send Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default page;
