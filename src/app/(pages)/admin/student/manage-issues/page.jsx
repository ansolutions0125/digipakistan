"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../../components/AdminDashboard/Sidebar";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../../../../Backend/Firebase";
import { AiOutlineIssuesClose } from "react-icons/ai";
import DashboardNavbar from "../../../../../components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "../../../../../components/AdminDashboard/DashboardPageInfo";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import { debounce } from "lodash";
import {
  FaCheck,
  FaExchangeAlt,
  FaUserCircle,
  FaUserEdit,
  FaUserPlus,
} from "react-icons/fa";
import {
  MdMarkEmailRead,
  MdModeEdit,
  MdOutlineVerifiedUser,
  MdVerifiedUser,
} from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";
import { IoIosWarning, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaRegCircleXmark } from "react-icons/fa6";
import Modal from "@/components/StudentIssuesPanel/ReplaceCertifications";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

import { IoCheckmarkDone } from "react-icons/io5";
import { GrDocumentUpdate } from "react-icons/gr";
import Image from "next/image";
import { RiShieldUserLine } from "react-icons/ri";

const ManageCourses = () => {
  const [usersData, setUsersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOldCertification, setSelectedOldCertification] = useState("");
  const [selectedNewCertification, setSelectedNewCertification] = useState("");

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

  // Fetch users from Firestore and filter locally
  const fetchUsers = async (searchValue) => {
    if (!searchValue || searchValue.trim() === "") {
      setUsersData([]); // Clear previous data if search value is invalid
      return;
    }

    setLoading(true);

    try {
      const usersCollection = collection(firestore, "users");
      const registrationCollection = collection(
        firestore,
        "registration_form_data"
      );

      // Query for email and firstName in the "users" collection (partial match)
      const userQueries = [
        query(
          usersCollection,
          where("email", ">=", searchValue),
          where("email", "<=", searchValue + "\uf8ff")
        ),
        query(
          usersCollection,
          where("firstName", ">=", searchValue),
          where("firstName", "<=", searchValue + "\uf8ff")
        ),
      ];

      // Query for phone and CNIC in the "registration_form_data" collection (partial match)
      const registrationQueries = [
        query(
          registrationCollection,
          where("phone", ">=", searchValue),
          where("phone", "<=", searchValue + "\uf8ff")
        ),
        query(
          usersCollection,
          where("fullName", ">=", searchValue),
          where("fullName", "<=", searchValue + "\uf8ff")
        ),
        query(
          registrationCollection,
          where("cnic", ">=", searchValue),
          where("cnic", "<=", searchValue + "\uf8ff")
        ),
      ];

      // Execute user queries in parallel
      const userSnapshots = await Promise.all(
        userQueries.map((q) => getDocs(q))
      );
      const userResults = userSnapshots.flatMap((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      // Execute registration queries in parallel
      const registrationSnapshots = await Promise.all(
        registrationQueries.map((q) => getDocs(q))
      );
      const registrationResults = registrationSnapshots.flatMap((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

      // Combine results from users and registration_form_data
      const uniqueUsers = Array.from(
        new Map(userResults.map((user) => [user.id, user])).values()
      );

      const registrationPromises = uniqueUsers.map(async (user) => {
        // Fetch registration details for each user
        const registrationDocRef = doc(registrationCollection, user.id);
        const registrationDoc = await getDoc(registrationDocRef);

        if (registrationDoc.exists()) {
          return { ...user, registrationDetails: registrationDoc.data() };
        } else {
          return { ...user, registrationDetails: null };
        }
      });

      const usersWithRegistrationData = await Promise.all(registrationPromises);

      // Handle cases where registration documents exist but no corresponding user data
      const registrationOnlyPromises = registrationResults.map(
        async (registrationDoc) => {
          if (!registrationDoc.userId) return null; // Skip if userId is missing

          const userDocRef = doc(usersCollection, registrationDoc.userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            return {
              id: userDoc.id,
              ...userDoc.data(),
              registrationDetails: registrationDoc, // Attach registration details
            };
          } else {
            // Handle case where user is not found in the users collection
            return {
              id: registrationDoc.userId,
              registrationDetails: registrationDoc,
            };
          }
        }
      );

      const registrationOnlyUsers = (
        await Promise.all(registrationOnlyPromises)
      ).filter((user) => user !== null);

      // Merge all results and remove duplicates
      const combinedResults = [
        ...usersWithRegistrationData,
        ...registrationOnlyUsers,
      ];
      const uniqueResults = Array.from(
        new Map(combinedResults.map((user) => [user.id, user])).values()
      );

      setUsersData(uniqueResults.length > 0 ? uniqueResults : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchUsers = debounce((value) => fetchUsers(value), 100);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      debouncedFetchUsers(value);
    } else {
      setUsersData([]); // Clear results if input is empty
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  console.log(usersData);

  const [toggleReplaceCertification, setToggleReplaceCertification] =
    useState(false);
  const [oldCertifications, setOldCertifications] = useState([]);
  const [activeCertifications, setActiveCertifications] = useState([]);
  const [wholeData, setWholeData] = useState(null);

  // Fetch Active Certifications
  const fetchActiveCertifications = async () => {
    try {
      const certificationsRef = collection(firestore, "courses"); // Replace 'courses' with your actual collection name
      const q = query(certificationsRef, where("courseStatus", "==", "active"));
      const snapshot = await getDocs(q);

      const activeCerts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(activeCerts);
      setActiveCertifications(activeCerts);
    } catch (error) {
      console.error("Error fetching active certifications:", error);
    }
  };

  const fetchThinkificKeys = async () => {
    try {
      const docRef = doc(firestore, "thinkifickeys", "thinkificConfig"); // Access the document
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data(); // Return the data from the document
      } else {
        console.error("No such document!");
        throw new Error("Thinkific keys not found.");
      }
    } catch (error) {
      console.error("Error fetching Thinkific keys:", error);
      throw error;
    }
  };

  console.log(activeCertifications);

  const [userId, setUserID] = useState("");
  // Handle Toggle Replace Certifications
  const handleToggleReplaceCertifications = async (data, wholeData, userID) => {
    setWholeData(wholeData);
    setUserID(userID);
    setToggleReplaceCertification(!toggleReplaceCertification);
    setOldCertifications(data); // Pass selected certifications
    if (data?.length > 0) {
      setSelectedOldCertification(data[0].courseTitle); // Automatically set the first courseTitle
    }
    await fetchActiveCertifications(); // Ensure this call completes
  };

  const [toogleEditUserProfileData, setToggleEditUserProfileData] =
    useState(false);
  const [EditUserProfileData, setEditUserProfileData] = useState(null);
  const handleEditUserProfileData = async (user) => {
    setToggleEditUserProfileData(!toogleEditUserProfileData);
    setEditUserProfileData(user);
  };

  // Log to verify active certifications
  useEffect(() => {
    console.log("Active Certifications:", activeCertifications);
  }, [activeCertifications]);

  const handleSaveChanges = async () => {
    const keys = await fetchThinkificKeys(); // Thinkific keys fetched...

    if (!selectedOldCertification || !selectedNewCertification) {
      alert("Please select both old and new certifications.");
      return;
    }

    try {
      const userDocRef = doc(firestore, "registration_form_data", userId);

      // Step 1: Find the old course enrollment data
      const oldCourse = wholeData.find(
        (course) => course.data.course_name === selectedOldCertification
      );

      if (!oldCourse || !oldCourse.data.id) {
        throw new Error("Old course enrollment ID not found.");
      }

      const oldEnrollmentId = oldCourse.data.id;

      // Step 2: Find the new course in activeCertifications
      const newCourse = activeCertifications.find(
        (course) => course.courseTitle === selectedNewCertification
      );

      if (!newCourse || !newCourse.courseId) {
        throw new Error("New course ID not found.");
      }

      const newCourseId = newCourse.courseId;

      // Step 3: Deactivate the old course enrollment in Thinkific
      const deactivateResponse = await fetch(
        `https://api.thinkific.com/api/public/v1/enrollments/${oldEnrollmentId}`,
        {
          method: "PUT",
          headers: {
            "X-Auth-API-Key": "9e2d5a6420e27c5337433e8d1b9cf62c",
            "X-Auth-Subdomain": "DigiPAKISTAN",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ expiry_date: new Date().toISOString() }),
        }
      );

      if (!deactivateResponse.ok) {
        throw new Error("Failed to deactivate the old course.");
      }

      console.log(
        `Old course ${selectedOldCertification} deactivated successfully.`
      );

      // Step 4: Enroll the user in the new course
      const enrollmentData = {
        course_id: newCourseId,
        user_id: oldCourse.data.user_id,
        activated_at: new Date().toISOString(),
      };

      const enrollResponse = await axios.post(
        "https://api.thinkific.com/api/public/v1/enrollments",
        enrollmentData,
        {
          headers: {
            "X-Auth-API-Key": keys.thinkific_api_key,
            "X-Auth-Subdomain": keys.thinkific_subdomain,
            "Content-Type": "application/json",
          },
        }
      );

      if (enrollResponse.status !== 201) {
        throw new Error("Failed to enroll user in the new course.");
      }

      const enrollData = enrollResponse.data; // Thinkific response
      console.log(`User enrolled in new course ${selectedNewCertification}.`);

      // Step 5: Update Firestore
      // Update enrollingDataForm with new course data and Thinkific response
      const updatedEnrollingDataForm = wholeData.map((course) => {
        if (course.data.course_name === selectedOldCertification) {
          return {
            ...course,
            data: {
              ...enrollData, // Store the full response from Thinkific
              course_name: selectedNewCertification,
              updated_at: new Date().toISOString(),
            },
          };
        }
        return course;
      });

      // Append the new course object to selectedCourses
      const existingDoc = await getDoc(userDocRef);
      const currentSelectedCourses = existingDoc.exists()
        ? existingDoc.data().selectedCourses || []
        : [];

      const updatedSelectedCourses = [
        newCourse, // Push the new course object
      ];

      await updateDoc(userDocRef, {
        enrollingDataForm: updatedEnrollingDataForm,
        selectedCourses: updatedSelectedCourses,
      });

      console.log("Firestore document updated successfully.");

      setUsersData((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              registrationDetails: {
                ...user.registrationDetails,
                enrollingDataForm: updatedEnrollingDataForm,
                selectedCourses: updatedSelectedCourses,
              },
            };
          }
          return user;
        })
      );

      alert("Enrollment updated successfully with Thinkific LMS data!");
    } catch (error) {
      console.error("Error updating certifications: ", error.message);
      alert("An error occurred while updating certifications.");
    }
  };

  const [verifyUserByIdOnPortalLoading, setVerifyUserByIdOnPortalLoading] =
    useState(false);
  const [verifyUserByIdOnPortalData, setVerifyUserByIdOnPortalData] =
    useState(null);
  const [userNotFoundOnPortal, setPortalVerificationError] = useState(false);

  const verifyUserByIdOnPortal = async (user_id) => {
    setVerifyUserByIdOnPortalLoading(true);
    try {
      const keys = await fetchThinkificKeys(); // Thinkific keys fetched...
      const response = await axios.get(
        `https://api.thinkific.com/api/public/v1/users/${user_id}`,
        {
          method: "GET",
          headers: {
            "X-Auth-API-Key": keys.thinkific_api_key,
            "X-Auth-Subdomain": keys.thinkific_subdomain,
            "Content-Type": "application/json",
          },
        }
      );

      const res = await response.data;

      setVerifyUserByIdOnPortalData(res);
      setTimeout(() => {
        setVerifyUserByIdOnPortalLoading(false);
      }, 4000);

      setTimeout(() => {
        setVerifyUserByIdOnPortalData(null);
      }, 6000);
    } catch (error) {
      console.error("Error verifying user on portal:", error.message);
      setPortalVerificationError(true); // Set error flag to true
      setVerifyUserByIdOnPortalData(null); // Clear any existing data
    } finally {
      setVerifyUserByIdOnPortalLoading(false); // Ensure loading state is turned off
    }
  };

  const [createUserOnThinkificPortal, setCreateUserOnThinkificPortal] =
    useState(false);
  const [
    failedToCreateUserOoPortalbecauseAlreadyCreated,
    setFailedToCreateUserOoPortalbecauseAlreadyCreated,
  ] = useState(false);
  const createUserOnThinkific = async (userDetails) => {
    const { email, firstName, lastName, password, firestoreUserId } =
      userDetails;
    setCreateUserOnThinkificPortal(true);

    try {
      // Fetch Thinkific API keys
      const keys = await fetchThinkificKeys(); // Replace with your key-fetching logic

      // Create the user on Thinkific
      const createUserResponse = await axios.post(
        "https://api.thinkific.com/api/public/v1/users",
        {
          email,
          first_name: firstName,
          last_name: lastName,
          password,
        },
        {
          headers: {
            "X-Auth-API-Key": keys.thinkific_api_key,
            "X-Auth-Subdomain": keys.thinkific_subdomain,
            "Content-Type": "application/json",
          },
        }
      );

      const createdUserData = createUserResponse.data;

      console.log("New user created on Thinkific:", createdUserData);

      // Update Firestore user document
      const userDocRef = doc(firestore, "users", firestoreUserId); // Update document based on Firestore user ID from function arguments
      await updateDoc(userDocRef, {
        isEmailVerified: true,
        portalDetails: {
          administered_course_ids:
            createdUserData.administered_course_ids || null,
          affiliate_code: createdUserData.affiliate_code || null,
          affiliate_commission: createdUserData.affiliate_commission || null,
          affiliate_commission_type:
            createdUserData.affiliate_commission_type || "%",
          affiliate_payout_email:
            createdUserData.affiliate_payout_email || null,
          avatar_url: createdUserData.avatar_url || null,
          bio: createdUserData.bio || null,
          company: createdUserData.company || null,
          created_at: createdUserData.created_at || new Date().toISOString(),
          custom_profile_fields: createdUserData.custom_profile_fields || [],
          email: createdUserData.email,
          external_source: createdUserData.external_source || null,
          first_name: createdUserData.first_name,
          full_name: `${createdUserData.first_name} ${createdUserData.last_name}`,
          headline: createdUserData.headline || null,
          id: createdUserData.id,
          last_name: createdUserData.last_name,
          lms_password: password, // Use the provided password
          roles: createdUserData.roles || [],
        },
      });

      const registrationRef = doc(
        firestore,
        "registration_form_data",
        firestoreUserId
      ); // Update document based on Firestore user ID from function arguments
      await updateDoc(registrationRef, {
        currentStep: 3,
        isEmailVerified: true,
        portalDetails: {
          administered_course_ids:
            createdUserData.administered_course_ids || null,
          affiliate_code: createdUserData.affiliate_code || null,
          affiliate_commission: createdUserData.affiliate_commission || null,
          affiliate_commission_type:
            createdUserData.affiliate_commission_type || "%",
          affiliate_payout_email:
            createdUserData.affiliate_payout_email || null,
          avatar_url: createdUserData.avatar_url || null,
          bio: createdUserData.bio || null,
          company: createdUserData.company || null,
          created_at: createdUserData.created_at || new Date().toISOString(),
          custom_profile_fields: createdUserData.custom_profile_fields || [],
          email: createdUserData.email,
          external_source: createdUserData.external_source || null,
          first_name: createdUserData.first_name,
          full_name: `${createdUserData.first_name} ${createdUserData.last_name}`,
          headline: createdUserData.headline || null,
          id: createdUserData.id,
          last_name: createdUserData.last_name,
          lms_password: password, // Use the provided password
          roles: createdUserData.roles || [],
        },
      });

      console.log("LMS user data updated in Firestore successfully.");

      return {
        status: "created",
        user: createdUserData,
      };
    } catch (error) {
      setCreateUserOnThinkificPortal(false);
    }
  };

  const [editUserProfileDataForChanges, setEditUserProfileDataForChanges] =
    useState({
      email: "",
      password: "",
      cnic: "",
      fullname: "",
      phone: "",
    });
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditUserProfileDataForChanges((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setEditUserProfileDataForChanges({
      email: EditUserProfileData?.email || "",
      password: EditUserProfileData?.password || "",
      cnic: EditUserProfileData?.registrationDetails.cnic || "",
      fullname: EditUserProfileData?.registrationDetails.fullname || "",
      phone: EditUserProfileData?.registrationDetails.phone || "",
    });
  }, [EditUserProfileData]);

  const EditUserProfileDataFunction = async () => {
    try {
      const response = await fetch("/api/updateuserpassword-from-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: EditUserProfileData.uid,
          email: EditUserProfileData.email,
          password: editUserProfileDataForChanges.password,
          user_id: EditUserProfileData.portalDetails.id,
        }),
      });

      const userDataRef = doc(firestore, "users", EditUserProfileData.uid);
      const userRegistrationRef = doc(
        firestore,
        "registration_form_data",
        EditUserProfileData.uid
      );

      const userUpdatingData = {
        email: editUserProfileDataForChanges.email,
        password: editUserProfileDataForChanges.password,
      };

      const registrationDataUpdate = {
        email: editUserProfileDataForChanges.email,
        password: editUserProfileDataForChanges.password,
        cnic: editUserProfileDataForChanges.cnic,
        phone: editUserProfileDataForChanges.phone,
        fullname: editUserProfileDataForChanges.fullname,
      };

      // Update Firestore documents
      await Promise.all([
        updateDoc(userDataRef, {
          ...userUpdatingData,
          "portalDetails.email": userUpdatingData.email,
          "portalDetails.lms_password": userUpdatingData.password,
        }),
        updateDoc(userRegistrationRef, {
          ...registrationDataUpdate,
          "portalDetails.email": registrationDataUpdate.email,
          "portalDetails.lms_password": registrationDataUpdate.password,
        }),
      ]);

      // Update local UI state
      setUsersData((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === EditUserProfileData.uid
            ? {
                ...user,
                ...editUserProfileDataForChanges,
                registrationDetails: {
                  ...user.registrationDetails,
                  ...editUserProfileDataForChanges,
                },
                portalDetails: {
                  ...user.portalDetails,
                  ...editUserProfileDataForChanges,
                },
              }
            : user
        )
      );

      console.log("User profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const updateUserEnrollmentOnPortal = async (userData, courseId) => {
    const keys = await fetchThinkificKeys(); // Thinkific keys fetched...

    const userDocRef = doc(firestore, "registration_form_data", userData.uid);

    const enrollmentData = {
      course_id: courseId,
      user_id: userData.portalDetails.id,
      activated_at: new Date().toISOString(),
    };

    const enrollResponse = await axios.post(
      "https://api.thinkific.com/api/public/v1/enrollments",
      enrollmentData,
      {
        headers: {
          "X-Auth-API-Key": keys.thinkific_api_key,
          "X-Auth-Subdomain": keys.thinkific_subdomain,
          "Content-Type": "application/json",
        },
      }
    );

    if (enrollResponse.status !== 201) {
      throw new Error("Failed to enroll user in the new course.");
    }

    const enrollData = enrollResponse.data; // Thinkific response
    console.log(`User enrolled in new course ${selectedNewCertification}.`);

    // Step 5: Update Firestore
    // Update enrollingDataForm with new course data and Thinkific response
    const updatedEnrollingDataForm = {
      ...enrollData, // Store the full response from Thinkific
    };

    await updateDoc(userDocRef, {
      enrollingDataForm: updatedEnrollingDataForm,
    });
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
              DashboardPageInfo={"Students Issue Panel"}
              icons={<AiOutlineIssuesClose size={20} />}
            />
            <div className="flex flex-col gap-2 bg-white" id="status">
              <div className="flex justify-between py-7 w-full items-center px-5">
                <h2 className="text-sm font-semibold">
                  Search by{" "}
                  <span className="text-[12px] font-normal">
                    "FullName/Email/Phone Number/CNIC Number"
                  </span>
                  {/* <button onClick={verifyUserByIdOnPortal}>test</button> */}
                </h2>
                <div className="items-center gap-3">
                  <span>Search</span>
                  <div className="flex gap-3 items-center">
                    <div className="border w-[300px] py-1 rounded px-2">
                      <input
                        placeholder="Search..."
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="bg-transparent outline-none w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr className="" />
              <div className="">
                {loading ? (
                  <div className="flex h-screen items-center justify-center">
                    <div className="animate-spin h-20 w-20 border-[5px] border-gray-200 border-t-primary rounded-full"></div>
                  </div>
                ) : usersData.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {/* Header Row */}
                    <div className="grid grid-cols-2 font-semibold bg-gray-100 px-10 py-3 rounded">
                      <div>Showing Data of {usersData.length} users.</div>
                    </div>

                    {/* Data Rows */}
                    {usersData.map((user, idx) => (
                      <div key={idx}>
                        <div
                          key={user.id}
                          className="grid grid-cols-2 gap-5 border-b px-10 py-3"
                        >
                          <div className="">
                            <div className="flex w-full  gap-1">
                              <div className="font-bold text-center underline">
                                Student Data
                              </div>
                            </div>
                            <div className="w-full mt-10 flex p-3 rounded-lg border  gap-4">
                              <FaUserCircle size={40} />
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">FullName:</span>
                                  <span className="text-[13px]">
                                    {" "}
                                    {user.firstName || "N/A"}{" "}
                                    {user.lastName || ""}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleEditUserProfileData(user)
                                    }
                                  >
                                    <MdModeEdit />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Email:</span>
                                  <span className="text-[13px]">
                                    {" "}
                                    {user.email || "N/A"}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleEditUserProfileData(user)
                                    }
                                  >
                                    <MdModeEdit />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Phone:</span>
                                  <span className="text-[13px]">
                                    {" "}
                                    {user.registrationDetails?.phone ||
                                      "no number yet."}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleEditUserProfileData(user)
                                    }
                                  >
                                    <MdModeEdit />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">CNIC:</span>
                                  <span className="text-[13px]">
                                    {" "}
                                    {user.registrationDetails?.cnic ||
                                      "no number yet."}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleEditUserProfileData(user)
                                    }
                                  >
                                    <MdModeEdit />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">
                                    Signup Date:
                                  </span>
                                  <span className="text-[13px]">
                                    {" "}
                                    {user.created_at
                                      .toDate()
                                      .toLocaleString() || "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">
                                    Application Submittion Date:
                                  </span>
                                  <span className="text-[13px]">
                                    {" "}
                                    {user.registrationDetails?.created_at
                                      ? (() => {
                                          let date;

                                          // If it's a Firestore Timestamp, convert it
                                          if (
                                            user.registrationDetails.created_at
                                              ?.toDate
                                          ) {
                                            date =
                                              user.registrationDetails.created_at.toDate();
                                          }
                                          // If it's already a Date or ISO string, convert it directly
                                          else {
                                            date = new Date(
                                              user.registrationDetails.created_at
                                            );
                                          }

                                          // Format the date
                                          return date.toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                          });
                                        })()
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">
                                    Application Approvel Date:
                                  </span>
                                  <span className="text-[13px]">
                                    {" "}
                                    {user.registrationDetails?.approvalTime
                                      ? (() => {
                                          let date;

                                          // If it's a Firestore Timestamp, convert it
                                          if (
                                            user.registrationDetails
                                              .approvalTime?.toDate
                                          ) {
                                            date =
                                              user.registrationDetails.approvalTime.toDate();
                                          }
                                          // If it's already a Date or ISO string, convert it directly
                                          else {
                                            date = new Date(
                                              user.registrationDetails.approvalTime
                                            );
                                          }

                                          // Format the date
                                          return date.toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                          });
                                        })()
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full flex flex-col gap-2">
                            <div className="flex w-full  gap-1">
                              <div className="font-bold text-center underline">
                                Credentials-Status
                              </div>
                            </div>
                            <div className="font-medium mt-8">Status:</div>
                            <div className="grid grid-cols-2 w-full  gap-2">
                              <div
                                className={`rounded-full flex items-center gap-1 px-2 text-[13px] py-[0.4rem] ${
                                  user.isEmailVerified
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              >
                                {user.isEmailVerified ? (
                                  <IoMdCheckmarkCircleOutline size={23} />
                                ) : (
                                  <FaRegCircleXmark size={23} />
                                )}
                                {user.isEmailVerified
                                  ? "Email Verified"
                                  : "Application Not Verified"}
                              </div>

                              <div
                                className={`rounded-full flex items-center gap-1 px-2 text-[13px] py-[0.4rem] ${
                                  user.isApplicationSubmitted
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              >
                                {user.isApplicationSubmitted ? (
                                  <IoMdCheckmarkCircleOutline size={23} />
                                ) : (
                                  <FaRegCircleXmark size={23} />
                                )}
                                {user.isApplicationSubmitted
                                  ? "Application Submitted."
                                  : "Application Not Submitted."}
                              </div>
                              <div
                                className={`rounded-full flex items-center gap-1 px-2 text-[13px] py-[0.4rem] ${
                                  user.isApproved
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              >
                                {user.isApproved ? (
                                  <IoMdCheckmarkCircleOutline size={23} />
                                ) : (
                                  <FaRegCircleXmark size={23} />
                                )}
                                {user.isApproved
                                  ? "Application Approved."
                                  : "Application Not Approved."}
                              </div>
                              <div
                                className={`rounded-full flex items-center gap-1.5 px-2 text-[13px] py-[0.4rem] ${
                                  user.registrationDetails
                                    ?.registrationStatus === "completed"
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              >
                                {user.registrationDetails
                                  ?.registrationStatus ? (
                                  <IoMdCheckmarkCircleOutline size={23} />
                                ) : (
                                  <FaRegCircleXmark size={23} />
                                )}
                                {user.registrationDetails
                                  ?.registrationStatus === "completed"
                                  ? "Fee Paid"
                                  : "Fee Unpaid"}
                              </div>
                            </div>
                            <div className="flex mt-4 gap-1">
                              <div className="font-medium">Web Password:</div>
                              <div
                                className={`rounded-full text-[13px] py-[0.2rem]`}
                              >
                                {user.password}
                              </div>
                              <button
                                onClick={() => handleEditUserProfileData(user)}
                              >
                                <MdModeEdit />
                              </button>
                            </div>
                            <div className="flex gap-1">
                              <div className="font-medium">LMS ID:</div>
                              <div
                                className={`rounded-full text-[13px] py-[0.2rem]`}
                              >
                                {user?.portalDetails?.id ||
                                  "Not Registered yet."}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <div className="font-medium">Web User Id:</div>
                              <div
                                className={`rounded-full text-[13px] py-[0.2rem]`}
                              >
                                {user?.uid || "Not Registered yet."}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <div className="font-medium">Consumer Id:</div>
                              <div
                                className={`rounded-full text-[13px] py-[0.2rem]`}
                              >
                                {user.password}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <div className="font-medium">LMS Password:</div>
                              <div
                                className={`rounded-full text-[13px] py-[0.2rem]`}
                              >
                                {user.portalDetails?.lms_password ||
                                  "Not Registered yet."}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <div className="font-medium">Fee deadline:</div>
                              <div
                                className={`rounded-full text-[13px] py-[0.2rem]`}
                              >
                                {user.isApproved &&
                                user.isApplicationSubmitted &&
                                !user.isEnrollmentCompleted
                                  ? "No deadline because admission fee has been paid.."
                                  : "Not registered yet."}
                              </div>
                            </div>

                            <hr />
                            <div className="flex gap-1 justify-center">
                              <div className="font-bold text-center underline">
                                Actions
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 mb-4">
                              <button
                                onClick={() =>
                                  handleToggleReplaceCertifications(
                                    user.registrationDetails?.selectedCourses,
                                    user.registrationDetails.enrollingDataForm,
                                    user.uid
                                  )
                                }
                                className="font-medium text-[13px] w-1/3 flex items-center gap-1 bg-primary py-1 rounded-lg text-white px-2"
                              >
                                <FiRefreshCcw />{" "}
                                <span>Replace Certification</span>
                              </button>
                              <button
                                onClick={() => handleEditUserProfileData(user)}
                                className="font-medium text-[13px] w-[30%] flex items-center gap-1 bg-primary py-1 rounded-lg text-white px-2"
                              >
                                <FaUserEdit />
                                <span>Edit User Profile</span>
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    console.log(
                                      "Creating user on Thinkific..."
                                    );

                                    const result = await createUserOnThinkific({
                                      email: user.email, // Replace with the actual email field
                                      firstName: user.firstName, // Replace with the actual first name field
                                      lastName: user.lastName, // Replace with the actual last name field
                                      password: user.password, // Replace with the actual password field
                                      firestoreUserId: user.uid, // Replace with the actual password field
                                    });

                                    alert(
                                      result.status === "created"
                                        ? `User ${result.user.full_name} created successfully!`
                                        : "User already exists on Thinkific."
                                    );
                                  } catch (error) {
                                    // Handle API-specific error messages
                                    if (
                                      error.response &&
                                      error.response.data.errors?.email?.[0] ===
                                        "has already been taken"
                                    ) {
                                      alert(
                                        "User with this email already exists on Thinkific."
                                      );
                                    } else {
                                      setFailedToCreateUserOoPortalbecauseAlreadyCreated(
                                        true
                                      );

                                      setTimeout(() => {
                                        setFailedToCreateUserOoPortalbecauseAlreadyCreated(
                                          false
                                        );
                                      }, 6000);
                                    }
                                  }
                                }}
                                className="font-medium text-[13px] w-[37%] flex items-center gap-1 bg-primary py-1 rounded-lg text-white px-2"
                              >
                                {createUserOnThinkificPortal ? (
                                  <div className="animate-spin h-4 w-4 border border-t-transparent border-white rounded-full"></div>
                                ) : (
                                  <FaUserPlus />
                                )}

                                <span>Create User On Portal</span>
                              </button>
                              <button
                                onClick={() =>
                                  verifyUserByIdOnPortal(user.portalDetails.id)
                                }
                                className="font-medium text-[13px] w-[35%] flex items-center gap-1 bg-primary py-1 rounded-lg text-white px-2"
                              >
                                {verifyUserByIdOnPortalLoading ? (
                                  <div>
                                    <div className="animate-spin h-4 w-4 border border-t-transparent border-white rounded-full"></div>
                                  </div>
                                ) : (
                                  <RiShieldUserLine size={15} />
                                )}
                                <span className="w-full">
                                  Verify User On Portal
                                </span>
                              </button>{" "}
                            </div>
                          </div>
                          {verifyUserByIdOnPortalLoading ? (
                            <AnimatePresence mode="wait">
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="border-2 bg-gray-200 w-[90%] mx-auto p-4 rounded-2xl"
                              >
                                <span>Loading...</span>
                              </motion.div>
                            </AnimatePresence>
                          ) : verifyUserByIdOnPortalData ? (
                            <AnimatePresence mode="wait">
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="border-2 bg-primary w-[90%] mx-auto p-4 rounded-2xl"
                              >
                                <IoCheckmarkDone className="mb-2" size={20} />
                                <span className="text-[16px] font-bold ">
                                  {verifyUserByIdOnPortalData.full_name}
                                </span>
                                <h5 className="text-[13px] ">
                                  The user is already registered on the Learning
                                  Management System (LMS). All account details
                                  have been verified, and the user is ready to
                                  access DigiPAKISTAN Program resources and
                                  training materials.
                                </h5>
                              </motion.div>
                            </AnimatePresence>
                          ) : userNotFoundOnPortal ? (
                            <AnimatePresence mode="wait">
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="border-2 bg-yellow-300 w-[90%] mx-auto p-4 rounded-2xl"
                              >
                                <span>User is not registered on portal.</span>
                              </motion.div>
                            </AnimatePresence>
                          ) : failedToCreateUserOoPortalbecauseAlreadyCreated ? (
                            <AnimatePresence mode="wait">
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="border-2 bg-amber-300 w-[90%] mx-auto p-4 rounded-2xl"
                              >
                                <IoIosWarning className="mb-2" size={20} />
                                <h5 className="text-[13px] ">
                                  The user is already registered on the Learning
                                  Management System (LMS). All account details
                                  have been verified, and the user is ready to
                                  access DigiPAKISTAN Program resources and
                                  training materials.
                                </h5>
                              </motion.div>
                            </AnimatePresence>
                          ) : null}
                        </div>

                        <div className="py-10 px-10 border-b-2 border-gray-950">
                          <h1 className="font-bold underline text-[15px]">
                            Enrolled Certifications:
                          </h1>
                          <div className="text-[13px] mt-3">
                            {user.registrationDetails?.selectedCourses
                              .length === 0 ? (
                              <h2>No Enrollment yet.</h2>
                            ) : (
                              user.registrationDetails?.selectedCourses.map(
                                (data, ifx) => (
                                  <div
                                    key={ifx}
                                    className="flex items-center gap-2"
                                  >
                                    <span>{data.courseTitle}.</span>{" "}
                                    <button
                                      onClick={() =>
                                        updateUserEnrollmentOnPortal(
                                          user,
                                          data.courseId
                                        )
                                      }
                                      className="flex py-1 pr-4 pl-2 text-white font-semibold bg-primary rounded-lg items-center gap-1"
                                    >
                                      <GrDocumentUpdate size={18} />
                                      <span>Enroll On Portal.</span>
                                    </button>
                                  </div>
                                )
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <Modal
                      isOpen={toggleReplaceCertification}
                      onClose={() => setToggleReplaceCertification(false)}
                    >
                      <h2 className="text-xl font-semibold p-6 mb-4">
                        Replace Certifications on LMS and on WebSite.
                      </h2>
                      <hr />
                      <div className="mt-10 px-6">
                        <span className="font-bold text-[13px] mb-1">
                          User Selected Certification.
                        </span>
                        <select
                          className="w-full outline-none border rounded-lg p-2"
                          name=""
                          onChange={(e) =>
                            setSelectedOldCertification(e.target.value)
                          }
                          id=""
                          value={selectedOldCertification}
                        >
                          {oldCertifications?.map((course, idx) => (
                            <option key={idx} value={course.courseTitle}>
                              {course.courseTitle}
                            </option>
                          ))}
                        </select>
                        <div className="flex justify-center my-10">
                          <FaExchangeAlt className="rotate-90" />
                        </div>
                        <span className="font-bold text-[13px] mb-1">
                          Change With.
                        </span>
                        <select
                          className="w-full outline-none border rounded-lg p-2"
                          name=""
                          id=""
                          defaultValue={activeCertifications[0]?.courseTitle}
                          onChange={(e) =>
                            setSelectedNewCertification(e.target.value)
                          }
                        >
                          {activeCertifications.map((cert, idx) => (
                            <option key={idx} value={cert.courseTitle}>
                              {cert.courseTitle}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleSaveChanges}
                          className="mt-[5rem] bg-primary py-2 px-5 rounded-lg font-bold text-white"
                        >
                          Save Changes
                        </button>
                      </div>
                    </Modal>

                    <Modal
                      isOpen={toogleEditUserProfileData}
                      onClose={() => setToggleEditUserProfileData(false)}
                    >
                      <h2 className="text-xl font-semibold p-4">
                        Edit User Profile
                      </h2>
                      <hr />
                      <div className="mt-4 flex flex-col justify-between h-full px-6">
                        <form
                          action=""
                          onSubmit={async (e) => {
                            e.preventDefault();
                            await EditUserProfileDataFunction();
                          }}
                          className="space-y-6 bg-white "
                        >
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="w-full">
                              <label
                                htmlFor="fullname"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Full Name
                              </label>
                              <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                onChange={onChangeHandler}
                                value={editUserProfileDataForChanges.fullname}
                                placeholder="Enter Full Name"
                                className="py-2 px-3 w-full border rounded-lg shadow-sm text-gray-800 outline-none focus:ring-primary focus:border-primary"
                              />
                            </div>
                            <div className="w-full">
                              <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Phone Number
                              </label>
                              <input
                                type="text"
                                id="phone"
                                onChange={onChangeHandler}
                                name="phone"
                                value={editUserProfileDataForChanges.phone}
                                placeholder="Enter Phone Number"
                                className="py-2 px-3 w-full border rounded-lg shadow-sm text-gray-800 outline-none focus:ring-primary focus:border-primary"
                              />
                            </div>

                            <div className="w-full">
                              <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Website Password
                              </label>
                              <input
                                type="text"
                                onChange={onChangeHandler}
                                id="password"
                                name="password"
                                value={editUserProfileDataForChanges?.password}
                                placeholder="Enter Website Password"
                                className="py-2 px-3 w-full border rounded-lg shadow-sm text-gray-800 outline-none focus:ring-primary focus:border-primary"
                              />
                            </div>
                            <div className="w-full">
                              <label
                                htmlFor="cnic"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                CNIC
                              </label>
                              <input
                                onChange={onChangeHandler}
                                type="text"
                                id="cnic"
                                name="cnic"
                                value={editUserProfileDataForChanges.cnic}
                                placeholder="Enter CNIC"
                                className="py-2 px-3 w-full border rounded-lg shadow-sm text-gray-800 outline-none focus:ring-primary focus:border-primary"
                              />
                            </div>
                            <div className="w-full">
                              <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Email
                              </label>
                              <input
                                onChange={onChangeHandler}
                                type="email"
                                id="email"
                                name="email"
                                value={editUserProfileDataForChanges?.email}
                                placeholder="Enter Email Address"
                                className="py-2 px-3 w-full border rounded-lg shadow-sm text-gray-800 outline-none focus:ring-primary focus:border-primary"
                              />
                            </div>
                          </div>
                          <div className="text-right">
                            <button
                              type="submit"
                              className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-lg shadow-lg transition-all duration-200"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </Modal>
                  </div>
                ) : true ? (
                  <h1 className="flex h-screen items-center justify-center">
                    <div className="flex flex-col items-center">
                      <h1 className="text-2xl font-bold text-gray-700">
                        Start searching for users now!
                      </h1>
                      <Image
                        src={"/search-student-issue-panel.gif"}
                        className=""
                        width={200}
                        height={200}
                        alt="search"
                      ></Image>
                    </div>
                  </h1>
                ) : (
                  <div className="flex justify-center h-screen w-full py-10">
                    <p className="">No users found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default ManageCourses;
