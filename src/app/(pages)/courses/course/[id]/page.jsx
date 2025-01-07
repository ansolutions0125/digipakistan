

"use client";
import React, { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import PageInfo from "@/components/PageInfo/PageInfo";
import SingleCourse from "@/components/SingleCourse/SingleCourse";

import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/Backend/Firebase";

const SCourse = ({params }) => {
  const resolvedParams = use(params); // Unwrap the params promise
  const id = resolvedParams.id;
  // const { course } = useCourseContext();
  const [course,setCourse]= useState({});
  const [loading,setLoading]=useState(false)

useEffect(()=>{
      const getCourse = async()=>{
       try {
        setLoading(true);
        const query = doc(firestore,"courses",id);
        const querySnapshot = await getDoc(query);
        setCourse(querySnapshot.data());
        setLoading(false)
       } catch (error) {
        console.log(error)
       }
      }
      getCourse();
    }
  ,[])
  console.log(course)

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Page Info */}
      <PageInfo PageName={course?.courseTitle} pageDescription={course?.courseShortDescription} />

      {/* All Courses */}
      <main className="p-6">
        <SingleCourse data={course} loading={loading} />
      </main>
      <Footer />
    </>
  );
};

export default SCourse;
