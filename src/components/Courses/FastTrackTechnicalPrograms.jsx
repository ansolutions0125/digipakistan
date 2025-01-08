"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCourseContext } from "../../../context/context";
import { color } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/Backend/Firebase";

const FastTrackTechnicalPrograms = () => {
  const { setCourse } = useCourseContext();
  const [courses, setCourses] = useState([
    {
      id:"it_fundamentals",
      courseTitle: "IT Fundamentals",
      courseLogo: "/it_fundamentals.png",
    },
    {
      id:"microsoft_frontend",
      courseTitle: "Microsoft FrontEnd",
      courseLogo: "/frontend.png",
    },
    {
      id:"asp.net",
      courseTitle: "ASP.NET",
      courseLogo: "/asp.net.svg",
    },
    {
      id:"php_laraval",
      courseTitle: "PHP Lraval",
      courseLogo: "/php.png",
    },
    {
      id:"mernstack",
      courseTitle: "MERN Stack Devlopment",
      courseLogo: "/fullstack.png",
    },
    {
      id:"sqlserver",
      courseTitle: "SQL Server",
      courseLogo: "/sql.png",
    },
    {
      id:"oracle",
      courseTitle: "Oracle Database Administrator",
      courseLogo: "/oracle.png",
    },
    {
      id:"android",
      courseTitle: "Android Apps Development",
      courseLogo: "/android.png",
    },
    {
      id:"kotlin",
      courseTitle: "Kotlin Apps Development",
      courseLogo: "/kotlin.png",
    },
    {
      id:"ios",
      courseTitle: "IOS Apps Development",
      courseLogo: "/ios.png",
    },
    {
      id:"xamarin",
      courseTitle: "Xamarin Apps Development",
      courseLogo: "/xamarin.png",
    },
    {
      id:"reactnative",
      courseTitle: "React Native Development",
      courseLogo: "/reactnative.png",
    },
    {
      id:"game",
      courseTitle: "Game Development",
      courseLogo: "/game.png",
    },
    {
      id:"ccna",
      courseTitle: "Compute Communication Network Administrator(CCNA)",
      courseLogo: "/ccna.png",
    },
    {
      id:"comptia",
      courseTitle: "CompTIA Security",
      courseLogo: "/comptia-ptr6.jpeg",
    },
    {
      id:"ceh",
      courseTitle: "Ceritified Ethical Hacking",
      courseLogo: "/ceh.png",
    },
  ]);
  const [loading, setLoading] = useState(false);

  // useEffect(()=>{
  //   const getFastTrackCourses =async()=>{

  //    try {

  //     const query = collection(firestore,"courses");
  //     const querySnapshot = await getDocs(query);
  //     const temp = [];

  //     querySnapshot.forEach((doc)=>{
  //       temp.push({id:doc.id,...doc.data()});
  //     })
  //     const fastTrackData = temp.filter((data)=> data.courseCategory === "Fast Track Technical Program" )
  //     setCourses(fastTrackData);
  //     setLoading(false);
  //    } catch (error) {
  //     console.log(error);
  //    }
  //   }
  //   getFastTrackCourses();
  // },[])

  const randomColors = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="grid place-items-center mt-10">
      <div className="container">
        {loading ? (
          <div className="animate-pulse py-3 grid grid-cols-1 lg:gap-3 lg:grid-cols-4 w-full">
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-28 mb-3 p-3 flex items-center gap-3 bg-gray-200 rounded ">
              <div className="h-10 w-10 p-10 rounded-full bg-gray-300"></div>
              <div className="h-2 w-36 p-3 rounded-full bg-gray-300"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {courses.map((data, idx) => {
              const randomColor = randomColors();
              return (
                <Link
                  key={idx}
                  href={`/courses/course/${data.id}`}
                  onClick={() => setCourse(data)}
                >
                  <div
                    style={{ borderColor: randomColor }}
                    className={`card-container border-t-4 min-h-[120px] hover:bg-slate-200 duration-200 shadow-2xl rounded flex items-center p-4`}
                  >
                    <div className="flex gap-3 items-center justify-left">
                      <img
                        className="w-10 h-10"
                        src={data.courseLogo}
                        alt={data.courseTitle}
                      />
                      <p className="text-center">
                        <p>{data.courseTitle}</p>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FastTrackTechnicalPrograms;
