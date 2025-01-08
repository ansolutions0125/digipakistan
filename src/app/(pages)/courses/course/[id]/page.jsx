

"use client";
import React, { use } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SingleCourse from "@/components/SingleCourse/SingleCourse";
import courses from "@/components/Courses/Courses";
import CoursePageInfo from "@/components/PageInfo/CoursePageInfo";

const SCourse = ({params}) => {
  const resolvedParams = use(params); // Unwrap the params promise
  const courseId = resolvedParams.id;

const selectedCourse = courses.find((c)=>c.id===courseId)
  return (
    <>
      {/* Navbar */}
      <Navbar/>

      {/* Page Info */}
      <CoursePageInfo duration={selectedCourse.batchDuration} enrolled={selectedCourse.enrolledStudents} totalReview={selectedCourse.totalReviews} reviews={selectedCourse.reviews}
      level={selectedCourse.level} PageName={selectedCourse.courseTitle} pageDescription={selectedCourse.courseShortDescription} />

      {/* All Courses */}
      <main className="p-4 lg:p-0">
        <SingleCourse data={selectedCourse} />
      </main>
      <Footer />
    </>
  );
};

export default SCourse;
