"use client";
import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaLongArrowAltRight } from "react-icons/fa";
import { MdOndemandVideo, MdOutlineWatchLater } from "react-icons/md";
import { IoIosCheckmarkCircle, IoIosPeople } from "react-icons/io";
import { useRouter } from "next/navigation";
import userHooks from "../../Hooks/userHooks";
import Image from "next/image";
import { trackCustomEvent } from "@/Facebook/PixelEvents";
import { IoCheckmark } from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import Link from "next/link";

const CourseClientSide = ({ course }) => {
  const { userData } = userHooks();

  const router = useRouter();
  // Payment handler
  // const makePayment = async () => {
  //   trackCustomEvent("AddToCart", {
  //     content_name: course.courseTitle,
  //     content_id: course.courseId,
  //     value: course.courseId,
  //     currency: "USD",
  //   });
  //   sessionStorage.setItem("paymentInProgress", "pending");
  //   router.push(`/pay/${course.courseId}`);
  // };

  const [courseLoading, setCourseLoading] = useState(false);
  useEffect(() => {
    setCourseLoading(true);

    setTimeout(() => {
      setCourseLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="py-20">
      <div className="max-w-6xl lg:mx-auto mx-5">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col w-full">
            {courseLoading ? (
              <>
                <div className="w-full bg-gray-300 animate-pulse border rounded-lg h-[250px] md:h-[400px] lg:h-[600px] relative" />
                <div className="bottom-0 z-20 bg-gray-200 h-[7rem] w-full max-w-5xl  -mt-12 shadow-lg rounded-md mb-10 py-3 mx-auto border" />
              </>
            ) : (
              <>
                <div className="w-full border rounded-lg h-[250px] md:h-[400px] lg:h-[600px] relative">
                  <Image
                    src={course?.courseThumbnail}
                    alt={course?.courseTitle}
                    layout="fill" // This makes the image fill the container
                    className="rounded-t-lg object-cover"
                    loading="eager"
                    priority // Optional: if this image is above-the-fold, you can use priority
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
                        <MdOndemandVideo
                          size={20}
                          className="text-primary mt-1"
                        />
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
                        <MdOndemandVideo
                          size={20}
                          className="text-primary mt-1"
                        />
                        <div className="flex flex-col">
                          <span className="text-gray-800 capitalize font-medium text-[1.2rem]">
                            {course?.courseCategory} Level
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
              </>
            )}

            <div className="border p-5 rounded-b-lg w-full overflow-x-hidden">
              {courseLoading ? (
                <div className="h-[6rem] bg-gray-300 mb-3 rounded-md animate-pulse w-[6rem]" />
              ) : (
                <>
                  <Image
                    src={course?.examCertificateInPicture}
                    className="mb-4"
                    width={100}
                    height={100}
                    alt="cpy"
                  />
                </>
              )}

              <h4 className="font-bold text-3xl md:w-1/2">
                {course?.courseTitle}
              </h4>
              <div className="flex lg:flex-row flex-col lg:items-center my-4 gap-2">
                {courseLoading ? (
                  <div className="w-[30px] h-[30px] rounded-full border border-primary p-[2px] bg-gray-300 animate-pulse" />
                ) : (
                  <div className="w-[30px] rounded-full border border-primary p-[2px]">
                    <Image
                      src={course?.instructorBrandLogo}
                      width={50}
                      height={50}
                      alt="instructorBrandLogo"
                      className="rounded-full"
                    />
                  </div>
                )}
                <h4 className="font-medium text-[14px] md:w-1/2">
                  Instructor:{" "}
                  <span className="underline cursor-pointer">
                    {course?.courseInstructor}
                  </span>
                </h4>
              </div>
              {course?.courseEnrollments &&
              course?.courseEnrollments?.includes(userData?.uid) ? (
                <>
                  <button className="w-full flex justify-center items-center gap-1 bg-primary text-white hover:bg-white hover:text-black duration-500 border p-2 border-primary rounded-lg font-semibold">
                    <span>Open</span> <FaLongArrowAltRight />
                  </button>
                </>
              ) : (
                <>
                  <Link href={"/registration"}>
                    <button className="w-[200px] flex justify-center items-center gap-1 bg-primary text-white hover:bg-white hover:text-black duration-500 border py-4 px-2 border-primary rounded-sm font-semibold">
                      <span>Enroll Now</span>
                    </button>
                  </Link>
                </>
              )}
              <h2 className="font-medium text-[14px] my-2 w-1/2">
                <span className="font-bold">
                  {course?.courseEnrollments?.length || 0}
                </span>{" "}
                already enrolled
              </h2>
              <p className="mt-4 md:w-[90%] text-[0.9rem] max-w-full">
                {course?.courseLongDescription}
              </p>
              <p className="mt-4 text-[0.9rem] md:w-[70%] text-gray-600">
                {course?.courseShortDescription}
              </p>
              <div className="mt-6">
                <h4 className="heading-text text-xl">Who This Course Is For</h4>
                <hr className="mt-2" />
                <ul className="grid grid-cols-1 md:grid-cols-2 md:w-[90%] lg:w-[70%] gap-5 mt-4">
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
                  {courseLoading ? (
                    <div className="w-full relative h-[300px] max-h-[500px] bg-gray-300 animate-pulse" />
                  ) : (
                    <div className="w-full relative h-[300px] max-h-[500px]">
                      <Image
                        src={course?.examCertificatePicture}
                        alt="Course Exam Certificate"
                        width={300}
                        height={300}
                        className="rounded w-full h-full" // Adjust classes as needed
                        priority // Optional if above-the-fold
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="border border-gray-300  rounded-md">
              <div className="p-4 mt-2">
                <h4 className="heading-text text-xl">What you will learn</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 md:w-[90%] lg:w-[70%] mt-4">
                  {course?.whatyouwillLearn?.map((d, i) => (
                    <li className="flex gap-2" key={i}>
                      <span className="w-[20px]">
                        <IoIosCheckmarkCircle className="mt-0.5  text-primary" />
                      </span>{" "}
                      <span className="text-[0.9rem]">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseClientSide;
