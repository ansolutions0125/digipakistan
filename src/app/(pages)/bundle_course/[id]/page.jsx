import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import PageInfo from "@/components/PageInfo/PageInfo";
import { getSingleCourseBundle } from "@/Backend/firebasefunctions";
import CourseBundleClientSide from "@/components/ClientSide/CourseBundleClientSide";

const CourseBundle = async ({ params }) => {
  const { id } = params;
  const course = await getSingleCourseBundle(id);
  return (
    <>
      <Navbar />
      <PageInfo PageName={course.data?.courseBundleTitle} />
      <CourseBundleClientSide course={course.data} />
      <Footer />
    </>
  );
};

export default CourseBundle;
