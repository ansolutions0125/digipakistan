"use client";
import { getAllUsers, getAllCourses } from "@/Backend/firebasefunctions";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { SlNotebook } from "react-icons/sl";

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const AnimatedNumbers = ({ value, text }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 10000 });
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current && latest.toFixed(0) <= value) {
        const formattedValue = formatNumber(latest.toFixed(0));
        ref.current.textContent = `${formattedValue}${text ? text : ""}`;
      }
    });
  }, [springValue, value]);

  return <span ref={ref}></span>;
};

const Overallinsights = () => {
  const [users, setUsers] = useState(null);
  const [courses, setCourses] = useState(null);
  const [totalEnrollments, setTotalEnrollments] = useState(0);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Fetch users data
    setLoading(true);
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data.data);
    };

    const fetchCourses = async () => {
      const data = await getAllCourses();
      setCourses(data.data);
    };

    // Fetch courses data and calculate total enrollments
    const fetchEnrollments = async () => {
      const allCourses = await getAllCourses();
      const enrollments = allCourses.data.reduce((acc, course) => {
        return acc + (course.courseEnrollments?.length || 0);
      }, 0);
      setTotalEnrollments(enrollments);
    };

    fetchCourses();
    fetchUsers();
    fetchEnrollments();
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  return (
    <div className="bg-insights py-20">
      <div className="max-w-6xl lg:mx-auto mx-5">
        <h1 className="text-white font-bold text-center mb-7 text-4xl">
          Overall Insights
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3">
          <div className=" gap-3 text-white py-4 lg:py-12 px-4 rounded-lg items-center flex flex-col">
            <div className="bg-primary text-white rounded-full p-4">
              <CiGlobe size={50} />
            </div>
            <h3 className="text-2xl font-semibold">Total Certifications</h3>
            <h5 className="text-xl">
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></div>
              ) : (
                <AnimatedNumbers value={courses?.length || 0} />
              )}
            </h5>
          </div>
          <div className="gap-3 text-white py-4 lg:py-12 px-4 rounded-lg items-center flex flex-col">
            <div className="bg-primary text-white rounded-full p-4">
              <Image
                src={"/ingihits-1.png"}
                loading="eager"
                width={50}
                height={50}
                className="rounded-full imgwhite"
                alt="signups"
              />
            </div>
            <h3 className="text-2xl font-semibold">Overall Sign-ups</h3>
            <h5 className="text-xl">
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></div>
              ) : (
                <AnimatedNumbers value={users?.length + 100000 || 0} />
              )}
            </h5>
          </div>
          <div className="gap-3 text-white py-4 lg:py-12 px-4 rounded-lg items-center flex flex-col">
            <div className="bg-primary p-4 text-white rounded-full ">
              <SlNotebook size={50} />
            </div>
            <h3 className="text-2xl font-semibold">Overall Enrollments</h3>
            <h5 className="text-xl">
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></div>
              ) : (
                <AnimatedNumbers value={10000 + totalEnrollments} />
              )}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overallinsights;
