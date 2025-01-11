"use client";
import React, { useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import Partners from "../Patners/Patners";
import CoursesComponent from "../Courses/CoursesComponent";
import Overallinsights from "../OverAllInsghits/Overallinsights";
import About from "../About/AboutComponent";
import HowitworksComponents from "../HowItWorks/HowitworksComponents";
import JoinNowComponent from "../JoinNow/JoinNowComponent";
import Footer from "../Footer/Footer";
import { trackPageView } from "@/Facebook/PixelEvents";
import FacebookPixel from "@/Facebook/FacebookPixel";
import RelatedVideo from "../AboutCodiSkillsVideo/RelatedVideo";
import BacktoHome from "../BackToHome/BacktoHome";
import UpcomingProjects from "../Upcoming Projects/UpcomingProjects";
import TrainersCertified from "../TrainersCertified/TrainersCertified";
import FreelancingPlateform from "../FreelancingPlateform/FreelancingPlateform";
import SupportingInstitutions from "../SupportingInstitutions/SupportingInstitutions";

const HomePageClientSide = () => {
  useEffect(() => {
    // Initialize Facebook Pixel
    FacebookPixel();

    // Track page view
    trackPageView();
  }, []);

  return (
    <>
      <BacktoHome />
      <Navbar />
      <Header />
      <Partners />
      <CoursesComponent />
      {/* <Overallinsights /> */}
      <UpcomingProjects/>
      {/* <HowitworksComponents /> */}
      <RelatedVideo />
      {/* <JoinNowComponent /> */}
      <TrainersCertified/>

      {/* Freelancing Plateforms */}
      <FreelancingPlateform/>
      {/* Supporting Institiutions */}


      <SupportingInstitutions/>
      <Footer />
    </>
  );
};

export default HomePageClientSide;
