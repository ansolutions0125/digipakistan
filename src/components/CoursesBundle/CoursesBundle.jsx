"use client"
import React, { useEffect, useState } from "react";
import { getAllCoursesBundles } from "../../Backend/firebasefunctions";
import Link from "next/link";

const CoursesBundle = () => {
  const [coursesBundle, setCoursesBundle] = useState([]);
  useEffect(() => {
    const getBundles = async () => {
      const data = await getAllCoursesBundles();
      setCoursesBundle(data.data);
    };
    getBundles();
  }, []);
  return (
    <div className="py-10" id="bundles">
      <div className="max-w-6xl lg:mx-auto mx-5">
        <h1 className="text-4xl text-center mb-7 heading-text">
          Explore Our Courses 1-Year Specialization Program
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {coursesBundle?.map((data, idx) => (
            <div key={idx} className="w-full bg-gray-800 flex flex-col items-center rounded p-7 text-white hover:bg-primary duration-500">
              <h3 className="font-bold text-[1.2rem] leading-[24px] text-center">
                {data?.courseBundleTitle}
              </h3>
              <p className="text-[0.9rem] text-center mt-2 whitespace-pre-line h-[130px] overflow-hidden text-ellipsis max-w-full text-gray-200">
                {data?.courseBundleShortDescription}
              </p>
              <Link href={`/bundle_course/${data?.id}`}>
                <button className="border border-white mt-5 py-2 px-4 hover:bg-white hover:text-black duration-500 rounded">
                  Learn More
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesBundle;
