import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import {
  MdLogout,
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import {
  getAllCertificationCategoryes,
  getSingleUser,
  getUserRegistrationD,
} from "@/Backend/firebasefunctions";
import Link from "next/link";
import Cookies from "js-cookie";
import Image from "next/image";
import userHooks from "@/Hooks/userHooks";
import { FaAngleDown } from "react-icons/fa";

const SidebarMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categoryPage, setCategoryPage] = useState(false);
  const [showCategoryData, setShowCategoryData] = useState(false);
  const [category, setCategory] = useState([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState([]);
  const { userData } = userHooks();

  useEffect(() => {
    const fetchData = async () => {
      const allCategories = await getAllCertificationCategoryes();
      setCategory(allCategories?.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Toggle body overflow based on the sidebar state
    if (isSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Clean up the effect by removing the overflow class when the component unmounts
    return () => document.body.classList.remove("overflow-hidden");
  }, [isSidebarOpen]);

  const HandleLogout = () => {
    Cookies.remove("user_data");
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleExploreClick = () => {
    setCategoryPage(true);
    setShowCategoryData(false);
  };

  const [categoryLoading, setCategoryLoading] = useState(false);
  const handleCategoryClick = (categoryData) => {
    setCategoryLoading(true);
    setSelectedCategoryData(categoryData || []);
    setShowCategoryData(true);

    setTimeout(() => {
      setCategoryLoading(false);
    }, 3000);
  };

  const [fetchedUser, setFetchedUser] = useState(null);

  useEffect(() => {
    const userFetchedData = async () => {
      if (!userData?.uid) {
        return; // Early return if userData or uid is missing
      }

      try {
        const data = await getSingleUser(userData?.uid);
        setFetchedUser(data.data); // Assuming `data.data` contains the fetched user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    userFetchedData();
  }, [userData]);

  const [fetchUserRegistrationDatae, setFetchUserRegistrationDatae] =
    useState(null);

  useEffect(() => {
    const getUserRegistrationData = async () => {
      const data = await getUserRegistrationD(userData?.id);
      setFetchUserRegistrationDatae(data);
    };

    getUserRegistrationData();
  }, [userData]);

  return (
    <div className="">
      <div className="lg:hidden cursor-pointer items-center gap-2 flex">
        <FiMenu size={15} onClick={toggleSidebar} className="text-black" />
      </div>

      {/* Sidebar and Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-75 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

      {/* Main Sidebar */}
      <div
        className={`fixed inset-0 bg-white h-full overflow-y-scroll custom-scrollbar pb-5 text-black z-50 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute top-6 left-6">
          <h1 className="text-2xl font-semibold text-center">DigiPAKISTAN</h1>
        </div>
        <button
          className="absolute top-6 right-6 font-thin text-black text-2xl"
          onClick={toggleSidebar}
        >
          <AiOutlineClose />
        </button>
        {!categoryPage && !showCategoryData && (
          <div className="flex flex-col justify-between h-full">
            <ul className="mt-20 gap-1 flex flex-col mx-5">
              {/* <hr className="h-[1px] bg-gray-200" /> */}

              {/* <div className="my-2">
                <div className="flex items-center gap-x-3">
                  <div
                    onClick={handleExploreClick}
                    className="relative group flex justify-between w-full items-center hover:text-primary duration-300 cursor-pointer"
                  >
                    <h4 className="text-[13px] font-semibold">
                      Explore Certifications
                    </h4>
                    <MdOutlineArrowForwardIos />
                  </div>
                </div>
              </div> */}
              <hr className="h-[1px] bg-gray-200" />
              <Link href={"/"}>
                <li className="text-[13px] p-2 font-normal hover:rounded duration-300 hover:text-white  hover:bg-primary py-2 ">
                  Home
                </li>
              </Link>
              <li className="relative group hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[13px]   text-black cursor-pointer">
                <div className="flex items-center gap-1">
                  <span className="">Available Courses</span> <FaAngleDown size={10} />
                </div>
                <ul className="absolute left-0 py-2 z-50 top-8 bg-white w-[270px] rounded-md shadow-lg hidden group-hover:block">
                  <Link href="/courses/fast-track-technical-programs">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Fast Track Technical Programs
                    </li>
                  </Link>
                  <Link href="/courses/fast-track-non-technical-programs">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Fast Track Non-Technical Programs
                    </li>
                  </Link>
                  <Link href="/courses/associate-certificate-programs">
                    <li className="px-4 py-2 text-black  hover:bg-primary hover:text-white hover:rounded font-normal duration-200 ">
                      Associate Ceritification Programs
                    </li>
                  </Link>
                </ul>
              </li>
              <Link href="/get-certificate">
                <li className=" hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[13px]">
                  Get Certificate 
                </li>
              </Link>
              <Link href="/howitworks">
                <li className="hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[13px] flex gap-1">
                  <span>Admission</span>
                  <span>Process</span>
                  
                </li>
              </Link>
              <Link href="/faq">
                <li className="hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[13px]  ">
                  FAQ's 
                </li>
              </Link>

              <li className="relative group hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[13px]  text-black cursor-pointer">
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
                <li className="hover:text-white hover:bg-primary p-2 hover:rounded duration-300 text-[13px]  ">
                     Contact
                </li>
              </Link>
            </ul>
            <div>
              <div>
                <div
                  className={`md:flex flex-col mt-4 md:mt-0 md:flex-row justify-between max-w-6xl  lg:mx-auto mx-5 items-center `}
                >
                  <hr className="border my-2" />
                  <ul className="flex gap-2 text-[10px] text-black  md:text-[12px] ">
                    <Link href={"/privacy-policy"} className="hover:underline">
                      <li>Privacy Policy</li>
                    </Link>
                    <Link
                      href={"/terms-conditions"}
                      className="hover:underline"
                    >
                      <li>Terms & Conditions</li>
                    </Link>
                    <Link href={"/service-policy"} className="hover:underline">
                      <li>Service Policy</li>
                    </Link>
                    <Link href={"/refund-policy"} className="hover:underline">
                      <li>Refund Policy</li>
                    </Link>
                    <Link href={"/shipping-policy"} className="hover:underline">
                      <li>Shipping Policy</li>
                    </Link>
                    <Link
                      href={"/cancellation-policy"}
                      className="hover:underline"
                    >
                      <li>Cancellation Policy</li>
                    </Link>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category List Page */}
        {categoryPage && !showCategoryData && (
          <div className="mt-20 flex flex-col">
            <div className="py-3 px-5 bg-gray-50">
              <div className="flex items-center gap-x-3">
                <div
                  onClick={() => setCategoryPage(false)}
                  className="relative group flex gap-2 w-full items-center hover:text-primary duration-300 cursor-pointer"
                >
                  <MdOutlineArrowBackIosNew />
                  <h4 className="text-[13px] font-semibold">Main Menu</h4>
                </div>
              </div>
            </div>
            <div className="px-5 pt-5">
              <h3 className="text-[14px] font-bold ">Categories</h3>
              <ul className="flex gap-4 mt-3 flex-col">
                {category.map((data, idx) =>
                  data.status === "active" ? (
                    <li
                      onClick={() =>
                        handleCategoryClick(data.coursesInThisCertifications)
                      }
                      className="text-[13px] font-medium flex items-center w-full justify-between cursor-pointer"
                      key={idx}
                    >
                      <span>{data.certificationsTitle}</span>
                      <MdOutlineArrowForwardIos />
                    </li>
                  ) : (
                    ""
                  )
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Course List Page */}
        {showCategoryData && (
          <div className="mt-20 flex flex-col">
            <div className="py-3 px-5 bg-gray-50">
              <div className="flex items-center gap-x-3">
                <div
                  onClick={() => {
                    setShowCategoryData(false);
                    setCategoryPage(true);
                  }}
                  className="relative group flex gap-2 w-full items-center hover:text-primary duration-300 cursor-pointer"
                >
                  <MdOutlineArrowBackIosNew />
                  <h4 className="text-[13px] font-semibold">
                    Explore Certifications
                  </h4>
                </div>
              </div>
            </div>
            <div className="px-5 pt-5">
              <h3 className="text-[16px] my-5 font-bold ">
                {selectedCategoryData.categoryTitle}
              </h3>
              <hr className="h-[2px] mb-5 bg-gray-300" />
              <h3 className="text-[14px] font-bold mb-2">Certification</h3>
              <p className="text-[12px] mb-7">
                Empowering you with globally recognized certifications through
                flexible, high-quality, and cost-effective online learning
                designed to transform your future.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                {selectedCategoryData?.map((course, idx) => (
                  <div key={idx}>
                    {categoryLoading ? (
                      <div
                        className="bg-white border flex gap-1 border-gray-300 py-7 px-4 rounded-lg shadow-md animate-pulse"
                        key={idx}
                      >
                        {/* Placeholder for Image */}
                        <div className="w-[45px] h-[40px] mt-1 bg-gray-300 rounded-full"></div>

                        <div className="w-full mt-2">
                          {/* Placeholder for Course Title */}
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

                          {/* Placeholder for Course Description */}
                          <div className="h-3 bg-gray-300 rounded w-5/6 mb-3"></div>
                        </div>
                      </div>
                    ) : course.courseStatus === "active" ? (
                      <Link
                        href={`/course/${course.siteCourseId}`}
                        key={idx}
                        className="bg-white border flex gap-1 border-gray-300 p-4 rounded-lg shadow-md hover:border-primary"
                      >
                        <div className="w-[40px] mt-1">
                          <Image
                            src={course.examCertificateInPicture}
                            width={30}
                            height={30}
                            alt="tests"
                          />
                        </div>
                        <div className="w-full">
                          <h3 className="text-[14px] font-semibold">
                            {course.courseTitle}
                          </h3>
                          <p className="text-gray-600 text-[12px]">
                            {course.courseShortDescription.slice(0, 120)}...
                          </p>
                        </div>
                        <p className="text-gray-500 text-xs mt-1"></p>
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarMenu;
