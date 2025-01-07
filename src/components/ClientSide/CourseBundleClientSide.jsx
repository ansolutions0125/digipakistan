"use client";
import { firestore } from "@/Backend/Firebase";
import { getSingleCourseBundle } from "@/Backend/firebasefunctions";
import userHooks from "@/Hooks/userHooks";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";
import {
  FaInfoCircle,
  FaLongArrowAltRight,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoIosPeople } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";
import { MdOndemandVideo, MdOutlineWatchLater } from "react-icons/md";

const CourseBundleClientSide = ({ course }) => {
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userData } = userHooks();

  // Convert Firestore timestamps to ISO strings
  const convertFirestoreTimestamps = (data) => {
    if (data.created_at?.toDate) {
      data.created_at = data.created_at.toDate().toISOString();
    }
    if (data.updated_at?.toDate) {
      data.updated_at = data.updated_at.toDate().toISOString();
    }
    return data;
  };

  // Fetch individual course details by ID
  const fetchCourseById = async (courseId) => {
    const docRef = doc(firestore, "courses", courseId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return convertFirestoreTimestamps({ id: docSnap.id, ...docSnap.data() });
    } else {
      throw new Error("No such document!");
    }
  };

  // Fetch selected courses only when `course` is fully defined
  useEffect(() => {
    const fetchSelectedCourses = async () => {
      if (course?.selectedCourses?.length) {
        const courseIds = course.selectedCourses.map((da) => da.id);
        try {
          const courseData = await Promise.all(
            courseIds.map((id) => fetchCourseById(id))
          );
          setFetchedCourses(courseData);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      }
    };

    fetchSelectedCourses();
  }, [course?.selectedCourses]);

  // Hide the loader after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const makePayment = () => {
    sessionStorage.setItem("paymentInProgress", "pending");
    router.push(`/pay-bundle/${course.courseBundleId}`);
  };
  return (
    <div className="py-20">
      <div className="max-w-6xl lg:mx-auto mx-5">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col w-full">
            <div className="w-full h-[400px]">
              <img
                src={course?.courseBundleThumbnail}
                className="w-full h-full object-cover rounded-t-lg"
                alt={course?.courseBundleTitle}
              />
            </div>
            <div className="bottom-0 z-20 bg-white w-full max-w-5xl -mt-12 shadow-lg rounded-md mb-10 py-3 mx-auto border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                <div className="flex flex-col lg:border-r-2">
                  <div className="flex gap-1">
                    <MdOutlineWatchLater
                      size={20}
                      className="text-primary mt-1"
                    />
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium text-[1.2rem]">
                        Batch Duration
                      </span>
                      <span className="text-gray-800 text-[0.7rem]">
                        {course?.batchDuration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:border-r-2">
                  <div className="flex  gap-1">
                    <IoIosPeople size={20} className="text-primary mt-1" />
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium text-[1.2rem]">
                        Enrolled Trainees
                      </span>
                      <span className="text-gray-800 text-[0.7rem]">
                        {course?.courseEnrollments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:border-r-2">
                  <div className="flex gap-1">
                    <MdOndemandVideo size={20} className="text-primary mt-1" />
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium text-[1.2rem]">
                        Video Medium
                      </span>
                      <span className="text-gray-800 text-[0.7rem]">
                        {course?.videoMedium}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-1">
                    <MdOndemandVideo size={20} className="text-primary mt-1" />
                    <div className="flex flex-col">
                      <span className="text-gray-800 capitalize font-medium text-[1.2rem]">
                        {course?.courseBundleCategory} Level
                      </span>
                      <span className="text-gray-800 flex items-center gap-[3px] text-[0.7rem]">
                        <span>Recommended experience</span>{" "}
                        <span className="text-primary cursor-pointer">
                          <FaInfoCircle />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border p-5 rounded-b-lg w-full overflow-x-hidden">
              <Image
                src={course?.examCertificateInPicture}
                className="mb-4"
                width={100}
                height={100}
                alt="cpy"
              />
              <h4 className="font-bold text-3xl md:w-1/2">
                {course?.courseBundleTitle}
              </h4>
              <div className="flex lg:flex-row flex-col lg:items-center my-4 gap-2">
                <div className="w-[30px] rounded-full border border-primary p-[2px]">
                  <Image
                    src={course?.instructorBrandLogo}
                    width={50}
                    height={50}
                    alt="instructorBrandLogo"
                    className="rounded-full"
                  />
                </div>
                <h4 className="font-medium text-[14px] md:w-1/2">
                  Instructor:{" "}
                  <span className="underline cursor-pointer">
                    {course?.courseInstructor}
                  </span>
                </h4>
              </div>
              {course?.courseBundleTotalEnrolledStudents &&
              course?.courseBundleTotalEnrolledStudents?.includes(userData?.uid) ? (
                <>
                  <button className="w-full flex justify-center items-center gap-1 bg-primary text-white hover:bg-white hover:text-black duration-500 border p-2 border-primary rounded-lg font-semibold">
                    <span>Open</span> <FaLongArrowAltRight />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={makePayment}
                    className="w-[200px] flex justify-center items-center gap-1 bg-primary text-white hover:bg-white hover:text-black duration-500 border py-4 px-2 border-primary rounded-sm font-semibold"
                  >
                    <span>Enroll Now</span>
                  </button>
                </>
              )}
              <h2 className="font-medium text-[14px] my-2 w-1/2">
                <span className="font-bold">
                  {course?.courseEnrollments?.length || 0}
                </span>{" "}
                already enrolled
              </h2>
              <p className="mt-4 md:w-[90%] text-[0.9rem] max-w-full">
                {course?.courseBundleLongDescription}
              </p>
              <p className="mt-4 text-[0.9rem] md:w-[70%] text-gray-600">
                {course?.courseBundleShortDescription}
              </p>
              <div className="mt-6">
                <h4 className="heading-text text-xl">Who This Course Is For</h4>
                <hr className="mt-2" />
                <ul className="grid grid-cols-1 md:grid-cols-2 md:w-[90%] lg:w-[90%] gap-5 mt-4">
                  {course?.whoisthecoursefor?.map((d, i) => (
                    <li className="flex gap-2" key={i}>
                      <span className="w-[20px]">
                        <IoCheckmark className="mt-1 heading-text" />
                      </span>{" "}
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-5 border mt-7 rounded-lg w-full overflow-x-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h4 className="heading-text text-xl mb-5">
                    Exam Information
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {course?.examinformation?.map((data, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-[2px]">
                          <BsDot />
                        </span>
                        <span>{data}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="w-full relative h-[300px] max-h-[500px]">
                    <Image
                      src={course?.examCertificatePicture}
                      alt="Course Exam Certificate"
                      layout="fill" // Makes the image fill the container
                      objectFit="cover" // Ensures the image covers the div while maintaining aspect ratio
                      className="rounded" // Adjust classes as needed
                      priority // Optional if above-the-fold
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="border border-gray-300  rounded-md">
              <div className="p-4 mt-2">
                <h4 className="heading-text text-xl">What you will learn</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 md:w-[90%] lg:w-[80%] mt-4">
                  {course?.whatyouwillLearn?.map((d, i) => (
                    <li className="flex" key={i}>
                      <span className="w-[20px]">
                        <GoDotFill className="mt-0.5  heading-text" />
                      </span>{" "}
                      <span className="text-[0.9rem]">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h2 className="heading-text text-4xl">This Certification Bundle Includes</h2>
          <div className="grid md:grid-cols-2 gap-5 mt-7 lg:grid-cols-4">
            {course?.selectedCourses?.map((course, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-white w-full group shadow-md"
              >
                <div className="overflow-hidden rounded-t-lg">
                  <Link href={`/course/${course.id}`}>
                    <img
                      src={course.courseThumbnail}
                      className="rounded-t-lg h-[150px] w-full object-cover group-hover:scale-110 duration-500"
                      alt="Course Thumbnail"
                    />
                  </Link>
                </div>
                <div className="mt-2 py-2 ">
                  <h3 className="text-[1rem] w-full truncate cursor-pointer px-3 font-medium">
                    {course.courseTitle}
                  </h3>
                  <hr className="my-3" />
                  <div className="flex items-center px-3 justify-between text-[0.9rem]">
                    <Link href={`/course/${course.id}`}>View Details</Link>
                    <div className="flex items-center gap-[5px]">
                      <FaUser className="text-primary" />
                      {fetchedCourses?.map((data, idx) => (
                        <span key={idx}>
                          {course.id === data.id &&
                            data.courseEnrollments.length}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBundleClientSide;
