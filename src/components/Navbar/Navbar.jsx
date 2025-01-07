"use client";
import React, { useEffect, useState } from "react";
import { FaAngleDown, FaHistory, FaRegUserCircle } from "react-icons/fa";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import SidebarMenu from "./SidebarMenu";
import Cookies from "js-cookie";
import {
  getAllCertificationCategoryes,
  getAllCourses,
  getSingleUser,
} from "../../Backend/firebasefunctions";
import { useRouter } from "next/navigation";
import CustomToast from "../CoustomToast/CoustomToast";
import { firestore } from "@/Backend/Firebase";
import { doc, getDoc } from "firebase/firestore";
import MobileCertificationSearching from "./MobileCertificationSearching";
import userHooks from "@/Hooks/userHooks";
import MobileProfileButton from "./MobileProfileButton";

const Navbar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchedUser, setFetchedUser] = useState(null);
  const { userData } = userHooks();

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

  useEffect(() => {
    const userFetchedData = async () => {
      if (!userData?.id) {
        console.log("User data or UID is missing.");
        return; // Early return if userData or uid is missing
      }

      try {
        const data = await getSingleUser(userData.id);
        console.log(data);
        setFetchedUser(data.data); // Assuming `data.data` contains the fetched user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    userFetchedData();
  }, [userData]);
  const HandleLogout = () => {
    Cookies.remove("user_data");
    window.location.href = "/";
  };
  const [category, setCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isInputActive, setIsInputActive] = useState(false);
  useEffect(() => {
    const fetchAllCourses = async () => {
      const data = await getAllCourses();
      setCoursesData(data.data);
    };
    fetchAllCourses();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allCertificationCategoryes = await getAllCertificationCategoryes();
      setCategory(allCertificationCategoryes.data);
      setSelectedCategoryData(
        allCertificationCategoryes.data[0].coursesInThisCertifications
      );
      setLoading(false);
    };
    fetchData();
  }, []);

  const [fetchUserRegistrationDatae, setFetchUserRegistrationDatae] =
    useState(null);

  useEffect(() => {
    const fetchUserRegistrationData = async () => {
      setLoading(true);
      if (!userData?.id) {
        return;
      }

      try {
        const userDocRef = doc(
          firestore,
          "users",
          userData?.id
        );
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setFetchUserRegistrationDatae(data);
        } else {
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };

    fetchUserRegistrationData();
  }, [userData]);

  const fetchCourses = async () => {
    const filteredCourses = coursesData
      .filter((course) =>
        course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 4);
    setSearchResults(filteredCourses);

    // Save search query to recent searches if it's not empty
    if (searchQuery.trim() !== "") {
      const updatedRecentSearches = [
        searchQuery,
        ...recentSearches.filter((q) => q !== searchQuery),
      ].slice(0, 5); // Keep max 5 searches
      setRecentSearches(updatedRecentSearches);
      localStorage.setItem(
        "recentSearches_desktop",
        JSON.stringify(updatedRecentSearches)
      );
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchCourses();
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const savedSearches =
      JSON.parse(localStorage.getItem("recentSearches_desktop")) || [];
    setRecentSearches(savedSearches);
  }, []);

  const [categoryLoading, setCategoryLoading] = useState(false);
  const handleCategoryClick = (data) => {
    setCategoryLoading(true);
    setSelectedCategoryData(data);

    setTimeout(() => {
      setCategoryLoading(false);
    }, 2000);
  };

  const handleRegistration = async () => {
    router.push("/registration");
  };

  return (
    <div className="bg-white py-4 sticky top-0 z-50 shadow-lg">
      {toast.visible && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleCloseToast}
        />
      )}
      <div className="lg:px-6 lg:mx-auto mx-5">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center justify-between  gap-16 lg:gap-3 lg:justify-start ml-3 lg:ml-0 w-full lg:px-0 px-3">
            <SidebarMenu />
            <Link
              href="/"
              className=" lg:w-[110px] flex lg:mr-0 flex-col font-semibold"
            >
              <Image
                src={"/logo.jpg"}
                width={60}
                height={20}
                alt="headerLogo"
                className="w-70 h-full "
              />
            </Link>


            <div className="hidden lg:block" >
            <ul className="flex gap-3">
            <Link href="/">
                <li className="hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[0.9rem] font-bold ">
                  Home
                </li>
              </Link>


                {/* Available Courses */}
              <li className="relative group hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[0.9rem] font-bold text-black cursor-pointer">
                <div className="flex items-center gap-1">
                  <span className="">Available Courses</span> <FaAngleDown size={10} />
                </div>
                <ul className="absolute left-0 py-2 z-50 top-8 bg-white w-[270px] rounded-md shadow-lg hidden group-hover:block">
                  <Link href="/courses/fast_track_technical_program">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Fast Track Technical Programs
                    </li>
                  </Link>
                  <Link href="/courses/fast_track_non_technical_program">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Fast Track Non-Technical Programs
                    </li>
                  </Link>
                  <Link href="/courses/associate_certification_programs">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Associate Ceritification Programs
                    </li>
                  </Link>
                </ul>
              </li>

                {/* Join digiPAKISTAN */}
              <li className="relative group hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[0.9rem] font-bold text-black cursor-pointer">
                <div className="flex items-center gap-1">
                  <span className="">Join DigiPAKISTAN</span> <FaAngleDown size={10} />
                </div>
                <ul className="absolute left-0 py-2 z-50 top-8 bg-white w-[250px] rounded-md shadow-lg hidden group-hover:block">
                  <Link href="/about">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Become an Instructor
                    </li>
                  </Link>
                  
                  <Link href="/faq">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Become a Marketing Partner
                    </li>
                  </Link>
                </ul>
              </li>

              {/* Get Certificates */}
              <Link href="/get-certificate">
                <li className=" hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[0.9rem] font-bold ">
                  Get Certificate 
                </li>
              </Link>
              {/* How It Works */}
              <Link href="/howitworks">
                <li className="hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[0.9rem] font-bold flex gap-1">
                  <span>Admission</span>
                  <span>Process</span>
                </li>
              </Link>
              {/* FAQS */}
              <Link href="/faq">
                <li className="hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[0.9rem] font-bold ">
                  FAQ's 
                </li>
              </Link>


              <li className="relative group hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[0.9rem] font-bold text-black cursor-pointer">
                <div className="flex items-center gap-1">
                  <span className="">About</span> <FaAngleDown size={10} />
                </div>
                <ul className="absolute left-0 py-2 z-50 top-8 bg-white w-[250px] rounded-md shadow-lg hidden group-hover:block">
                  <Link href="/message/provincial-minister-message">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Provincial Minister Message
                    </li>
                  </Link>
                  <Link href="/message/director-general-message">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Director General (DG) Message
                    </li>
                  </Link>
                  <Link href="/message/chairman-hec-message">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Chairman HEC Punjab Message
                    </li>
                  </Link>
                  <Link href="/message/chairman-pec-message">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Chairman PEC Message
                    </li>
                  </Link>
                  <Link href="/team">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      DigiPAKISTAN Faculty
                    </li>
                  </Link>
                  <Link href="/about">
                    <li className="px-4 py-2  text-black hover:bg-primary hover:text-white hover:rounded font-normal duration-500 ">
                      About Us
                              </li>
                  </Link>

                </ul>
              </li>


              <Link href="/contact">
                <li className="hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[0.9rem] font-bold ">
                     Contact
                </li>
              </Link>
            </ul>
          </div>

            {/* <div className="border-primary border group relative hidden lg:block text-primary hover:bg-primary hover:text-white py-1.5 px-3 rounded-md duration-100 text-[0.9rem] font-bold">
              <div className="flex items-center gap-2">
                <span>Explore</span>
                <IoIosArrowDown className="group-hover:rotate-180 duration-300" />
              </div>

              <div className="hidden pt-[1rem] group-hover:block top-[2.13rem] duration-500 absolute">
                <div className="text-black shadow-2xl border-2 border-gray-300 border-t-0 flex flex-col w-[300px] md:flex-row md:w-[650px] lg:w-[1000px] -ml-24 h-[500px] z-50 md:translate-y-10 group-hover:translate-y-0">
                  <div className="w-full md:w-1/3 py-5 h-full max-h-[500px] overflow-y-scroll custom-scrollbar bg-white">
                    {loading ? (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="flex-col gap-4 w-full flex items-center justify-center">
                          <div className="w-10 h-10 border-2 text-primary text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-primary rounded-full"></div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h1 className="heading-text text-xl font-bold px-5">
                          Certification Programs
                        </h1>
                        <hr className="mt-4" />
                        <div>
                          <ul className="flex flex-col">
                            {category?.map(
                              (data, idx) =>
                                data.status === "active" && (
                                  <li
                                    key={idx}
                                    onClick={() =>
                                      handleCategoryClick(
                                        data.coursesInThisCertifications
                                      )
                                    }
                                    className={`py-4 pl-7 text-[0.9rem] font-bold text-gray-600 group flex justify-between font-medium cursor-pointer duration-500 items-center pr-5 ${
                                      selectedCategoryData ===
                                      data.coursesInThisCertifications
                                        ? "bg-primary text-white"
                                        : "hover:bg-bgcolor hover:text-primary"
                                    }`}
                                  >
                                    <span>{data.certificationsTitle}</span>
                                    <IoIosArrowForward className="hidden group-hover:block" />
                                  </li>
                                )
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-full max-h-[500px] overflow-y-scroll custom-scrollbar bg-[#f2f2f2]">
                    {loading ? (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="flex-col gap-4 w-full flex items-center justify-center">
                          <div className="w-10 h-10 border-2 text-primary text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-primary rounded-full"></div>
                        </div>
                      </div>
                    ) : selectedCategoryData ? (
                      <div className="flex flex-col gap-2">
                        <div className="py-5 border shadow-lg px-5 text-[15px] bg-white font-semibold heading-text">
                          <h2>{category.certificationsTitle}</h2>
                          <p className="text-[12px] text-gray-600">
                            Earn industry-recognized certificates in high-demand
                            fields
                          </p>
                        </div>
                        <div className="p-5 flex flex-col justify-between h-full">
                          {selectedCategoryData.length > 0 ? (
                            <div className="grid lg:grid-cols-2 gap-2 w-[90%]">
                              {selectedCategoryData.map((course, idx) => {
                                return (
                                  <div key={idx}>
                                    {categoryLoading ? (
                                      <div className="px-5 bg-gray-200 rounded-md shadow-md animate-pulse h-[7.5rem] pt-2 pb-5 gap-3 flex">
                                        <div className="mt-8 w-[40px] h-[35px] bg-gray-300 rounded-full"></div>
                                        <div className="w-full mt-7">
                                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                                        </div>
                                      </div>
                                    ) : (
                                      <Link
                                        href={`/course/${course.siteCourseId}`}
                                        key={idx}
                                        className="w-full "
                                      >
                                        <div className="w-full bg-white  duration-500 shadow-lg px-2 rounded-lg border-[2px] h-[8rem] hover:border-primary py-3">
                                          <div className="px-5 pt-2 pb-5 gap-3 flex">
                                            <div className="mt-3">
                                              <Image
                                                src={
                                                  course.examCertificateInPicture
                                                }
                                                width={40}
                                                height={40}
                                                alt="instructorBrandLogo"
                                              />
                                            </div>
                                            <div className="w-full mt-1">
                                              <h3 className="font-medium text-[15px]">
                                                {course.courseTitle}
                                              </h3>
                                              <h5 className="text-gray-500">
                                                {" "}
                                                {course.courseShortDescription.slice(
                                                  0,
                                                  40
                                                )}
                                                ...
                                              </h5>
                                            </div>
                                          </div>
                                        </div>
                                      </Link>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-gray-500">
                              Select a category to view details.
                            </p>
                          )}
                          <Link href={"/courses"}>
                            <button className="border-2 mt-5 float-right text-white hover:text-black border-primary duration-300 hover:bg-white hover:border-primary bg-primary py-2 px-5 rounded-[5px] text-[14px]">
                              Explore All Programs
                            </button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="py-5 border shadow-lg px-5 text-[15px] bg-white font-semibold heading-text">
                          <h2>{category.certificationsTitle}</h2>
                          <p className="text-[12px] text-gray-600">
                            Earn industry-recognized certificates in high-demand
                            fields
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div> */}

{/* 
            <div className="bg-bgcolor border-primary border rounded-full items-center w-[300px] lg:flex hidden">
              <input
                type="text"
                className="w-full px-3 py-0.5 bg-transparent outline-none placeholder:text-[0.9rem] font-bold"
                placeholder="What do you want to learn?"
                value={searchQuery}
                onFocus={() => setIsInputActive(true)} // Set active on focus
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery ? (
                <div onClick={() => setSearchQuery("")}>
                  <IoIosCloseCircleOutline
                    className="mr-2 cursor-pointer"
                    size={20}
                  />
                </div>
              ) : (
                ""
              )}
              <button className="bg-second hover:bg-primary duration-500 p-[0.30rem] m-1 text-white rounded-full">
                <IoSearchOutline />
              </button>

              {searchResults.length > 0 && (
                <div className="absolute top-16 border-primary bg-white shadow-lg border rounded-md w-[400px] mt-2 max-h-[300px] custom-scrollbar overflow-y-auto">
                  <>
                    <div className="mt-4">
                      <span className="font-bold px-4 text-[0.9rem] font-bold">
                        Showing results for "{searchQuery}"
                      </span>
                      <hr className="mt-4" />
                    </div>
                    {searchResults.map((course) => (
                      <Link
                        key={course.id}
                        href={`/course/${course.id}`}
                        className="block px-4 py-4 hover:bg-gray-100 "
                      >
                        <div className="flex gap-3">
                          <Image
                            src={course.instructorBrandLogo}
                            alt={course.courseTitle}
                            className="w-[40px] h-[40px]  rounded"
                            width={300}
                            height={300}
                            priority
                            loading="eager"
                          />
                          <div>
                            <h3 className="font-medium text-[14px]">
                              {course.courseTitle}
                            </h3>
                            <p className="text-gray-500 text-[0.9rem] font-bold">
                              {course.courseShortDescription.slice(0, 40)}...
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </>
                  <div className="mt-4">
                    <span className="font-bold px-4 text-[0.9rem] font-bold">
                      Recent Searches
                    </span>
                    <div className="mt-2 bg-white rounded-md">
                      {recentSearches.map((query, index) => (
                        <div
                          key={index}
                          className="flex text-gray-600 items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setSearchQuery(query)}
                        >
                          <FaHistory /> <span>{query}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div> */}
            <div className="flex items-center gap-3 lg:hidden">
            <MobileProfileButton
              userData={userData}
              fetchUserRegistrationDatae={fetchUserRegistrationDatae}
              fetchedUser={fetchedUser}
            />
          </div>
          </div>


          
          {/* <div className="flex items-center gap-3 lg:hidden">
            <MobileProfileButton
              userData={userData}
              fetchUserRegistrationDatae={fetchUserRegistrationDatae}
              fetchedUser={fetchedUser}
            />
          </div> */}
          <div className="lg:flex hidden items-center gap-2">
            <ul className="flex items-center gap-2">
              
              {userData ? (
                <Link
                  href={
                    fetchUserRegistrationDatae?.registrationStatus === "pending"
                      ? `/registration-status/${userData?.id}`
                      : fetchUserRegistrationDatae?.registrationStatus ===
                        "approved"
                      ? `/registration-status/${userData?.id}`
                      : fetchUserRegistrationDatae?.registrationStatus ===
                        "completed"
                      ? `/registration-status/${userData?.id}`
                      : fetchUserRegistrationDatae?.registrationStatus ===
                        undefined
                      ? "/registration"
                      : "/registration"
                  }
                >
                  <button>
                    <li className="hover:text-primary duration-300 border py-1.5 px-3 rounded-md border-primary text-[0.9rem] font-bold ">
                      Dashboard
                    </li>
                  </button>
                </Link>
              ) : (
                <button onClick={handleRegistration}>
                  <li className="bg-primary font-bold hover:bg-second w-[100px] text-white duration-300 border py-2 px-2 rounded-md border-primary text-[0.9rem] ">
                    Apply Now
                  </li>
                </button>
              )}
            </ul>
            {userData ? (
              <div className="flex items-center gap-x-3">
                <div className="w-[120px] relative group hover:text-primary duration-300 text-black cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="">
                      <FaRegUserCircle size={26} />
                    </div>
                    <h2 className="w-full">{userData?.firstName}</h2>
                  </div>
                  <div className="absolute right-1 z-50 top-5 -mt-4 py-10">
                    <ul className="py-2 bg-white w-[200px] rounded-md shadow-lg hidden group-hover:block">
                      <Link
                        href={ fetchUserRegistrationDatae?.registrationStatus ===
                          "pending"
                            ? `/registration/registration-status`
                            : fetchUserRegistrationDatae?.registrationStatus ===
                              "approved"
                            ? `/registration/registration-status`
                            : fetchUserRegistrationDatae?.registrationStatus ===
                              "completed"
                            ? `/registration/registration-status`
                            : fetchUserRegistrationDatae?.registrationStatus ===
                              undefined
                            ? "/registration"
                            : "/registration"
                        }
                      >
                        <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded duration-500 hover:te2t-primary">
                          Admission Status
                        </li>
                      </Link>
                      <button onClick={HandleLogout}>
                        <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded duration-500 hover:te2t-primary">
                          Logout
                        </li>
                      </button>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/signin" className="flex items-center gap-3">
                  <button className="btn-primary duration-300 text-primary hover:bg-primary hover:text-white py-1 px-3 font-bold">
                      Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
