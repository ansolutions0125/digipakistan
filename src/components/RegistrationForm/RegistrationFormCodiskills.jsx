"use client";
import React, { useEffect, useState } from "react";
import {
  MdAccountCircle,
  MdDelete,
  MdDevices,
  MdError,
  MdMarkEmailRead,
  MdMarkEmailUnread,
  MdOutlineMailLock,
  MdReportGmailerrorred,
} from "react-icons/md";
import { IoCloudUploadOutline, IoLocationOutline } from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";
import { GoDotFill, GoMultiSelect } from "react-icons/go";
import userHooks from "../../Hooks/userHooks";
import {
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  where,
  collection,
  query,
  getDocs,
} from "firebase/firestore";
import { auth, firestore, storage } from "../../Backend/Firebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getAllCourses } from "../../Backend/firebasefunctions";
import AppFormLoader from "../AppLoader/AppFormLoader";
import { useRouter } from "next/navigation";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import { TbFileCertificate } from "react-icons/tb";
import { CiBookmarkCheck, CiCircleInfo } from "react-icons/ci";
import { PiGraduationCapFill } from "react-icons/pi";
import { LiaAddressCard } from "react-icons/lia";
import { GrContactInfo } from "react-icons/gr";
import TickMarkAnimation from "../CoustomToast/TickMarkAnimation";
import { IoMdCheckmark } from "react-icons/io";
import { getScheduledTimeInUTC } from "@/lib/RegistrationApprovelTimeStamp";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import useAuthStore from "@/stores/authStore";
import Link from "next/link";
import Image from "next/image";

const RegistrationForm = () => {
  const stepNames = [
    {
      stepName: "Account Information",
      stepNameUrdu: "اکاؤنٹ کی معلومات",
      stepIcon: <MdAccountCircle />,
    },
    {
      stepName: "Email Verification",
      stepNameUrdu: "اکاؤنٹ کی معلومات",
      stepIcon: <MdOutlineMailLock />,
    },
    {
      stepName: "Personal Information",
      stepNameUrdu: "ذاتی معلومات",
      stepIcon: <CiCircleInfo />,
    },
    {
      stepName: "Educational Background",
      stepNameUrdu: "تعلیمی پس منظر",
      stepIcon: <PiGraduationCapFill />,
    },
    {
      stepName: "Select Certification",
      stepNameUrdu: "سرٹیفیکیشن منتخب کریں",
      stepIcon: <GoMultiSelect />,
    },
    {
      stepName: "Device Availability",
      stepNameUrdu: "ڈیوائس کی دستیابی",
      stepIcon: <MdDevices />,
    },
    {
      stepName: "Address Details",
      stepNameUrdu: "پتہ کی تفصیلات",
      stepIcon: <LiaAddressCard />,
    },
    {
      stepName: "Additional Information",
      stepNameUrdu: "اضافی معلومات",
      stepIcon: <GrContactInfo />,
    },

    {
      stepName: "Agreement Declaration",
      stepNameUrdu: "معاہدے کا اعلان",
      stepIcon: <CiBookmarkCheck />,
    },
  ];

  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
    duration: 5000,
  });
  const [emailExists, setEmailExists] = useState(false);
  const showToast = (message, type = "info", duration = 20000) => {
    setToast({ message, type, visible: true, duration });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  const [courses, setCourses] = useState([]);
  const { userData, loading } = userHooks();
  const [step, setStep] = useState(1);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const router = useRouter();
  const [showfileData, setShowfileData] = useState({
    degreedocument: "",
    residationalfile: "",
  });

  const [input, setInput] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    isEmailVerified: false,
    createdAt: Date.now(),
  });

  // Account SignUp / Account verification thing

  const [errors, setErrors] = useState({});

  // Validation logic for enrollment phase
  const validateEnrollmentStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.email) {
        newErrors.email = "Please enter your email address.";
        showToast("Please enter your email address.", "error", 2000);
      }
      if (!formData.firstName) {
        newErrors.firstName = "Please enter your first name.";
        showToast("Please enter your first name.", "error", 2000);
      }
      if (!formData.lastName) {
        newErrors.lastName = "Please enter your last name.";
        showToast("Please enter your last name.", "error", 2000);
      }
      if (!formData.password) {
        newErrors.password = "Please enter password.";
        showToast("Please enter password.", "error", 2000);
      }
    }
    if (step === 3) {
      if (!formData.fullname) {
        newErrors.fullname = "Full name is required";
        showToast("Full name is required", "error", 2000);
      }
      if (!formData.fathername) {
        newErrors.fathername = "Father name is required";
        showToast("Father name is required", "error", 2000);
      }
      if (!formData.cnic || !/^\d{13}$/.test(formData.cnic)) {
        newErrors.cnic = "Please enter a valid 13-digit CNIC number";
        showToast("Please enter a valid 13-digit CNIC number", "error", 2000);
      }
      if (!formData.phone) {
        newErrors.phone = "Please enter a phone number";
        showToast("Please enter a phone number", "error", 2000);
      } else if (!/^\d{11}$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid 11 digits phone number";
        showToast("Please enter a valid 11 digits phone number", "error", 2000);
      }
      if (!formData.maritalStatus) {
        newErrors.maritalStatus = "Marital status is required";
        showToast("Marital status is required", "error", 2000);
      } else if (formData.maritalStatus === "Select Marital Status") {
        newErrors.maritalStatus = "Please select your marital status";
        showToast("Please select your marital status", "error", 2000);
      }
      if (!formData.dob) {
        newErrors.dob = "Date of birth is required";
        showToast("Date of birth is required", "error", 2000);
      }
      if (!formData.gender) {
        newErrors.gender = "Select Your Gender";
        showToast("Select your gender", "error", 2000);
      } else if (formData.gender === "Select Your Gender") {
        newErrors.gender = "Select your gender";
        showToast("Select your gender", "error", 2000);
      }
    } else if (step === 4) {
      if (!formData.highestqualification) {
        newErrors.highestqualification = "Select your qualification";
        showToast("Select your qualification", "error", 2000);
      } else if (
        formData.highestqualification ===
        "Select Your Highest Educational Qualification"
      ) {
        newErrors.highestqualification = "Select your qualification";
        showToast("Select your qualification", "error", 2000);
      }
      if (!formData.university_or_institute_name) {
        newErrors.university_or_institute_name =
          "Enter your institute/university name.";
        showToast("Enter your institute/university name.", "error", 2000);
      }
      if (!formData.fieldstudy) {
        newErrors.fieldstudy = "Enter your field of study.";
        showToast("Enter your field of study.", "error", 2000);
      }
      if (!formData.completionyear) {
        newErrors.completionyear = "Enter your year of completion.";
        showToast("Enter your year of completion.", "error", 2000);
      }
      if (!formData.degreedocument) {
        newErrors.degreedocument = "Please submit a dergree or educational";
        showToast("Please submit a dergree or educational", "error", 2000);
      }
    } else if (step === 5) {
      if (!formData.course1) {
        newErrors.course1 = "Select at least 1 course";
        showToast("Select at least 1 course", "error", 2000);
      }
    } else if (step === 7) {
      if (!formData.permanentaddress) {
        newErrors.permanentaddress = "Enter your permanent address";
        showToast("Enter your permanent address", "error", 2000);
      }
      if (!formData.currentaddress) {
        newErrors.currentaddress = "Enter your current address";
        showToast("Enter your current address", "error", 2000);
      }
      if (!formData.city) {
        newErrors.city = "Enter your city";
        showToast("Enter your city", "error", 2000);
      }
    } else if (step === 8) {
      if (formData.areyou_employed === "Yes" && !formData.job_tittle) {
        newErrors.job_tittle = "This field is required";
        showToast("This field is required", "error", 2000);
      }
      if (formData.areyou_employed === "Yes" && !formData.organization_name) {
        newErrors.organization_name = "This field is required";
        showToast("This field is required", "error", 2000);
      }
    } else if (step === 9) {
      if (formData.agree_with_trems_and_form_sumbmtion === false) {
        newErrors.agree_with_trems_and_form_sumbmtion =
          "You must agree to the terms and conditions.";
        showToast("You must agree to the terms and conditions.", "error", 2000);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle input changes
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case "email":
        if (!value) {
          newErrors.email = "Please Enter a email.";
          showToast("Please Enter a email.", "error", 2000);
          setFetchedUserData(null);
        } else {
          delete newErrors.email;
        }
        break;

      case "firstName":
        if (!value) {
          newErrors.firstName = "Please Enter your first name.";
          showToast("Please Enter your first name.", "error", 2000);
        } else {
          delete newErrors.firstName;
        }
        break;

      case "lastName":
        if (!value) {
          newErrors.lastName = "Please Enter your last name.";
          showToast("Please Enter your last name.", "error", 2000);
        } else {
          delete newErrors.lastName;
        }
        break;

      case "fullname":
        if (!value) {
          newErrors.fullname = "Full name is required";
          showToast("Full name is required", "error", 2000);
        } else {
          delete newErrors.fullname;
        }
        break;

      case "fathername":
        if (!value) {
          newErrors.fathername = "Father name is required";
          showToast("Father name is required", "error", 2000);
        } else {
          delete newErrors.fathername;
        }
        break;

      case "cnic":
        if (!value || !/^\d{13}$/.test(value)) {
          newErrors.cnic = "Please enter a valid 13-digit CNIC number";
          showToast("Please enter a valid 13-digit CNIC number", "error", 2000);
        } else {
          delete newErrors.cnic;
        }
        break;

      case "phone":
        if (!value) {
          newErrors.phone = "Please enter a phone number";
          showToast("Please enter a phone number", "error", 2000);
        } else if (!/^\d{11}$/.test(value)) {
          newErrors.phone = "Please enter a valid 11 digits phone number";
          showToast(
            "Please enter a valid 11 digits phone number",
            "error",
            2000
          );
        } else {
          delete newErrors.phone;
        }
        break;

      case "maritalStatus":
        if (!value || value === "Select Marital Status") {
          newErrors.maritalStatus = "Please select your marital status";
          showToast("Please select your marital status", "error", 2000);
        } else {
          delete newErrors.maritalStatus;
        }
        break;

      case "dob":
        if (!value) {
          newErrors.dob = "Date of birth is required";
          showToast("Date of birth is required", "error", 2000);
        } else {
          delete newErrors.dob;
        }
        break;

      case "gender":
        if (!value || value === "Select Your Gender") {
          newErrors.gender = "Select your gender.";
          showToast("Select your gender.", "error", 2000);
        } else {
          delete newErrors.gender;
        }
        break;

      case "highestqualification":
        if (!value) {
          newErrors.highestqualification = "Please Select your qualification.";
          showToast("Please Select your qualification.", "error", 2000);
        } else {
          delete newErrors.highestqualification;
        }
        break;

      case "university_or_institute_name":
        if (!value) {
          newErrors.university_or_institute_name =
            "Please Enter your university/college name.";
          showToast(
            "Please Enter your university/college name.",
            "error",
            2000
          );
        } else {
          delete newErrors.university_or_institute_name;
        }
        break;

      case "fieldstudy":
        if (!value) {
          newErrors.fieldstudy = "Please enter the field you studied in.";
          showToast("Please enter the field you studied in.", "error", 2000);
        } else {
          delete newErrors.fieldstudy;
        }
        break;

      case "completionyear":
        if (!value) {
          newErrors.completionyear =
            "Please enter the year you completed your studys.";
          showToast(
            "Please enter the year you completed your studys.",
            "error",
            2000
          );
        } else {
          delete newErrors.completionyear;
        }
        break;

      case "course1":
        if (!value) {
          newErrors.course1 = "Please Select 1 course atleast.";
          showToast("Please Select 1 course atleast.", "error", 2000);
        } else {
          delete newErrors.course1;
        }
        break;

      case "permanentaddress":
        if (!value) {
          newErrors.permanentaddress = "Please enter your permanent address.";
          showToast("Please enter your permanent address.", "error", 2000);
        } else {
          delete newErrors.permanentaddress;
        }
        break;

      case "currentaddress":
        if (!value) {
          newErrors.currentaddress = "Please enter your current address.";
          showToast("Please enter your current address.", "error", 2000);
        } else {
          delete newErrors.currentaddress;
        }
        break;

      case "city":
        if (!value) {
          newErrors.city = "Please enter your city name.";
          showToast("Please enter your city name.", "error", 2000);
        } else {
          delete newErrors.city;
        }
        break;

      case "areyou_employed":
        if (value.areyou_employed === "Yes") {
          if (!value.job_tittle) {
            newErrors.city = "Please enter your city name.";
            showToast("Please enter your city name.", "error", 2000);
          }
          if (!value.e) {
            newErrors.city = "Please enter your city name.";
            showToast("Please enter your city name.", "error", 2000);
          }
        }
        break;

      case "city":
        if (!value) {
          newErrors.city = "Please enter your city name.";
          showToast("Please enter your city name.", "error", 2000);
        } else {
          delete newErrors.city;
        }
        break;

      default:
        break;
    }

    // Update error state
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Registration Form Data ==============================================================
  const [formData, setFormData] = useState({
    formId: uuidv4(),
    fullname: "",
    fathername: "",
    cnic: "",
    email: "",
    phone: "",
    maritalStatus: "",
    dob: "", //Data for birth
    gender: "",
    highestqualification: "",
    university_or_institute_name: "",
    fieldstudy: "",
    completionyear: "",
    degreedocument: "",
    course1: "",
    course2: "",
    course3: "",
    have_a_device: "Yes",
    have_a_internet_connection: "Yes",
    permanentaddress: "",
    currentaddress: "",
    city: "",
    areyou_employed: "Yes",
    job_tittle: "",
    organization_name: "",
    residationalfile: "",
    agree_with_trems_and_form_sumbmtion: false,
    created_at: serverTimestamp(),
    updated_at: Date.now(),
    totalFee: 0,
    selectedCourses: [],
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    isEmailVerified: false,
    id: "",
    userId: "",
  });

  const checkEmailExists = async (email) => {
    try {
      const usersRef = collection(firestore, "users");
      const emailQuery = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        setFetchedUserData(userDoc);
        setEmailExists(true);
        
        
        if (userDoc) {
          const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(userData),
            process.env.NEXT_PUBLIC_ENCRYPTION_KEY
          ).toString();

          Cookies.set("user_data", encryptedData, {
            expires: 7,
            secure: true,
            sameSite: "Strict",
          });
        }
        setEmailExists(true);
      } else {
        setFetchedUserData(null);
        setEmailExists(false);
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [createUserWithEmailAndPassword, user, loadingUser, errorUser] =
    useCreateUserWithEmailAndPassword(auth);

  const fetchAndStoreUserData = async (userId) => {
    try {
      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        useAuthStore.getState().setUserData(userData); // Set user data in the store

        // Assuming you might still need to encrypt and save to cookies
      
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(userData),
          process.env.NEXT_PUBLIC_ENCRYPTION_KEY
        ).toString();

        Cookies.set("user_data", encryptedData, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      } else {
        console.log("No such user found in Firestore.");
        useAuthStore.getState().clearUserData(); // Clear user data if not found
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
    }
  };

  const setUserData = useAuthStore((state) => state.setUserData);
  const isEmailVerified = useAuthStore((state) => state.isEmailVerified);

  useEffect(() => {
    if (userData && userData.email) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
        userId: userData.uid,
      }));
    }
    const getAllCoursesData = async () => {
      const coursess = await getAllCourses();
      setCourses(coursess.data);
    };
    getAllCoursesData();
  }, [userData]);

  console.log(formData);

  const calculateTotalFee = () => {
    let totalFee = 0;
    [formData.course1, formData.course2, formData.course3].forEach(
      (selectedCourse) => {
        if (selectedCourse) {
          const course = courses.find((c) => c.courseTitle === selectedCourse);
          if (course) totalFee += course.coursePrice;
        }
      }
    );
    setFormData((prevData) => ({ ...prevData, totalFee })); // Set totalFee in formData
  };

  // useEffect to call calculateTotalFee whenever course selections change
  useEffect(() => {
    calculateTotalFee();
  }, [formData.course1, formData.course2, formData.course3]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Update the field in formData immediately
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Perform validation
    validateField(name, value);

    // Handle email-specific behavior
    if (name === "email") {
      try {
        await checkEmailExists(value); // Pass the email value to the function
      } catch (error) {
        console.error("Error checking email:", error);
      }
    } else if (name.startsWith("course")) {
      // Handle course selection logic
      setFormData((prev) => {
        const selectedCourses = [...prev.selectedCourses];
        const courseIndex = parseInt(name.replace("course", ""), 10) - 1;

        if (value === "Select") {
          selectedCourses[courseIndex] = null;
        } else {
          const selectedCourse = courses.find(
            (course) => course.courseTitle === value
          );
          selectedCourses[courseIndex] = selectedCourse;
        }

        return {
          ...prev,
          [name]: value,
          selectedCourses: selectedCourses.filter(Boolean),
        };
      });
    }
  };

  const [registrationImagesLoader, setRegistrationImagesLoader] =
    useState(false);
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    let downloadURL = "";
    setRegistrationImagesLoader(true);
    if (file) {
      setShowfileData((prev) => ({
        ...prev,
        degreedocument: file,
      }));
      const storageRef = ref(storage, `degreedocument/${file.name}`);
      await uploadBytes(storageRef, file);
      downloadURL = await getDownloadURL(storageRef);
      // Check if the file size exceeds 1MB (1 * 1024 * 1024 bytes)
      setRegistrationImagesLoader(false);
      if (file.size > 1 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          degreedocument: "The file should be under 1MB",
        }));
        setFormData((prev) => ({
          ...prev,
          degreedocument: "", // Clear the file if it's too large
        }));
      } else {
        // If the file is valid, remove the error and store the file
        setErrors((prevErrors) => ({
          ...prevErrors,
          degreedocument: "", // Clear any previous error
        }));
        setFormData((prev) => ({
          ...prev,
          degreedocument: downloadURL, // Store the valid file
        }));
      }
    }
  };

  const [registrationFromStepsLoading, setRegistrationFromStepsLoading] =
    useState(false);

  const getFilteredCourses = (excludeKeys) => {
    const selectedCourses = excludeKeys.map((key) => formData[key]);
    return courses.filter(
      (course) =>
        course.courseStatus === "active" &&
        !selectedCourses.includes(course.courseTitle)
    );
  };

  const [verifyAccountLoading, setVerifyAccountLoading] = useState(false);
  const [accountVerifiedSuccessfuly, setAccountVerifiedSuccessfuly] =
    useState(false);
  const verifyAccount = () => {
    if (emailExists) {
      setVerifyAccountLoading(true);
      if (fetchedUserData.password === formData?.password) {
        setTimeout(() => {
          console.log("success");
          setVerifyAccountLoading(false);
          setAccountVerifiedSuccessfuly(true);
          setEmailExists(false);
        }, 5000);
      } else {
        setVerifyAccountLoading(false);
        setErrors({ password: "Incorrect password." });
      }
    }
  };

  const handleRegistrationProgress = async (userId, formData, currentStep) => {
    try {
      const docRef = doc(firestore, "registration_form_data", userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Create the document for new users
        await setDoc(docRef, {
          ...formData,
          currentStep: currentStep + 1, // Start at the next step
          created_at: new Date().toISOString(),
        });
        console.log("Registration document created successfully.");
      } else {
        const approvelTimee = new Date(
          new Date().getTime() + 4 * 60 * 60 * 1000
        );

        // Update the step for existing users
        const existingData = docSnap.data();
        const newStep = existingData.currentStep
          ? existingData.currentStep + 1
          : currentStep + 1;
        await setDoc(
          docRef,
          {
            ...formData,
            currentStep: newStep,
            updated_at: new Date().toISOString(),
            registrationStatus: currentStep === 10 ? "pending" : "",
            status: currentStep === 10 ? "active" : "",
            approvalTime: step === 10 ? approvelTimee.toISOString() : "",
          },
          { merge: true }
        );
        console.log("Registration document updated successfully.");
      }
    } catch (error) {
      console.error("Error handling registration progress:", error);
    }
  };

  const handleRegistrationSumbtion = async () => {
    if (!validateEnrollmentStep()) {
      return; // Prevent form submission if validation fails
    }

    setRegistrationLoading(true);

    try {
      const userId = formData.userId || auth.currentUser?.uid; // Get the user ID
      if (!userId) {
        throw new Error("User ID is missing.");
      }

      // Update or create registration document and increment step
      await handleRegistrationProgress(userId, formData, step);

      const requestBody = {
        fetchedUserData: userData,
        email_subject: "Your Application is Under Review at DigiPAKISTAN",
      };

      // Send request to backend
      const response = await fetch(
        "/api/emails/direct-emails/after-form-submition",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody), // Convert to JSON string
        }
      );

      const responseData = await response.json();

      const docRef = doc(firestore, "users", userData.uid);
      const docSnap = await getDoc(docRef);
      const docuserData =docSnap.data();

      if (!docSnap.exists()) {
        // Create the document for new users
        await updateDoc(docRef, {
          ...docuserData,
          isApplicationSubmitted: true,
        });
      }

      showToast("Registration !", "success", 2000);
      showToast("Registration completed!", "success", 2000);
      setRegistrationLoading(false);
      router.push(`/registration-status/${userData.uid}`);
    } catch (error) {
      console.error("Error during registration submission:", error);
      showToast(
        "An error occurred while updating your progress. Please try again.",
        "error",
        5000
      );
      setRegistrationLoading(false);
    }
  };

  const handleAccountCreationStep = async (currentStep) => {
    if (!validateEnrollmentStep()) {
      return; // Prevent form submission if validation fails
    }
    setRegistrationFromStepsLoading(true);
    const nextStep = currentStep + 1;

    try {
      if (!fetchedUserData) {
        // New user signup
        if (!emailExists) {
          const newSignup = await createUserWithEmailAndPassword(
            formData.email,
            formData.password
          );

          if (newSignup) {
            const newUserData = {
              uid: newSignup.user.uid,
              email: newSignup.user.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              created_at: serverTimestamp(),
              password: formData.password,
              status: "active",
              isEmailVerified: false,
              isApproved: false,
              isApplicationSubmitted: false,
              isEnrollmentCompleted: false,
            };

            const emailSendingTiming = new Date();
            emailSendingTiming.setHours(emailSendingTiming.getHours() + 12);

            const profileReminder = {
              email_template_id: "83h23q23p2-302-32nqin329q32032",
              emailSendingTime: emailSendingTiming,
              status: "Profile Reminder",
            };

            // Save user in Firestore
            await setDoc(doc(firestore, "users", formData.id), {
              newUserData});
            setFormData((prevData) => ({
              ...prevData,
              userId: newSignup.user.uid,
            }));

            fetchAndStoreUserData(newSignup.user.uid);

            showToast("Account created successfully!", "success", 5000);

            // Initialize registration process
            await handleRegistrationProgress(
              newSignup.user.uid,
              formData,
              currentStep
            );
          }
        }
      } else {
        // Existing user
        const documentId = formData.userId || fetchedUserData.uid;
        await handleRegistrationProgress(documentId, formData, currentStep);
      }

      // Update step locally
      setStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error("Error updating step:", error);
      showToast("An error occurred. Please try again.", "error", 5000);
    } finally {
      setRegistrationFromStepsLoading(false);
    }
  };

  const [previousFormdta, setPerviouseFromData] = useState(null);
  const [previousLoadingWhenPageLoads, setPreviouseLoadingWhenPageLoads] =
    useState(false);
  useEffect(() => {
    const fetchStep = async () => {
      try {
        setPreviouseLoadingWhenPageLoads(true);
        if (userData && userData.uid) {
          const docRef = doc(firestore, "registration_form_data", userData.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Fetched data:", data); // Debugging log
            setPerviouseFromData(data);
            setFormData(data);
            setStep(data.currentStep || 1); // Resume user at their current step
          } else {
            console.log("No document found. Defaulting to step 1.");
            setStep(1); // Default to step 1 for new users
          }
        }
      } catch (error) {
        console.error("Error fetching current step:", error);
      }
    };
    fetchStep();
    setTimeout(() => {
      setPreviouseLoadingWhenPageLoads(false);
    }, 2000);
  }, [userData]);

  const handleNextStep = async () => {
    if (!validateEnrollmentStep()) return; // Stop if validation fails
    setRegistrationFromStepsLoading(true);

    const nextStep = step + 1;
    try {
      await handleRegistrationProgress(
        auth.currentUser.uid,
        formData,
        nextStep
      );
      setStep(nextStep);
      setTimeout(() => {
        setRegistrationFromStepsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error while proceeding to the next step:", error);
      showToast("An error occurred. Please try again.", "error", 5000);
      setRegistrationFromStepsLoading(false);
    }
  };

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [emailhassentmessage, setEmailhasSentMessage] = useState("");
  const sendUserEmail = async (e) => {
    try {
      // Attempt to sign in and destructure the response to get user
      const { user } = await signInWithEmailAndPassword(
        userData.email,
        userData.password
      );

      // Check if the user's email is verified
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        showToast(
          "A email has been sent to your email, please verify your email by clicking on the url provided in your mail.",
          "success",
          20000
        );
        setEmailhasSentMessage(
          "Email sent! Please check your inbox to proceed with the next steps. If you don't see it, check your spam folder."
        );
      }
    } catch (error) {
      console.error("SignIn Error:", error);
      // Handle errors like incorrect user credentials or other errors during signIn
      showToast(
        "Failed to sign in or send verification email. Please check the credentials and try again.",
        "error",
        5000
      );
    }
  };

  return (
    <>
      {toast.visible && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleCloseToast}
        />
      )}
      <div className="max-w-6xl mx-5 lg:mx-auto my-10">
        <div className="flex w-full">
          <div className="border rounded-lg gap-2 border-gray-400 flex p-5 w-full">
            <TbFileCertificate
              size={60}
              className="text-gray-700 w-[8rem] lg:block hidden"
            />
            <div>
              <h6 className="text-3xl text-gray-700 font-medium">
                Certification Registration
              </h6>
              <p className="text-[12px] md:mt-0 mt-2 lg:text-[14px] w-full">
                Register now to start your journey with DigiPAKISTAN, a Government
                of Pakistan-supported IT training initiative. Receive
                world-class training and prepare for internationally recognized
                certifications from leading organizations like Google, AWS, and
                Microsoft. The program is free, with only a minor admission fee,
                and is designed to bridge the skills gap in Pakistan's IT
                sector. Secure your spot today and enhance your employability in
                the global digital economy!
              </p>
              <div className="flex w-full justify-end">
                <p
                  className="text-[12px] urdufont lg:text-[14px] font-medium w-full mt-4 text-start"
                  dir="rtl"
                >
                  ابھی رجسٹر کریں اور حکومت پاکستان کی معاونت سے چلنے والے
                  DigiPAKISTAN پروگرام کے ذریعے عالمی سطح پر تسلیم شدہ آئی ٹی
                  سرٹیفیکیشن کے لیے تربیت حاصل کریں۔ یہ پروگرام مفت ہے، صرف ایک
                  معمولی داخلہ فیس ہے۔ گوگل، AWS، اور مائیکروسافٹ جیسی عالمی
                  تنظیموں سے تربیت حاصل کریں اور پاکستان کے آئی ٹی شعبے میں
                  مہارت بڑھائیں۔ آج ہی اپنی جگہ محفوظ کریں!
                </p>
              </div>
            </div>
          </div>
        </div>
        {previousLoadingWhenPageLoads ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin h-16 w-16 border-4 border-t-transparent border-primary rounded-full"></div>
          </div>
        ) : (
          <div>
            <div className="relative overflow-x-scroll custom-scrollbar py-2  mb-20 mt-10">
              {/* Step Names */}
              <div className="flex justify-between md:gap-20 w-full gap-10 mt-4">
                {stepNames.map((stepName, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = stepNumber < step; // Determine if the step is completed
                  return (
                    <div
                      key={stepNumber}
                      className={`text-center flex flex-col items-center gap-2 pointer-events-none ${
                        step === stepNumber
                          ? "text-primary font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      <span
                        className={`text-[20px] p-1 border border-gray-400 rounded-full ${
                          step === stepNumber && "border border-primary p-1"
                        } ${isCompleted && "bg-primary text-white"}`}
                      >
                        {isCompleted ? <IoMdCheckmark /> : stepName.stepIcon}
                      </span>
                      <span
                        className={`text-[12px] text-gray-800 ${
                          isCompleted && "text-gray-400"
                        }`}
                      >
                        {stepName.stepName}
                      </span>
                      <span
                        className={`text-[12px] urdufont mt-1 font-medium text-gray-800 ${
                          isCompleted && "text-gray-400"
                        }`}
                      >
                        {stepName.stepNameUrdu}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {registrationFromStepsLoading && (
              <div className="py-10 flex justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-primary rounded-full"></div>
              </div>
            )}

            {!registrationFromStepsLoading && (
              <div className="flex flex-col gap-10 mt-10">
                {/* Account Info */}
                <>
                  {step === 1 && (
                    <div>
                      <div className="w-full flex">
                        <h2 className="text-xl bg-primary text-white w-full text-center font-semibold py-4 rounded-t-lg">
                          Account Information -
                          <span className="urdufont"> اکاؤنٹ کی معلومات</span>
                        </h2>
                      </div>
                      <div className="mb-4 py-6 border p-5">
                        <div
                          className={`grid grid-cols-1  gap-6 ${
                            fetchedUserData ? "grid-cols-1" : "md:grid-cols-2"
                          }`}
                        >
                          {/* Email Address */}
                          <div>
                            <label className="mb-1 items-center gap-2 justify-between flex font-medium">
                              Email Address
                            </label>
                            <div
                              className={`flex items-center w-full focus-within:outline-primary p-2 border rounded ${
                                errors.email && "border-red-500"
                              }`}
                            >
                              <input
                                placeholder="Please Enter your email here."
                                name="email"
                                value={formData.email} // Bind to formData
                                type="text"
                                disabled={userData?.email}
                                className="w-full outline-none bg-transparent active:bg-transparent"
                                onChange={handleChange} // Trigger handleChange
                              />
                              <div className="w-[20px]">
                                {formData.email !== "" && !errors.email && (
                                  <TickMarkAnimation />
                                )}
                                {/* Corrected to use formData.email */}
                                {errors.email && (
                                  <MdError className="text-yellow-500" />
                                )}
                              </div>
                            </div>
                            {errors.email && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>{errors.email}</span>
                              </div>
                            )}
                            {fetchedUserData && (
                              <div className="mt-5 w-full border bg-primary/40 border-primary p-5 rounded-md">
                                <p className="text-[13px]">
                                  Welcome back! It looks like you already have
                                  an account with us. Instead of registering
                                  again, please head over to the login page.
                                  Just enter your details there to continue your
                                  registration process. Thanks.
                                </p>
                              </div>
                            )}
                          </div>
                          {fetchedUserData ? (
                            ""
                          ) : (
                            <>
                              {/* First Name */}
                              <div>
                                <label className="mb-1 items-center gap-2 justify-between flex font-medium">
                                  First Name
                                </label>
                                <div
                                  className={`w-full flex items-center focus-within:outline-primary p-2 border rounded ${
                                    errors.firstName
                                      ? "border-red-500"
                                      : fetchedUserData?.firstName
                                      ? "bg-gray-200"
                                      : "border-gray-300"
                                  }`}
                                >
                                  <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Please provide your first name."
                                    disabled={
                                      fetchedUserData?.firstName ||
                                      userData?.firstName
                                    }
                                    value={
                                      fetchedUserData
                                        ? fetchedUserData.firstName
                                        : formData.firstName
                                    }
                                    className="w-full  outline-none bg-transparent active:bg-transparent"
                                    onChange={handleChange}
                                  />
                                  {(formData.firstName !== "" &&
                                    !errors.firstName) ||
                                    (fetchedUserData?.firstName && (
                                      <TickMarkAnimation />
                                    ))}
                                  {errors.firstName && (
                                    <MdError className="text-yellow-500" />
                                  )}
                                </div>
                                {errors.firstName && (
                                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <h6>
                                      <MdReportGmailerrorred />
                                    </h6>
                                    <span>{errors.firstName}</span>
                                  </div>
                                )}
                              </div>
                              {/* Last Name */}
                              <div>
                                <label className="mb-1 items-center gap-2 justify-between flex font-medium">
                                  Last Name
                                </label>
                                <div
                                  className={`w-full flex focus-within:outline-primary p-2 border rounded ${
                                    errors.lastName
                                      ? "border-red-500"
                                      : fetchedUserData?.lastName
                                      ? "bg-gray-200"
                                      : "border-gray-300"
                                  }`}
                                >
                                  <input
                                    className="w-full outline-none bg-transparent active:bg-transparent"
                                    name="lastName"
                                    type="text"
                                    placeholder="Please provide your last name."
                                    value={
                                      fetchedUserData
                                        ? fetchedUserData.lastName
                                        : formData.lastName
                                    }
                                    onChange={handleChange}
                                    disabled={
                                      fetchedUserData?.lastName ||
                                      userData?.lastName
                                    }
                                  />
                                  {(formData.lastName !== "" &&
                                    !errors.lastName) ||
                                    (fetchedUserData?.lastName && (
                                      <TickMarkAnimation />
                                    ))}
                                  {errors.lastName && (
                                    <MdError className="text-yellow-500" />
                                  )}
                                </div>
                                {errors.lastName && (
                                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <h6>
                                      <MdReportGmailerrorred />
                                    </h6>
                                    <span>{errors.lastName}</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <label className="mb-1 items-center gap-2 justify-between flex font-medium">
                                  Password
                                </label>
                                <div
                                  className={`w-full flex items-center focus-within:outline-primary p-2 border rounded ${
                                    errors.password
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  <input
                                    className="w-full outline-none bg-transparent active:bg-transparent"
                                    name="password"
                                    placeholder="Please enter your password."
                                    value={formData.password}
                                    onChange={handleChange} // Updated handler
                                    disabled={userData?.password}
                                    type="password"
                                  />
                                  {formData.password !== "" &&
                                    !errors.password && <TickMarkAnimation />}
                                  {errors.password && (
                                    <MdError className="text-yellow-500" />
                                  )}
                                </div>

                                {emailExists && (
                                  <div className="text-yellow-500 p-2 border-yellow-500 border text-sm mt-2 rounded-md flex gap-1">
                                    <h6>
                                      <MdReportGmailerrorred size={24} />
                                    </h6>
                                    <span>
                                      Your account already exists. Please enter
                                      your password to continue with the
                                      admission process.
                                    </span>
                                  </div>
                                )}

                                {accountVerifiedSuccessfuly && (
                                  <div className="text-primary p-2 border-primary border text-sm mt-2 rounded-md flex gap-1">
                                    <h6>
                                      <MdReportGmailerrorred size={24} />
                                    </h6>
                                    <span>
                                      Verified Successfully. Now click
                                      "Continue" to proceed with your admission
                                      process.
                                    </span>
                                  </div>
                                )}

                                {fetchedUserData &&
                                  !accountVerifiedSuccessfuly && (
                                    <button
                                      onClick={verifyAccount}
                                      className="mt-2 border px-6 py-2 border-primary rounded-md bg-primary duration-300 text-white text-sm"
                                    >
                                      {verifyAccountLoading ? (
                                        <div className="animate-spin h-4 w-4 border border-t-primary border-white rounded-full"></div>
                                      ) : (
                                        "Verify"
                                      )}
                                    </button>
                                  )}

                                {errors.password && (
                                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <h6>
                                      <MdReportGmailerrorred />
                                    </h6>
                                    <span>{errors.password}</span>
                                  </div>
                                )}
                              </div>
                            </>
                          )}

                          {/* Mobile Number */}
                        </div>
                      </div>
                    </div>
                  )}
                </>

                <>
                  {step === 2 && (
                    <div>
                      <div className="w-full flex">
                        <h2 className="text-xl bg-primary text-white w-full text-center font-semibold py-4 rounded-t-lg">
                          Email Verification
                        </h2>
                      </div>
                      <div className="mb-4 flex justify-center py-6 border p-5">
                        {!isEmailVerified ? (
                          <div className="flex flex-col items-center gap-2">
                            <Image
                              src={"/email.gif"}
                              width={100}
                              height={100}
                              alt="test"
                            />
                            <h2>Verify your email address.</h2>
                            <div>
                              <span>{formData.email}</span>
                            </div>
                            <p className="text-[13px]">
                              To verify your email, simply click on the "Verify"
                              button below. A verification email will be sent to
                              your registered email address. Open the email and
                              click on the link provided to confirm your email
                              address. Once done, your account will be
                              successfully verified.
                            </p>
                            <p className="text-[13px] urdufont" dir="rtl">
                              اپنی ای میل کی تصدیق کے لیے نیچے دیے گئے "تصدیق
                              کریں" کے بٹن پر کلک کریں۔ ایک تصدیقی ای میل آپ کے
                              رجسٹرڈ ای میل پر بھیجی جائے گی۔ ای میل کو کھولیں
                              اور فراہم کردہ لنک پر کلک کریں تاکہ آپ کی ای میل
                              کی تصدیق ہو سکے۔ یہ عمل مکمل ہونے کے بعد آپ کا
                              اکاؤنٹ کامیابی سے تصدیق ہو جائے گا۔
                            </p>
                            <button
                              onClick={sendUserEmail}
                              disabled={fetchedUserData}
                              className="bg-primary disabled:bg-gray-300 disabled:text-black hover:bg-white hover:text-black border-2 duration-200 py-3 px-5 text-white rounded-md"
                            >
                              {fetchedUserData?.isEmailVerified
                                ? "Already Verififed"
                                : "Send Mail"}
                            </button>
                            {emailhassentmessage}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <MdMarkEmailRead
                              size={40}
                              className="text-primary"
                            />
                            <h2>Your email is verified!</h2>
                            <div>
                              <span>{formData.email}</span>
                            </div>
                            <p className="text-[13px]">
                              Thank you for verifying your email address. You
                              can now proceed with using the application. If you
                              haven't received the email, please check your spam
                              folder or resend the verification email.
                            </p>
                            <p className="text-[13px] urdufont" dir="rtl">
                              آپ کی ای میل کی تصدیق ہو چکی ہے۔ اب آپ ایپلیکیشن
                              استعمال کرنے کے لئے آگے بڑھ سکتے ہیں۔ اگر آپ کو ای
                              میل موصول نہیں ہوئی ہے تو براہ کرم اپنے سپام فولڈر
                              کی جانچ کریں یا تصدیقی ای میل دوبارہ بھیجیں۔
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
                <>
                  {step === 3 && (
                    <div>
                      <div className="w-full flex">
                        <h2 className="text-xl bg-primary text-white w-full text-center font-semibold py-4 rounded-t-lg">
                          Personal Information -
                          <span className="urdufont"> ذاتی معلومات</span>
                        </h2>
                      </div>
                      <div className="mb-4 py-6 border p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* FullName */}
                          <div>
                            <label className="mb-1 items-center gap-2 justify-between flex font-medium">
                              Full Name{" "}
                            </label>
                            <div
                              className={`flex items-center w-full focus-within:outline-primary p-2 border rounded ${
                                errors.fullname && "border-red-500"
                              }`}
                            >
                              <input
                                placeholder="Please provide your name as it appears on your CNIC."
                                name="fullname"
                                value={formData.fullname}
                                type="text"
                                className="w-full outline-none bg-transparent active:bg-transparent"
                                onChange={handleChange}
                              />
                              <div className="w-[20px]">
                                {formData.fullname !== "" &&
                                  !errors.fullname && <TickMarkAnimation />}
                                {errors.fullname && (
                                  <MdError className="text-yellow-500" />
                                )}
                              </div>
                            </div>
                            {errors.fullname && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>{errors.fullname}</span>
                              </div>
                            )}
                          </div>
                          {/* FatherName */}
                          <div>
                            <label className="mb-1 items-center gap-2 justify-between flex font-medium">
                              Father Name{" "}
                            </label>
                            <div
                              className={`w-full flex items-center focus-within:outline-primary p-2 border rounded ${
                                errors.fathername
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <input
                                type="text"
                                name="fathername"
                                placeholder="Please provide your father's name as it appears on your CNIC."
                                value={formData.fathername}
                                className="w-full outline-none bg-transparent active:bg-transparent"
                                onChange={handleChange}
                              />
                              {formData.fathername !== "" &&
                                !errors.fathername && <TickMarkAnimation />}
                              {errors.fathername && (
                                <MdError className="text-yellow-500" />
                              )}
                            </div>
                            {errors.fathername && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>{errors.fathername}</span>
                              </div>
                            )}
                          </div>
                          {/* CNIC/B-Form Number */}
                          <div>
                            <label className="mb-1 items-center gap-2 justify-between flex font-medium">
                              CNIC/B-Form Number{" "}
                            </label>
                            <div
                              className={`w-full flex focus-within:outline-primary p-2 border rounded ${
                                errors.cnic
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <input
                                className="w-full outline-none bg-transparent active:bg-transparent"
                                name="cnic"
                                type="number"
                                placeholder="Please provide your 13 digits CNIC or B-Form number."
                                value={formData.cnic}
                                maxLength="13"
                                onChange={handleChange}
                              />
                              {formData.cnic !== "" && !errors.cnic && (
                                <TickMarkAnimation />
                              )}
                              {errors.cnic && (
                                <MdError className="text-yellow-500" />
                              )}
                            </div>
                            {errors.cnic && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>{errors.cnic}</span>
                              </div>
                            )}
                          </div>
                          {/* Phone Number */}
                          <div>
                            <label className="mb-1 items-center gap-2 justify-between flex font-medium">
                              Mobile Number{" "}
                            </label>
                            <div
                              className={`w-full flex items-center focus-within:outline-primary p-2 border rounded ${
                                errors.phone
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <input
                                className={
                                  "w-full outline-none bg-transparent active:bg-transparent"
                                }
                                name="phone"
                                placeholder="Please enter your mobile number in the format, e.g., 03001234567."
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength="11"
                                type="number"
                              />
                              {formData.phone !== "" && !errors.phone && (
                                <TickMarkAnimation />
                              )}
                              {errors.phone && (
                                <MdError className="text-yellow-500" />
                              )}
                            </div>
                            {errors.phone && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>{errors.phone}</span>
                              </div>
                            )}
                          </div>
                          {/* Date of Birth */}
                          <div>
                            <label className="mb-1 items-center gap-2 justify-between flex font-medium">
                              Date of Birth{" "}
                            </label>
                            <div
                              className={`w-full items-center flex focus-within:outline-primary p-2 border rounded ${
                                errors.dob
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <input
                                className={
                                  "w-full outline-none bg-transparent active:bg-transparent"
                                }
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                type="date"
                              />
                              {formData.dob !== "" && !errors.dob && (
                                <TickMarkAnimation />
                              )}
                              {errors.dob && (
                                <MdError className="text-yellow-500" />
                              )}
                            </div>
                            {errors.dob && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>{errors.dob}</span>
                              </div>
                            )}
                          </div>
                          {/* Marital Status */}
                          <div>
                            <label className="mb-1 items-center gap-2 justify-between flex font-medium">
                              Marital Status{" "}
                            </label>
                            <div
                              className={`w-full items-center flex focus-within:outline-primary p-2 border rounded ${
                                errors.maritalStatus
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <select
                                name="maritalStatus"
                                onChange={handleChange}
                                value={formData.maritalStatus}
                                className={
                                  "w-full outline-none bg-transparent active:bg-transparent"
                                }
                                id="maritalStatus"
                              >
                                <option value="Select Marital Status">
                                  Select Marital Status
                                </option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                              </select>
                              {formData.maritalStatus !== "" &&
                                formData.maritalStatus !==
                                  "Select Marital Status" &&
                                !errors.maritalStatus && <TickMarkAnimation />}
                              {errors.maritalStatus && (
                                <MdError className="text-yellow-500" />
                              )}
                            </div>
                            {errors.maritalStatus && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>{errors.maritalStatus}</span>
                              </div>
                            )}
                          </div>
                          {/* Gender */}
                          <div>
                            <label className="mb-1 items-center gap-2 justify-between flex font-medium">
                              Gender{" "}
                            </label>
                            <div
                              className={`w-full flex items-center focus-within:outline-primary text-gray-500  p-2 border rounded ${
                                errors.gender
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <select
                                name="gender"
                                onChange={handleChange}
                                value={formData.gender}
                                className="w-full outline-none bg-transparent active:bg-transparent"
                                id="gender"
                              >
                                <option value="Select Your Gender">
                                  Select Your Gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                              </select>
                              {formData.gender !== "" &&
                                formData.gender !== "Select Your Gender" &&
                                !errors.gender && <TickMarkAnimation />}
                              {errors.gender && (
                                <MdError className="text-yellow-500" />
                              )}
                            </div>
                            {errors.gender && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>{errors.gender}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
                {/* Educational Background */}

                <>
                  {step === 4 && (
                    <div>
                      <div className="w-full flex justify-center">
                        <h2 className="text-xl bg-primary text-white w-full text-center font-semibold py-4 rounded-t-lg">
                          Educational Background -
                          <span className="urdufont"> تعلیمی پس منظر</span>
                        </h2>
                      </div>
                      <div className="mb-4 py-6 border p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Highest Qualification Attained */}
                          <div>
                            <label className="block mb-1 font-medium">
                              Highest Qualification Attained
                            </label>
                            <div
                              className={`w-full flex items-center focus-within:outline-primary text-gray-500  p-2 border rounded ${
                                errors.highestqualification
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <select
                                name="highestqualification"
                                onChange={handleChange}
                                value={formData.highestqualification}
                                id="highestqualification"
                                className="w-full outline-none"
                              >
                                <option value="Select Your Highest Educational Qualification">
                                  Select Your Highest Educational Qualification
                                </option>
                                <option value="Matric">Matric</option>
                                <option value="Intermediate">
                                  Intermediate
                                </option>
                                <option value="Bachelor's">Bachelor's</option>
                                <option value="Master's">Master's</option>
                                <option value="Above">Above</option>
                              </select>
                              {formData.highestqualification !== "" &&
                                formData.highestqualification !==
                                  "Select Your Highest Educational Qualification" &&
                                !errors.highestqualification && (
                                  <TickMarkAnimation />
                                )}
                              {errors.highestqualification && (
                                <MdError className="text-yellow-500" />
                              )}
                            </div>
                            {errors.highestqualification && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>{errors.highestqualification}</span>
                              </div>
                            )}
                          </div>
                          {/*  Institute/University Name */}
                          <div>
                            <label className="block mb-1 font-medium">
                              Institute / University Name
                            </label>
                            <div
                              className={`w-full flex items-center focus-within:outline-primary p-2 border rounded ${
                                errors.university_or_institute_name
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <input
                                className="w-full outline-none"
                                name="university_or_institute_name"
                                placeholder="Please enter name of your university or institute."
                                value={formData.university_or_institute_name}
                                onChange={handleChange}
                                type="email"
                              />
                              {formData.university_or_institute_name !== "" &&
                                !errors.university_or_institute_name && (
                                  <TickMarkAnimation />
                                )}
                              {errors.university_or_institute_name && (
                                <MdError className="text-yellow-500" />
                              )}
                            </div>
                            {errors.university_or_institute_name && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>
                                  {errors.university_or_institute_name}
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Field of Study */}
                          <div>
                            <label className="block mb-1 font-medium">
                              Field of Study
                            </label>
                            <div
                              className={`w-full flex items-center focus-within:outline-primary p-2 border rounded ${
                                errors.fieldstudy
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <input
                                className="w-full outline-none"
                                name="fieldstudy"
                                placeholder="Please enter your field of study"
                                value={formData.fieldstudy}
                                onChange={handleChange}
                                type="text"
                              />
                              {formData.fieldstudy !== "" &&
                                !errors.fieldstudy && <TickMarkAnimation />}
                              {errors.fieldstudy && (
                                <MdError className="text-yellow-500" />
                              )}
                            </div>
                            {errors.fieldstudy && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>{errors.fieldstudy}</span>
                              </div>
                            )}
                          </div>
                          {/* Year of completion */}
                          <div>
                            <label className="block mb-1 font-medium">
                              Year of Completion
                            </label>
                            <div
                              className={`w-full flex items-center focus-within:outline-primary p-2 text-gray-500 border rounded ${
                                errors.completionyear
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <input
                                className="w-full outline-none"
                                name="completionyear"
                                value={formData.completionyear}
                                onChange={handleChange}
                                type="date"
                              />
                              {formData.completionyear !== "" &&
                                !errors.completionyear && <TickMarkAnimation />}
                              {errors.completionyear && (
                                <MdError className="text-yellow-500" />
                              )}
                            </div>
                            {errors.completionyear && (
                              <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <h6>
                                  <MdReportGmailerrorred />
                                </h6>
                                <span>{errors.completionyear}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Upload Last Degree Document */}
                        <div className="mt-4">
                          <label className="block mb-1 font-medium">
                            Upload Last Degree Document
                          </label>
                          <div className="bg-primary/80 text-white font-normal text-[13px] md:text-[14px] mt-2 rounded-md py-5 px-6">
                            Kindly upload a clear copy of your latest degree or
                            educational certificate to verify your academic
                            qualifications.
                            <div className="flex w-full justify-end">
                              <p
                                className="text-[12px] urdufont lg:text-[14px] font-medium w-full mt-4 text-start"
                                dir="rtl"
                              >
                                براہ کرم اپنے تازہ ترین ڈگری یا تعلیمی سرٹیفیکیٹ
                                کی واضح کاپی اپلوڈ کریں تاکہ آپ کی تعلیمی قابلیت
                                کی تصدیق کی جا سکے۔
                              </p>
                            </div>
                          </div>
                          {registrationImagesLoader ? (
                            <>
                              <div className="flex justify-center py-[5.5rem] flex-col gap-2 items-center bg-primary/30 mt-5 rounded-md hover:bg-primary/20 cursor-pointer duration-500">
                                <div className="animate-spin h-12 w-12 border-4 border-t-transparent border-primary rounded-full"></div>
                              </div>
                            </>
                          ) : (
                            <>
                              <input
                                type="file"
                                accept=".jpg, .png, .pdf"
                                id="degreedocument"
                                name="degreedocument"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              <label
                                htmlFor="degreedocument"
                                className="flex flex-col md:px-0 px-5 gap-2 items-center bg-primary/30 mt-5 rounded-md hover:bg-primary/20 cursor-pointer duration-500 justify-center py-10"
                              >
                                <IoCloudUploadOutline
                                  size={40}
                                  className="text-gray-500"
                                />
                                <h2 className="text-black text-center text-[14px] md:text-[1.1rem] font-medium">
                                  Click to select or drag and drop your file
                                  here.
                                </h2>
                                <h6 className="text-[13px] md:text-[0.9rem]">
                                  Accepted formats: jpg, png, pdf
                                </h6>
                                <p className="text-[13px] md:text-[0.8rem]">
                                  Max Size: 1MB
                                </p>
                              </label>
                            </>
                          )}

                          {errors.degreedocument && (
                            <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <h6>
                                <MdReportGmailerrorred />
                              </h6>
                              <span>{errors.degreedocument}</span>
                            </div>
                          )}
                          {formData.degreedocument && (
                            <div className="w-full border mt-5 rounded-md overflow-y-hidden lg:overflow-x-hidden overflow-x-scroll">
                              <table className="w-full table-auto ">
                                <thead>
                                  <tr className="text-left border border-gray-200">
                                    <th className="px-4 py-2">Preview Image</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Size</th>
                                    <th className="px-4 py-2">Type</th>
                                    <th className="px-4 py-2">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="border px-4 py-2">
                                      <img
                                        src={formData.degreedocument}
                                        alt="degreedocument"
                                        className="w-[50px] h-[50px] object-cover"
                                      />
                                    </td>
                                    <td className="border px-4 py-2 truncate">
                                      {showfileData.degreedocument.name}
                                    </td>
                                    <td className="border px-4 py-2 truncate">
                                      {showfileData.degreedocument.size} bytes
                                    </td>
                                    <td className="border px-4 py-2 truncate">
                                      {showfileData.degreedocument.type}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                      <button
                                        onClick={() =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            degreedocument: null, // Clear file if invalid
                                          }))
                                        }
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <MdDelete />
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
                {/*Course Enrollment */}
                {step === 5 && (
                  <div>
                    <div className="w-full flex justify-center">
                      <h2 className="text-xl bg-primary text-white w-full text-center font-semibold py-4 rounded-t-lg">
                        Select Certification -
                        <span className="urdufont"> سرٹیفیکیشن منتخب کریں</span>
                      </h2>
                    </div>
                    <div className="mb-4 py-6 border p-5">
                      <div className="flex flex-col gap-y-6">
                        {/* First Course */}
                        <div>
                          <label className="block mb-1 font-medium">
                            First Certification * (Please choose your
                            certification carefully! Once submitted, changes
                            cannot be made)
                          </label>
                          <div
                            className={`w-full flex items-center focus-within:outline-primary text-gray-500 p-2 border rounded ${
                              errors.course1
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <select
                              name="course1"
                              onChange={handleChange}
                              value={formData.course1}
                              id="course1"
                              className="w-full outline-none"
                            >
                              <option value="Select">Select</option>
                              {getFilteredCourses(["course2", "course3"]).map(
                                (data, idx) => (
                                  <option value={data.courseTitle} key={idx}>
                                    {data.courseTitle}
                                  </option>
                                )
                              )}
                            </select>
                            {formData.course1 !== "" && !errors.course1 && (
                              <TickMarkAnimation />
                            )}
                            {errors.course1 && (
                              <MdError className="text-yellow-500" />
                            )}
                          </div>
                          {errors.course1 && (
                            <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <MdReportGmailerrorred />
                              <span>{errors.course1}</span>
                            </div>
                          )}
                        </div>

                        {/* Second Course */}
                        <div>
                          <label className="mb-1 font-medium flex gap-1 items-center">
                            <span>Second Certification *</span>
                            <div className="text-[0.7rem] flex items-center gap-1">
                              <span>(Optional)</span>
                              <RiErrorWarningLine className="text-primary" />
                            </div>
                          </label>
                          <p className="mb-2 text-[0.8rem] text-gray-500">
                            (Students can enroll in up to three programs
                            simultaneously. If you do not wish to join a second
                            program, please leave this field blank.)
                          </p>
                          <div
                            className={`w-full flex items-center focus-within:outline-primary text-gray-500 p-2 border rounded ${
                              errors.course2
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <select
                              name="course2"
                              onChange={handleChange}
                              value={formData.course2}
                              className="w-full outline-none"
                              id="course2"
                            >
                              <option value="Select">Select</option>
                              {getFilteredCourses(["course1", "course3"]).map(
                                (data, idx) => (
                                  <option value={data.courseTitle} key={idx}>
                                    {data.courseTitle}
                                  </option>
                                )
                              )}
                            </select>
                            {formData.course2 !== "" && !errors.course2 && (
                              <TickMarkAnimation />
                            )}
                          </div>
                        </div>

                        {/* Third Course */}
                        <div>
                          <label className="mb-1 font-medium flex gap-1 items-center">
                            <span>Third Certification *</span>
                            <div className="text-[0.7rem] flex items-center gap-1">
                              <span>(Optional)</span>
                              <RiErrorWarningLine className="text-primary" />
                            </div>
                          </label>
                          <p className="mb-2 text-[0.8rem] text-gray-500">
                            (You may select up to three courses. If you do not
                            wish to enroll in a third course, please leave this
                            field blank.)
                          </p>
                          <div
                            className={`w-full flex items-center focus-within:outline-primary text-gray-500 p-2 border rounded ${
                              errors.course3
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <select
                              name="course3"
                              onChange={handleChange}
                              value={formData.course3}
                              className="w-full outline-none"
                              id="course3"
                            >
                              <option value="Select">Select</option>
                              {getFilteredCourses(["course1", "course2"]).map(
                                (data, idx) => (
                                  <option value={data.courseTitle} key={idx}>
                                    {data.courseTitle}
                                  </option>
                                )
                              )}
                            </select>
                            {formData.course3 !== "" && !errors.course3 && (
                              <TickMarkAnimation />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Device Availabity */}
                {step === 6 && (
                  <div>
                    <div className="w-full flex justify-center">
                      <h2 className="text-xl bg-primary text-white w-full text-center font-semibold py-4 rounded-t-lg">
                        Device Availabity -{" "}
                        <span className="urdufont"> ڈیوائس کی دستیابی</span>
                      </h2>
                    </div>
                    <div className="mb-4 py-6 border p-5">
                      <div className="flex flex-col gap-y-6">
                        {/* First Course */}
                        <div>
                          <label className="block mb-1 font-medium">
                            Do you have access to a computer/laptop?*
                          </label>
                          <select
                            name="have_a_device"
                            onChange={handleChange}
                            value={formData.have_a_device}
                            className={`w-full focus-within:outline-primary text-gray-500 p-2 border rounded `}
                            id="have_a_device"
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* Second Course */}
                        <div>
                          <label className="mb-1 font-medium flex gap-1 items-center">
                            <span>
                              Do you have access to a reliable internet
                              connection?*
                            </span>
                          </label>
                          <select
                            name="have_a_internet_connection"
                            onChange={handleChange}
                            value={formData.have_a_internet_connection}
                            className={`w-full focus-within:outline-primary text-gray-500 p-2 border rounded`}
                            id="have_a_internet_connection"
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Adress Details */}
                {step === 7 && (
                  <div>
                    <div className="w-full flex justify-center">
                      <h2 className="text-xl bg-primary text-white w-full text-center font-semibold py-4 rounded-t-lg">
                        Adress Details -{" "}
                        <span className="urdufont">پتہ کی تفصیلات</span>
                      </h2>
                    </div>
                    <div className="mb-4 py-6 border p-5">
                      <div className="flex flex-col gap-y-6">
                        <div>
                          <label className="block mb-1 font-medium">
                            Permanent Address
                          </label>
                          <div>
                            <div
                              className={`w-full flex items-center focus-within:outline-primary p-2 border rounded ${
                                errors.permanentaddress
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <input
                                placeholder="Enter your permanent address."
                                name="permanentaddress"
                                value={formData.permanentaddress}
                                type="text"
                                className="w-full outline-none"
                                onChange={handleChange}
                              />
                              {formData.permanentaddress !== "" &&
                                !errors.permanentaddress && (
                                  <TickMarkAnimation />
                                )}
                              {errors.permanentaddress && (
                                <MdError className="text-yellow-500" />
                              )}
                            </div>
                          </div>
                          {errors.permanentaddress && (
                            <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <h6>
                                <MdReportGmailerrorred />
                              </h6>
                              <span>{errors.permanentaddress}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Current Address
                          </label>
                          <div
                            className={`w-full flex items-center focus-within:outline-primary p-2 border rounded ${
                              errors.permanentaddress
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <input
                              className={`w-full outline-none`}
                              placeholder="Enter your current address."
                              name="currentaddress"
                              value={formData.currentaddress}
                              type="text"
                              onChange={handleChange}
                            />
                            {formData.currentaddress !== "" &&
                              !errors.currentaddress && <TickMarkAnimation />}
                            {errors.currentaddress && (
                              <MdError className="text-yellow-500" />
                            )}
                          </div>
                          {errors.currentaddress && (
                            <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <h6>
                                <MdReportGmailerrorred />
                              </h6>
                              <span>{errors.currentaddress}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">City</label>
                          <div
                            className={`w-full flex items-center focus-within:outline-primary p-2 border rounded ${
                              errors.city ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <input
                              placeholder="Enter your city of residence."
                              name="city"
                              className="w-full outline-none"
                              value={formData.city}
                              type="text"
                              onChange={handleChange}
                            />
                            {formData.city !== "" && !errors.city && (
                              <TickMarkAnimation />
                            )}
                            {errors.city && (
                              <MdError className="text-yellow-500" />
                            )}
                          </div>
                          {errors.city && (
                            <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <h6>
                                <MdReportGmailerrorred />
                              </h6>
                              <span>{errors.city}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Additional Information */}
                {step === 8 && (
                  <div>
                    <div className="w-full flex justify-center">
                      <h2 className="text-xl bg-primary text-white w-full text-center font-semibold py-4 rounded-t-lg">
                        Additional Information - اضافی معلومات
                      </h2>
                    </div>
                    <div className="mb-4 py-6 border p-5">
                      <div className="flex flex-col gap-y-6">
                        <div>
                          <label className="block mb-1 font-medium">
                            Are you currently employed?*
                          </label>
                          <select
                            name="areyou_employed"
                            onChange={handleChange}
                            value={formData.areyou_employed}
                            className={`w-full focus-within:outline-primary text-gray-500 p-2 border rounded `}
                            id="areyou_employed"
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        {formData.areyou_employed === "Yes" && (
                          <>
                            <div>
                              <label className="block mb-1 font-medium">
                                Job Title
                              </label>
                              <div
                                className={`w-full flex items-center focus-within:outline-primary p-2 border rounded ${
                                  errors.job_tittle
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              >
                                <input
                                  placeholder="Enter your current job title (if applicable)."
                                  name="job_tittle"
                                  className="w-full outline-none"
                                  value={formData.job_tittle}
                                  type="text"
                                  onChange={handleChange}
                                />
                                {formData.job_tittle !== "" &&
                                  !errors.job_tittle && <TickMarkAnimation />}
                                {errors.job_tittle && (
                                  <MdError className="text-yellow-500" />
                                )}
                              </div>
                              {errors.job_tittle && (
                                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                  <h6>
                                    <MdReportGmailerrorred />
                                  </h6>
                                  <span>{errors.job_tittle}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block mb-1 font-medium">
                                Organization Name
                              </label>
                              <div
                                className={`w-full flex items-center focus-within:outline-primary p-2 border rounded ${
                                  errors.organization_name
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                              >
                                <input
                                  placeholder="Enter the name of your organization (if applicable)."
                                  name="organization_name"
                                  value={formData.organization_name}
                                  type="text"
                                  onChange={handleChange}
                                  className="w-full outline-none"
                                />
                                {formData.organization_name !== "" &&
                                  !errors.organization_name && (
                                    <TickMarkAnimation />
                                  )}
                                {errors.organization_name && (
                                  <MdError className="text-yellow-500" />
                                )}
                              </div>
                              {errors.organization_name && (
                                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                  <h6>
                                    <MdReportGmailerrorred />
                                  </h6>
                                  <span>{errors.organization_name}</span>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* Agreement Declaration */}
                {step === 9 && (
                  <div>
                    <div className="w-full flex justify-center">
                      <h2 className="text-xl bg-primary text-white w-full text-center font-semibold py-4 rounded-t-lg">
                        Agreement Declaration - معاہدے کا اعلان
                      </h2>
                    </div>
                    <div className="mb-4 py-6 border p-5">
                      <div className="flex flex-col">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id="declaration"
                            className="mt-1.5"
                            onChange={handleChange}
                            value={formData.agree_with_trems_and_form_sumbmtion}
                            name="agree_with_trems_and_form_sumbmtion"
                          />
                          <label
                            htmlFor="declaration"
                            className="block mb-1 font-medium"
                          >
                            I affirm that the information I have provided is
                            true to the best of my knowledge, and I consent to
                            comply with the terms and conditions of the
                            DigiPAKISTAN Training Program.
                          </label>
                        </div>
                        {errors.agree_with_trems_and_form_sumbmtion && (
                          <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <h6>
                              <MdReportGmailerrorred />
                            </h6>
                            <span>
                              {errors.agree_with_trems_and_form_sumbmtion}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="stepper-buttons flex justify-center gap-3 mt-3">
          {step < 10 ? (
            <>
              {!fetchedUserData && !userData ? (
                <button
                  onClick={() => handleAccountCreationStep(step)}
                  disabled={registrationFromStepsLoading || emailExists}
                  className="bg-primary disabled:cursor-not-allowed disabled:bg-gray-300 hover:bg-primary/90 duration-200 text-white px-4 py-2 rounded"
                >
                  Create Your Account
                </button>
              ) : (
                <>
                  {step === 2 ? (
                    ""
                  ) : (
                    <>
                      {fetchedUserData ? (
                        <Link href={"/signin"}>
                          <button className="bg-primary disabled:cursor-not-allowed disabled:bg-gray-300 hover:bg-primary/90 duration-200 text-white px-4 py-2 rounded">
                            Login
                          </button>
                        </Link>
                      ) : (
                        <button
                          onClick={handleNextStep}
                          disabled={registrationFromStepsLoading}
                          className="bg-primary disabled:cursor-not-allowed disabled:bg-gray-300 hover:bg-primary/90 duration-200 text-white px-4 py-2 rounded"
                        >
                          Continue
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <button
              className="bg-primary px-5 py-3 text-white rounded-md"
              onClick={handleRegistrationSumbtion}
            >
              {registrationLoading ? (
                <AppFormLoader css={"w-[30px]"} />
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
