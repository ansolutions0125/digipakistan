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
  const [AllCertificationCategoryes, setAllCertificationCategoryes] = useState([]);
  
  
  // [
  //   {id:"fast_track_technical_program"},
  //   {id:"fast_track_technical_program"},
  //   {id:"fast_track_technical_program"},
  // ]
  
  
  const [loading, setLoading] = useState(true);
  // const [loadingForCerificationChanging, setLoadingForCerificationChanging] =
  //   useState(false);

  const formattedDate = (timestamp) => {
    return format(new Date(timestamp), "PP");
  };

  useEffect(() => {
    const getallCourses = async () => {

      const allcourses = await getAllCourses();
      const coursesCategories=  await getAllCertificationCategoryes();

      setAllCertificationCategoryes(coursesCategories.data); // Set reordered categories
      setCourses(allcourses.data);
      setLoading(false);
    };
    getallCourses();
  }, []);



  return (
    <div className="bg-gray-50">
      <div className=" max-w-7xl mx-auto min-h-[70vh] ">
      <div className="flex flex-col p-3 lg:mt-0 w-full ">
        <div className="w-full text-center lg:mx-auto">
          <h1 className="heading-text text-3xl lg:text-5xl font-bold">
            Available Programs
          </h1>
        </div>
      </div>
      <div className="">
        <div className="w-full px-3 lg:p-10 lg:mx-auto ">
         <div >
     {loading ? (
   <div className="animate-pulse py-3 flex-col lg:flex-row flex gap-3 justify-center">
   <div className="h-44 p-3 flex gap-3 bg-gray-200 rounded w-1/3">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
      <div className="flex flex-col gap-3">
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
        <div className="h-2 w-52 p-3 rounded-full bg-gray-300" ></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
      </div>
   </div>
   <div className="h-44 p-3 flex gap-3 bg-gray-200 rounded w-1/3">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
      <div className="flex flex-col gap-3">
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
        <div className="h-2 w-52 p-3 rounded-full bg-gray-300" ></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
      </div>
   </div>
   <div className="h-44 p-3 flex gap-3 bg-gray-200 rounded w-1/3">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
      <div className="flex flex-col gap-3">
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
        <div className="h-2 w-52 p-3 rounded-full bg-gray-300" ></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
      </div>
   </div>
   
 
  
 </div>)
:
(
 <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-5 lg:mt-0 mt-10 lg:grid-cols-3" >
   {
    AllCertificationCategoryes.map((data,idx)=>{
      return <div
      key={idx}
      className={`relative rounded-lg p-2 bg-white w-full group transition duration-300 cursor-pointer shadow-2xl border-2 hover:bg-primary hover:text-white `}
    >
        <Link href={`/courses/${data.id}`} className="rounded-[100%]  bg-slate-200">
      <div className="overflow-hidden flex gap-3 items-center p-3 ">
          <Image
            src="/fast_track.png"
            alt={"data.courseTitle"}
            width={80}
            className="w-20 h-20 "
            height={80}
            loading="eager"
          />
        
  
        <div className="flex flex-col justify-start">
          <p className="text-[10px] ">{data.type} </p>
          <h3 className="text-[1rem] truncate cursor-pointer font-bold">
          {data.certificationsTitle}
          </h3>
          <div className="flex gap-3">
            <Image
              src={"/course_icon.png"}
              alt="Course icon"
              width={20}
              height={10}
            />
            <p> {data.coursesInThisCertifications.length} Courses </p>
          </div>
        </div>
      </div>
      <div className="py-5 mt-3">
        <p className="px-3 text-[13px] flex flex-wrap gap-3 text-gray-600 group-hover:text-white">
         {data.coursesInThisCertifications?.map((coursess,idx)=>{
         return <span key={idx} >{coursess} |</span> 
          
       
         })}
        </p>
      </div>
      </Link>
    </div>
  
  
    })
  }   
 </div>
)
}
          </div>

          
        </div>
      </div>
    </div>
    </div>
  );
};

export default CoursesComponent;
