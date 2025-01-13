"use client";
import React, { useEffect, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import {
  getAllCertificationCategoryes,
  getAllCourses,
} from "../../Backend/firebasefunctions";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import moment from "moment";
import { format } from "date-fns";

const CoursesComponent = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [AllCertificatjionCategoryes, setAllCertificationCategoryes] = useState( [
    {id:"fast_track_technical_program",coursesInThisCertifications:["IT Fundamentals","Microsoft Front End","ASP.NET","PHP Laravel","MERN Stack","SQL Server","SQL Server","Oracle DBA","Android Apps","Kotlin Apps","IOS Apps","Xamarin Apps","React Native","Game Development","CCNA","CompTIA Security","CEH","CHFI","ECSA","CISA","CISM","AWS Practitioner","AWS Sol.Architect","AWS SysOps","AWS Developer","Azure Fundamentals","Microsoft Cloud Administrator","Google Cloud","Python","ML & AI","Data Sceience","Big Data"],
      type:"Fast Track",
      certificationsId:"fast_track_technical_program",
      certificationsTitle:"Fast Track Technical Program",
      img:"/fast_track.png"
    },
    {id:"fast_track_non_technical_program",coursesInThisCertifications:["QuickBooks ERP","SAP ERP","Project Management Professional (PMP)","Amazon FBA Business","Search Engine Optimization","Digital Marketing","Social Media Marketing","Graphic Design","UI/UX Design","Interior Design","3D Maya Max Animation","Video Editing","Auto Cad","Microsoft Office","Enterprenership"],
       type:"Fast Track",
      certificationsId:"fast_track_non_technical_program",
      certificationsTitle:"Fast Track Non Technical Program",
      img:"/fast_track_non.png"

    },
    {id:"associate_certification_program",coursesInThisCertifications:[
      "Digital Forensic Cyber Security","Penetration Testing Cyber Security","CISSP Cyber Security Professional","Artificial Intelligence","AWS Cloud Computing","Internet of Things (IoT)","BlockChain Technology","FullStack Web Devlopment (MCSA)"],
    type:"6 Monts",
    certificationsId:"associate_certificate_program",
    certificationsTitle:"Associate Certificate Program",
    img:"/associate_track.png"
  },
  ]);

 

  const [loading, setLoading] = useState(false);
  // const [loadingForCerificationChanging, setLoadingForCerificationChanging] =
  //   useState(false);

  const formattedDate = (timestamp) => {
    return format(new Date(timestamp), "PP");
  };

  // useEffect(() => {
  //   const getallCourses = async () => {
  //     const allcourses = await getAllCourses();
  //     const coursesCategories = await getAllCertificationCategoryes();

  //     setAllCertificationCategoryes(coursesCategories.data); // Set reordered categories
  //     setCourses(allcourses.data);
  //     setLoading(false);
  //   };
  //   getallCourses();
  // }, []);


 

  return (
    <div className="bg-gray-50">
      <div className=" max-w-7xl lg:mx-auto min-h-[70vh] ">
        <div className="flex flex-col p-3 lg:mt-0 w-full ">
          <div className="w-full text-center lg:mx-auto">
            <h1 className="heading-text text-3xl lg:text-5xl font-bold">
              Available Programs
            </h1>
          </div>
        </div>
        <div className="">
          <div className="w-full px-3 lg:p-10 lg:mx-auto ">
            <div>
              {loading ? (
                <div className="animate-pulse py-3 flex-col lg:flex-row flex gap-3 justify-center">
                  <div className="h-44 p-3 flex gap-3 bg-gray-200 rounded w-1/3">
                    <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
                    <div className="flex flex-col gap-3">
                      <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
                      <div className="h-2 w-52 p-3 rounded-full bg-gray-300"></div>
                      <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
                    </div>
                  </div>
                  <div className="h-44 p-3 flex gap-3 bg-gray-200 rounded w-1/3">
                    <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
                    <div className="flex flex-col gap-3">
                      <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
                      <div className="h-2 w-52 p-3 rounded-full bg-gray-300"></div>
                      <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
                    </div>
                  </div>
                  <div className="h-44 p-3 flex gap-3 bg-gray-200 rounded w-1/3">
                    <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
                    <div className="flex flex-col gap-3">
                      <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
                      <div className="h-2 w-52 p-3 rounded-full bg-gray-300"></div>
                      <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-5 lg:mt-0 mt-10 lg:grid-cols-3">
                  {AllCertificatjionCategoryes.map((data, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-lg p-2 bg-white w-full group transition duration-300 cursor-pointer shadow-2xl border-2 hover:bg-primary hover:text-white `}
                      >
                        <Link
                          href={`/courses/${data.id}`}
                          className="rounded-[100%]  bg-slate-200"
                        >
                          <div className="overflow-hidden flex gap-3 items-center p-3 ">
                            <Image
                              src={data.img}
                              alt={"data.courseTitle"}
                              width={80}
                              className="w-20 h-20 "
                              height={80}
                              loading="eager"
                            />
                            <div className="flex flex-col justify-start">
                              <p className="text-[10px] ">{data.type} </p>
                              <h3 className="lg:text-[1rem] text-ellipsis text-sm truncate cursor-pointer font-bold">
                                {data.certificationsTitle}
                              </h3>
                              <div className="flex gap-2">
                                <Image
                                  src={"/course_icon.png"}
                                  alt="Course icon"
                                  width={20}
                                  height={10}
                                />
                                <p className="text-sm lg:text-normal">
                                  {data.coursesInThisCertifications.length}
                                  {" "} Courses
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="py-5 mt-3">
                            <p className="px-3 text-[13px] flex flex-wrap gap-3 text-gray-600 group-hover:text-white">
                              {data.coursesInThisCertifications?.map(
                                (coursess, idx) => {
                                  return <span key={idx}>{coursess} |</span>;
                                }
                              )}
                            </p>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesComponent;
