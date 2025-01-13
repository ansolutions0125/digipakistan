"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCourseContext } from "../../../context/context";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/Backend/Firebase";

const AssociateCertificationPrograms = ({data}) => {
    const {setCourse} = useCourseContext();
  
  const [courses,setCourses] =useState([]);
  const [loading,setLoading]= useState(true);
 
  
  const randomColors = ()=>{
    const letters = "0123456789ABCDEF";
    let color  = "#";
    for (let i=0;i<6;i++){
      color += letters[Math.floor(Math.random()*16)];
    }
    return color;
 }

 useEffect(()=>{
  const timer = setTimeout(()=>{
    setLoading(false);
  },600);
  return ()=>clearTimeout(timer);
},[]);
 
if (!data || data.length === 0) {
  return (
    <p className="min-h-[50vh] flex justify-center items-center text-red-600 text-5xl">
      Courses not found
    </p>
  );
}

 return (
   <div className="grid place-items-center mt-10">
   
     <div className="container">
        {loading ?<div className="animate-pulse py-3 grid grid-cols-1 lg:gap-3 lg:grid-cols-4 w-full">
 
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
      <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
        <div className="h-2 w-36 p-3 rounded-full bg-gray-300" ></div>
   </div>
   
 
  
 </div> : <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {data?.map((data, idx) => {
            const randomColor = randomColors();
            return (
              <Link
              key={idx}
              href={`/courses/course/${data.id}`}
              onClick={() => setCourse(data)}
            >
              <div
                style={{borderColor:randomColor}}
                className={`card-container border-t-4 min-h-[120px] hover:bg-slate-200 duration-200 shadow-2xl rounded flex items-center p-4`}
             >
              
               <div className="flex gap-3 items-center justify-left">
               <img
                  className="w-10 h-10"
                  src={data.courseLogo}
                  alt={data.courseTitle}
                />
                <p className="text-center">
                  <p>{data.courseTitle
                  }</p>
                
                </p>
               </div>
              </div>
                </Link> 
            );
          })}
        </div>}
      </div>
  </div>
  );
  
};

export default AssociateCertificationPrograms;
