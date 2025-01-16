"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CustomToast from "../CoustomToast/CoustomToast";
import userHooks from "@/Hooks/userHooks";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/Backend/Firebase";
import { useRouter } from "next/navigation";
import courses from "@/components/Courses/Courses";

const PersonalInfo = () => {
  // Current user infor
  const { userData,loading} = userHooks();
  const router = useRouter();

  // Toast
  const [formLoading, setformLoading] = useState(false);
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


  const [coursesData, setCourses] = useState(courses);
  const [formData, setFormData] = useState({
    id: userData?.formDataId || uuidv4(),
    fullName: "",
    fatherName: "",
    email: "",
    applicant: "",
    cnic: "",
    contactNo: "",
    dob: "",
    gender: "",
    firstCourse: "",
    secondCourse: "",
    thirdCourse: "",
    selectedCourses: [],
    qualification: "",
    education: "",
    institute: "",
    province: "",
    country: "",
    city: "",
    address: "",
    gettoknow: "",
    rollno: "",
    dueDate: "",
  });

  console.log(formData);

  const [error, setError] = useState({
    fullName: "",
    fatherName: "",
    email: "",
    applicant: "",
    contactNo: "",
    cnic: "",
    dob: "",
    gender: "",
    firstCourse: "",
    secondCourse: "",
    thirdCourse: "",
    selectedCourses: [],
    qualification: "",
    education: "",
    institute: "",
    province: "",
    country: "",
    city: "",
    address: "",
    gettoknow: "",
    userId: "",
  });

  // Track focus for each input independently
  const [focusState, setFocusState] = useState({
    fullName: false,
    fatherName: false,
    email: false,
    applicant: false,
    cnic: false,
    contactNo: false,
    dob: false,
    gender: false,
    firstCourse: false,
    secondCourse: false,
    thirdCourse: false,
    selectedCourses: false,
    qualification: false,
    education: false,
    institute: false,
    province: false,
    country: false,
    city: false,
    address: false,
    gettoknow: false,
  });

  // const [form,setForm] = useState({});
  const [registeredUser, setRegisteredUser] = useState(null);
  useEffect(() => {
    const getFormData = async () => {
      const infoRef = collection(firestore, "user_information");
      const q = query(infoRef, where("userId", "==", userData?.id));
      const querySnapshot = await getDocs(q);
      const docToUpdate = querySnapshot.docs[0];
      const docData = docToUpdate.data();
      setRegisteredUser(docData);
      setFormData(docData);
    };
    getFormData();
  }, [userData]);
  



  const handleFocus = (field) => {
    setFocusState({ ...focusState, [field]: true });
  };

  const handleBlur = (field) => {
    setFocusState({ ...focusState, [field]: false });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle general inputs and selected course categories
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: value,
        ...(name === "firstCourse" && {
          selectedCourses: [
            value,
            prev.selectedCourses[1] || "",
            prev.selectedCourses[2] || "",
          ],
        }),
        ...(name === "secondCourse" && {
          selectedCourses: [
            prev.selectedCourses[0] || "",
            value,
            prev.selectedCourses[2] || "",
          ],
        }),
        ...(name === "thirdCourse" && {
          selectedCourses: [
            prev.selectedCourses[0] || "",
            prev.selectedCourses[1] || "",
            value,
          ],
        }),
      };

      // Update courses array to filter out selected courses
      const updatedSelectedCourses =
        updatedFormData.selectedCourses.filter(Boolean);
      setCourses((prevCourses) =>
        prevCourses.filter(
          (courseTitle) => !updatedSelectedCourses.includes(courseTitle)
        )
      );

      return updatedFormData;
    });

    // Handle course selection dropdowns
    if (name === "courses" && value) {
      setFormData((prev) => {
        const updatedSelectedCourses = [...prev.selectedCourses];

        // Determine the index to update based on the currently visible dropdown
        if (prev.firstCourse && !prev.secondCourse) {
          updatedSelectedCourses[0] = value;
        } else if (prev.secondCourse && !prev.thirdCourse) {
          updatedSelectedCourses[1] = value;
        } else if (prev.thirdCourse) {
          updatedSelectedCourses[2] = value;
        }

        // Update courses array again after selecting a course
        setCourses((prevCourses) =>
          prevCourses.filter(
            (courseTitle) => !updatedSelectedCourses.includes(courseTitle)
          )
        );

        return {
          ...prev,
          selectedCourses: updatedSelectedCourses,
        };
      });
    }

    // Clear errors for the field
    setError((prev) => ({
      ...prev,
      [name]: "", // Clear the specific error
    }));
  };

  const handleCourseSelect = (e, index) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      selectedCourses: [
        ...prev.selectedCourses.slice(0, index),
        value,
        ...prev.selectedCourses.slice(index + 1),
      ],
    }));
  };

  const generateRandomNumber = () => {
    let max = 99999;
    let min = 10000;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const generateDueDate = () => {
    const currentDate = new Date(); // Get the current date
    const dueDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000); // Add 10 days in milliseconds

    // Format the date as 'MMM DD, YYYY'
    const options = { month: "short", day: "numeric", year: "numeric" };
    return dueDate.toLocaleDateString("en-US", options);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let validateErrors = {};

    if (!formData.fullName) validateErrors.fullName = "Name is required";
    if (!formData.fatherName)
      validateErrors.fatherName = "Father Name is required";
    if (!formData.email) {
      validateErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validateErrors.email = "Invalid email format";
    }
    if (!formData.applicant) validateErrors.applicant = "Applicant is required";
    if (!formData.cnic) validateErrors.cnic = "CNIC / B-Form is required";
    if (formData.cnic.length < 13 || formData.cnic.length > 13)
      validateErrors.cnic = "CNIC / B-Form must be of 13 digits";

    if (!formData.contactNo)
      validateErrors.contactNo = "Phone Number is required";
    if (!formData.dob) validateErrors.dob = "Date of birth is required";
    if (!formData.gender) validateErrors.gender = "Gender is required";
    if (formData.contactNo.length < 10 || formData.contactNo.length > 11)
      validateErrors.contactNo = "Phone Number must be of 11 digits";
    if (!formData.firstCourse)
      validateErrors.firstCourse = "This course is required";

    if (!formData.qualification)
      validateErrors.qualification = "Qualification is required";
    // if (!formData.education) validateErrors.education = "Education is required";
    if (!formData.institute) validateErrors.institute = "Institure is required";

    if (!formData.province) validateErrors.province = "Province is required";

    if (!formData.country) validateErrors.country = "Country is required";

    if (!formData.city) validateErrors.city = "City is required";

    if (!formData.address) validateErrors.address = "Address is required";

    setError(validateErrors);

    if (Object.keys(validateErrors).length > 0) {
      showToast("Please fill the (Required*) Fields", "error", 2000);
    }

    if (Object.keys(validateErrors).length === 0) {
      try {
        setformLoading(true);
        const randomNmber = generateRandomNumber();
        const dueDateForRegistration = generateDueDate();

        const docRef = doc(firestore, "user_information", formData.id);
        await setDoc(docRef, {
          ...formData,
          dueDate: dueDateForRegistration,
          rollno: randomNmber,
          userId: userData?.id,
        });
        showToast("Your Information Has saved", "success", 2000);
        const userRef = doc(firestore, "users", userData?.id);
        await updateDoc(userRef, { formDataId: formData.id,
          isProfileComplete:true
         });

        
        await fetch("/api/emails/direct-emails/after-form-submition",{
          method:"POST",
          headers:{
            'Content-Type':"application/json"
          },
          body:JSON.stringify({fetchedUserData:userData,email_subject:"Congratulations! Your Application Has Submitted Successfully at DigiPAKISTAN"})
        });
        router.push("/registration/registration-status");
      } catch (error) {
        console.log(error);
        console.log(error.message);
        showToast("Error while Saving information", "error", 2000);
      } finally {
        setformLoading(false);
      }
    }
  };


  const [userLoading,setUserLoading]= useState(true);

  useEffect(()=>{
    const interval = setTimeout(()=>{
      setUserLoading(false);
    },2000);
    return ()=> clearTimeout(interval)
  },[])

  return (
    <div className="bg-gray-50">
      <div className="flex items-center justify-center p-3 max-w-6xl lg:mx-auto lg:p-5">
        <div className="w-full min-h-[60vh] rounded-xl bg-white flex flex-col border text-center p-5 ">
          <h1 className="lg:text-5xl text-2xl font-normal ">
            Digi<b>PAKISTAN</b> Application Form
          </h1>
          {registeredUser?.userId === userData?.id ? (
            <p className="text-red-600 min-h-[70vh] flex items-center justify-center">
              You Already Submitted The Form. Please contact support for
              changing.
            </p>
          ) : (
           userLoading ? <p className="flex items-center justify-center min-h-screen">Loading Data, Please wait.....</p> :  <div className="flex flex-col lg:p-5 p-2">
           <form onSubmit={handleFormSubmit}>
             {/* PERSONAL INFORMATION */}
             <div className="mt-6">
               <h1 className="lg:text-xl text-white font-bold bg-primary w-[70%] p-1 rounded-t-2xl mx-auto lg:w-[20%] ">
                 Personal Information
               </h1>
               <hr className="border-2 border-primary" />

               {/* INFORMATION MAP */}
               <div className="flex items-center flex-col lg:flex-row gap-5  mt-5 mb-6">
                 <div className="relative w-full">
                   <input
                     type="text"
                     name="fullName"
                     value={formData.fullName}
                     onChange={handleChange}
                     onFocus={() => handleFocus("fullName")}
                     onBlur={() => handleBlur("fullName")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.fullName
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                     placeholder=""
                   />
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.fullName || formData.fullName
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Full Name *
                   </label>
                   {error.fullName && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.fullName}
                     </p>
                   )}
                 </div>

                 <div className="relative w-full">
                   <input
                     type="text"
                     name="fatherName"
                     value={formData.fatherName}
                     onChange={handleChange}
                     onBlur={() => handleBlur("fatherName")}
                     onFocus={() => handleFocus("fatherName")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.fatherName
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                     placeholder=""
                   />
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.fatherName || formData.fatherName
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Father Name *
                   </label>
                   {error.fatherName && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.fatherName}
                     </p>
                   )}
                 </div>
               </div>

               <div className="flex flex-col items-center lg:flex-row gap-5  mb-6">
                 <div className="relative w-full">
                   <select
                     name="applicant"
                     value={formData.applicant}
                     onChange={handleChange}
                     onBlur={() => handleBlur("applicant")}
                     onFocus={() => handleFocus("applicant")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.applicant
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   >
                     <option
                       className="p-3 rounded"
                       disabled
                       hidden
                       value=""
                     ></option>
                     <option className="p-3 rounded" value="localPakistani">
                       Local Pakistani
                     </option>
                     <option className="p-3 rounded" value="oversease">
                       Oversease
                     </option>
                   </select>
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.applicant || formData.applicant
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Applicant *
                   </label>
                   {error.applicant && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.applicant}
                     </p>
                   )}
                 </div>

                 <div className="relative w-full">
                   <input
                     type="number"
                     name="cnic"
                     value={formData.cnic}
                     onChange={handleChange}
                     onBlur={() => handleBlur("cnic")}
                     onFocus={() => handleFocus("cnic")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.cnic
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   />

                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.cnic || formData.cnic
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     CNIC/B-Form
                   </label>
                   {error.cnic && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.cnic}
                     </p>
                   )}
                 </div>
               </div>

               <div className="flex items-center flex-col lg:flex-row gap-5  mb-6">
                 <div className="relative w-full">
                   <input
                     type="number"
                     name="contactNo"
                     value={formData.contactNo}
                     onChange={handleChange}
                     onBlur={() => handleBlur("contactNo")}
                     onFocus={() => handleFocus("contactNo")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.contactNo
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   />

                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.contactNo || formData.contactNo
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Phone Number *
                   </label>
                   {error.contactNo && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.contactNo}
                     </p>
                   )}
                 </div>

                 <div className="relative w-full">
                   <input
                     type="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     onFocus={() => handleFocus("email")}
                     onBlur={() => handleBlur("email")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.email
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                     placeholder=""
                   />
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.email || formData.email
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Email *
                   </label>
                   {error.email && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.email}
                     </p>
                   )}
                 </div>
               </div>

               <div className="flex flex-col items-center lg:flex-row gap-5  mb-6">
                 <div className="relative w-full">
                   <input
                     type="date"
                     name="dob"
                     value={formData.dob}
                     onChange={handleChange}
                     onBlur={() => handleBlur("dob")}
                     onFocus={() => handleFocus("dob")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.dob
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                     placeholder=""
                   />
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.dob || formData.dob
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Date of Birth *
                   </label>
                   {error.dob && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.dob}
                     </p>
                   )}
                 </div>

                 <div className="relative w-full">
                   <select
                     name="gender"
                     value={formData.gender}
                     onChange={handleChange}
                     onBlur={() => handleBlur("gender")}
                     onFocus={() => handleFocus("gender")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.gender
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   >
                     <option
                       className="p-3 rounded"
                       disabled
                       hidden
                       value=""
                     ></option>
                     <option className="p-3 rounded" value="male">
                       Male
                     </option>
                     <option className="p-3 rounded" value="female">
                       Female
                     </option>
                   </select>
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.gender || formData.gender
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Gender *
                   </label>
                   {error.gender && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.gender}
                     </p>
                   )}
                 </div>
               </div>
             </div>

             {/* COURSES INFORMATION */}

             <div className="mt-7">
               <h1 className="lg:text-xl text-white font-bold bg-primary w-[70%] p-1 rounded-t-2xl mx-auto lg:w-[20%] ">
                 Available Programs
               </h1>
               <hr className="border-2 border-primary" />

               {/* First Course Dropdown */}
               <div className="relative mt-6 mb-6">
                 <select
                   name="firstCourse"
                   value={formData.firstCourse}
                   onChange={handleChange}
                   className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                     error.firstCourse
                       ? "border-3 border-red-700"
                       : "border-gray-300"
                   }`}
                 >
                   <option
                     className="p-3 rounded"
                     disabled
                     hidden
                     value=""
                   ></option>
                   <option
                     className="p-3 rounded"
                     value="fast_track_technical"
                   >
                     Fast Track Technical Program
                   </option>
                   <option
                     className="p-3 rounded"
                     value="fast_track_non_technical"
                   >
                     Fast Track Non-Technical Program
                   </option>
                   <option
                     className="p-3 rounded"
                     value="associate_certificate"
                   >
                     Associate Certificate Program
                   </option>
                 </select>
                 <label
                   className={`absolute left-1 text-gray-400 text-sm transition-all ${
                     formData.firstCourse
                       ? "top-[-8px] px-2 text-xs text-primary bg-white"
                       : "top-[-10px] px-2 bg-white"
                   }`}
                 >
                   First Course Category *
                 </label>
               </div>

               {formData.firstCourse && (
                 <div className="relative mt-6 mb-6">
                   <select
                     name="firstCourseSelection"
                     value={formData.selectedCourses[0] || ""}
                     onChange={(e) => handleCourseSelect(e, 0)}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.firstCourseSelection
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   >
                     {coursesData
                       .filter(
                         (data) =>
                           data.courseCategory === formData.firstCourse
                       )
                       .map((data, idx) => (
                         <option
                           className="p-3 rounded"
                           key={idx}
                           value={data.courseTitle}
                         >
                           {data.courseTitle}
                         </option>
                       ))}
                   </select>
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       formData.selectedCourses[0]
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Select First Course *
                   </label>
                 </div>
               )}

               {/* Second Course Dropdown */}
               <div className="relative mt-6 mb-6">
                 <select
                   name="secondCourse"
                   value={formData.secondCourse}
                   onChange={handleChange}
                   className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                     error.secondCourse
                       ? "border-3 border-red-700"
                       : "border-gray-300"
                   }`}
                 >
                   <option
                     className="p-3 rounded"
                     disabled
                     hidden
                     value=""
                   ></option>
                   <option
                     className="p-3 rounded"
                     value="fast_track_technical"
                   >
                     Fast Track Technical Program
                   </option>
                   <option
                     className="p-3 rounded"
                     value="fast_track_non_technical"
                   >
                     Fast Track Non-Technical Program
                   </option>
                   <option
                     className="p-3 rounded"
                     value="associate_certificate"
                   >
                     Associate Certificate Program
                   </option>
                 </select>
                 <label
                   className={`absolute left-1 text-gray-400 text-sm transition-all ${
                     formData.secondCourse
                       ? "top-[-8px] px-2 text-xs text-primary bg-white"
                       : "top-[-10px] px-2 bg-white"
                   }`}
                 >
                   Second Course Category (Optional)
                 </label>
               </div>

               {formData.secondCourse && (
                 <div className="relative mt-6 mb-6">
                   <select
                     name="secondCourseSelection"
                     value={formData.selectedCourses[1] || ""}
                     onChange={(e) => handleCourseSelect(e, 1)}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.secondCourseSelection
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   >
                     {coursesData
                       .filter(
                         (data) =>
                           data.courseCategory === formData.secondCourse
                       )
                       .map((data, idx) => (
                         <option
                           className="p-3 rounded"
                           key={idx}
                           value={data.courseTitle}
                         >
                           {data.courseTitle}
                         </option>
                       ))}
                   </select>
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       formData.selectedCourses[1]
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Select Second Course
                   </label>
                 </div>
               )}

               {/* Third Course Dropdown */}
               <div className="relative mt-6 mb-6">
                 <select
                   name="thirdCourse"
                   value={formData.thirdCourse}
                   onChange={handleChange}
                   className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                     error.thirdCourse
                       ? "border-3 border-red-700"
                       : "border-gray-300"
                   }`}
                 >
                   <option
                     className="p-3 rounded"
                     disabled
                     hidden
                     value=""
                   ></option>
                   <option
                     className="p-3 rounded"
                     value="fast_track_technical"
                   >
                     Fast Track Technical Program
                   </option>
                   <option
                     className="p-3 rounded"
                     value="fast_track_non_technical"
                   >
                     Fast Track Non-Technical Program
                   </option>
                   <option
                     className="p-3 rounded"
                     value="associate_certificate"
                   >
                     Associate Certificate Program
                   </option>
                 </select>
                 <label
                   className={`absolute left-1 text-gray-400 text-sm transition-all ${
                     formData.thirdCourse
                       ? "top-[-8px] px-2 text-xs text-primary bg-white"
                       : "top-[-10px] px-2 bg-white"
                   }`}
                 >
                   Third Course Category (Optional)
                 </label>
               </div>

               {formData.thirdCourse && (
                 <div className="relative mt-6 mb-6">
                   <select
                     name="thirdCourseSelection"
                     value={formData.selectedCourses[2] || ""}
                     onChange={(e) => handleCourseSelect(e, 2)}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.thirdCourseSelection
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   >
                     {coursesData
                       .filter(
                         (data) =>
                           data.courseCategory === formData.thirdCourse
                       )
                       .map((data, idx) => (
                         <option
                           className="p-3 rounded"
                           key={idx}
                           value={data.courseTitle}
                         >
                           {data.courseTitle}
                         </option>
                       ))}
                   </select>
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       formData.selectedCourses[2]
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Select Third Course
                   </label>
                 </div>
               )}
             </div>

             {/* Education Information Start*/}

             <div className="mt-6">
               <h1 className="lg:text-xl text-white font-bold bg-primary w-[70%] p-1 rounded-t-2xl mx-auto lg:w-[20%] ">
                 Education
               </h1>
               <hr className="border-2 border-primary" />
               <div className="relative mt-6 mb-6">
                 <select
                   name="qualification"
                   value={formData.qualification}
                   onChange={handleChange}
                   onBlur={() => handleBlur("qualification")}
                   onFocus={() => handleFocus("qualification")}
                   className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                     error.qualification
                       ? "border-3 border-red-700"
                       : "border-gray-300"
                   }`}
                 >
                   <option
                     className="p-3 rounded"
                     disabled
                     hidden
                     value=""
                   ></option>
                   <option className="p-3 rounded" value="matric">
                     Matric
                   </option>
                   <option className="p-3 rounded" value="intermediate">
                     Intermediate
                   </option>
                   <option className="p-3 rounded" value="o/alevel">
                     O/A Level
                   </option>
                   <option className="p-3 rounded" value="undergraduate">
                     UnderGraduate
                   </option>
                   <option className="p-3 rounded" value="graduate">
                     Graduate
                   </option>
                   <option className="p-3 rounded" value="postgraduate">
                     Post Graduate
                   </option>
                 </select>
                 <label
                   className={`absolute left-1 text-gray-400 text-sm transition-all ${
                     focusState.qualification || formData.qualification
                       ? "top-[-8px] px-2 text-xs text-primary bg-white"
                       : "top-[-10px] px-2 bg-white"
                   }`}
                 >
                   Qualification *
                 </label>
                 {error.qualification && (
                   <p className="text-right text-[10px] text-red-700">
                     {error.qualification}
                   </p>
                 )}
               </div>
             </div>

             {/* Matric */}
             {formData.qualification === "matric" && (
               <div className="mt-6">
                 <div className="relative mt-6 mb-6">
                   <select
                     name="education"
                     value={formData.education}
                     onChange={handleChange}
                     onBlur={() => handleBlur("education")}
                     onFocus={() => handleFocus("education")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.education
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   >
                     <option
                       className="p-3 rounded"
                       disabled
                       hidden
                       value=""
                     ></option>
                     <option className="p-3 rounded" value="science">
                       Science
                     </option>
                     <option className="p-3 rounded" value="arts">
                       Arts
                     </option>
                   </select>
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.education || formData.education
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2"
                     }`}
                   >
                     Education *
                   </label>
                   {error.education && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.education}
                     </p>
                   )}
                 </div>
               </div>
             )}

             {/* Inter */}
             {formData.qualification === "intermediate" && (
               <div className="mt-6">
                 <div className="relative mt-6 mb-6">
                   <select
                     name="education"
                     value={formData.education}
                     onChange={handleChange}
                     onBlur={() => handleBlur("education")}
                     onFocus={() => handleFocus("education")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.education
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   >
                     <option
                       className="p-3 rounded"
                       disabled
                       hidden
                       value=""
                     ></option>
                     <option className="p-3 rounded" value="fsc_engineering">
                       F.Sc (Pre Engineering)
                     </option>
                     <option className="p-3 rounded" value="fsc_medical">
                       F.Sc (Pre Medical)
                     </option>
                     <option className="p-3 rounded" value="ics">
                       ICS
                     </option>
                     <option className="p-3 rounded" value="i.com">
                       I.COM
                     </option>
                     <option className="p-3 rounded" value="fa">
                       F.A
                     </option>
                     <option
                       className="p-3 rounded"
                       value="fageneralscience"
                     >
                       F.A General Science
                     </option>
                   </select>
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.education || formData.education
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2"
                     }`}
                   >
                     Education *
                   </label>
                   {error.education && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.education}
                     </p>
                   )}
                 </div>
               </div>
             )}

             {/* Institue */}

             <div className="relative mb-6">
               <input
                 type="text"
                 name="institute"
                 value={formData.institute}
                 onChange={handleChange}
                 onBlur={() => handleBlur("institute")}
                 onFocus={() => handleFocus("institute")}
                 className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                   error.institute
                     ? "border-3 border-red-700"
                     : "border-gray-300"
                 }`}
               />

               <label
                 className={`absolute left-1 text-gray-400 text-sm transition-all ${
                   focusState.institute || formData.institute
                     ? "top-[-8px] px-2 text-xs text-primary bg-white"
                     : "top-[-10px] px-2 bg-white"
                 }`}
               >
                 Institute Name *
               </label>
               {error.institute && (
                 <p className="text-right text-[10px] text-red-700">
                   {error.institute}
                 </p>
               )}
             </div>

             {/* Education Information End */}

             {/* Address */}

             <div className="mt-6">
               <h1 className="lg:text-xl text-white font-bold bg-primary w-[70%] p-1 rounded-t-2xl mx-auto lg:w-[20%] ">
                 Address
               </h1>
               <hr className="border-2 border-primary" />
               <div className="flex flex-col items-center lg:flex-row gap-5 mt-6 mb-6">
                 <div className="relative w-full">
                   <select
                     name="province"
                     value={formData.province}
                     onChange={handleChange}
                     onBlur={() => handleBlur("province")}
                     onFocus={() => handleFocus("province")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.province
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   >
                     <option
                       className="p-3 rounded"
                       disabled
                       hidden
                       value=""
                     ></option>
                     <option className="p-3 rounded" value="punjab">
                       Punjab
                     </option>
                     <option className="p-3 rounded" value="kpk">
                       KPK
                     </option>
                     <option className="p-3 rounded" value="sindh">
                       Sindh
                     </option>
                     <option className="p-3 rounded" value="balochistan">
                       Balochistan
                     </option>
                     <option className="p-3 rounded" value="gilgit">
                       Gilgit BT
                     </option>
                   </select>
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.province || formData.province
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Province *
                   </label>
                   {error.province && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.province}
                     </p>
                   )}
                 </div>

                 {/* Country */}
                 <div className="relative w-full">
                   <input
                     type="text"
                     name="country"
                     value={formData.country}
                     onChange={handleChange}
                     onBlur={() => handleBlur("country")}
                     onFocus={() => handleFocus("country")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.country
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   />
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.country || formData.country
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Country *
                   </label>
                   {error.country && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.country}
                     </p>
                   )}
                 </div>
               </div>

               <div className="flex flex-col items-center lg:flex-row gap-5 mt-6 mb-6">
                 <div className="relative w-full">
                   <input
                     type="text"
                     name="city"
                     value={formData.city}
                     onChange={handleChange}
                     onBlur={() => handleBlur("city")}
                     onFocus={() => handleFocus("city")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.city
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   />
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.city || formData.city
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     City *
                   </label>
                   {error.city && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.city}
                     </p>
                   )}
                 </div>

                 <div className="relative w-full">
                   <input
                     type="text"
                     name="address"
                     value={formData.address}
                     onChange={handleChange}
                     onBlur={() => handleBlur("address")}
                     onFocus={() => handleFocus("address")}
                     className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                       error.address
                         ? "border-3 border-red-700"
                         : "border-gray-300"
                     }`}
                   />
                   <label
                     className={`absolute left-1 text-gray-400 text-sm transition-all ${
                       focusState.address || formData.address
                         ? "top-[-8px] px-2 text-xs text-primary bg-white"
                         : "top-[-10px] px-2 bg-white"
                     }`}
                   >
                     Address *
                   </label>
                   {error.address && (
                     <p className="text-right text-[10px] text-red-700">
                       {error.address}
                     </p>
                   )}
                 </div>
               </div>
             </div>

             {/* Additional Free Course Voucher */}

             <div className="mt-6">
               <h1 className="lg:text-xl text-white font-bold bg-primary w-[90%] p-1 rounded-t-2xl mx-auto lg:w-[30%] ">
                 Additional Free Course Voucher
               </h1>
               <hr className="border-2 border-primary" />
               <div className="relative text-left mt-2 mb-6">
                 <p className="font-bold text-sm">
                   (Provide us a valid reference code if you have any.)
                 </p>
               </div>
               <div className="relative text-left mt-2 ">
                 <input
                   type="text"
                   name="referencecode"
                   value={formData.referencecode}
                   onChange={handleChange}
                   onBlur={() => handleBlur("referencecode")}
                   onFocus={() => handleFocus("referencecode")}
                   className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                     error.referencecode
                       ? "border-3 border-red-700"
                       : "border-gray-300"
                   }`}
                 />
                 <label
                   className={`absolute left-1 text-gray-400 text-sm transition-all ${
                     focusState.referencecode || formData.referencecode
                       ? "top-[-8px] px-2 text-xs text-primary bg-white"
                       : "top-[-10px] px-2 bg-white"
                   }`}
                 >
                   Reference Code (optional)
                 </label>
               </div>
               <p className="text-left text-sm text-red-700">
                 Note: Students who will provide us a valid refer code /
                 refernce code, will be able to get free additional
                 freelancing course at the end of the program without any
                 registration. In case, you do't have reference code, Please
                 left this field empty.
               </p>

               <div className="relative text-left mt-10 ">
                 <select
                   name="gettoknow"
                   value={formData.gettoknow}
                   onChange={handleChange}
                   onBlur={() => handleBlur("gettoknow")}
                   onFocus={() => handleFocus("gettoknow")}
                   className={`w-full rounded border-2 p-3 text-sm focus:border-primary focus:outline-none ${
                     error.gettoknow
                       ? "border-3 border-red-700"
                       : "border-gray-300"
                   }`}
                 >
                   <option
                     className="p-3 rounded"
                     disabled
                     hidden
                     value=""
                   ></option>
                   <option className="p-3 rounded" value="Youtube">
                     Youtube
                   </option>
                   <option className="p-3 rounded" value="Instagram">
                     Instagram
                   </option>
                   <option className="p-3 rounded" value="Twitter">
                     Sindh
                   </option>
                   <option className="p-3 rounded" value="Facebook">
                     Facebook
                   </option>
                   <option className="p-3 rounded" value="Google">
                     Google
                   </option>
                   <option className="p-3 rounded" value="Tiktok">
                     Tiktok
                   </option>
                   <option className="p-3 rounded" value="Linkedin">
                     Linkedin
                   </option>
                   <option className="p-3 rounded" value="Friends">
                     Linkedin
                   </option>
                   <option className="p-3 rounded" value="NewsPaper">
                     NewsPaper
                   </option>
                   <option className="p-3 rounded" value="Other">
                     Other
                   </option>
                 </select>
                 <label
                   className={`absolute left-1 text-gray-400 text-sm transition-all ${
                     focusState.gettoknow || formData.gettoknow
                       ? "top-[-8px] px-2 text-xs text-primary bg-white"
                       : "top-[-10px] px-2 bg-white"
                   }`}
                 >
                   How you know about us*
                 </label>
               </div>
             </div>

             <button
               type="submit"
               className="bg-primary p-3 w-full text-white hover:bg-second rounded mt-2"
             >
               {formLoading ? "Submitting" : "Submit"}
             </button>
           </form>
         </div>
          )}
        </div>
        {toast.visible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
