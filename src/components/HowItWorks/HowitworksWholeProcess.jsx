"use client";
import React, { useRef } from "react";
import { useScroll, motion } from "framer-motion";
import Lilcon from "./Lilcon";
import { FaLongArrowAltRight } from "react-icons/fa";
import Link from "next/link";
import { BsFillSendFill } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { MdSupportAgent } from "react-icons/md";

const Details = ({ step, descrption, stepdescription }) => {
  const ref = useRef(null);
  return (
    <li
      ref={ref}
      className="my-8 first:mt-8 dark:text-light last:md-0 w-[60%] mx-auto flex flex-col items-center justify-between"
    >
      <Lilcon reference={ref} />
      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >

        <div className="flex lg:flex-row flex-col">
          <h3 className="w-full lg:w-1/5 capitalize heading-text text-2xl font-bold">
            {step}:
          </h3>
          <div className="w-full flex flex-col">
            <h2 className="capitalize heading-text text-2xl font-bold">
              {stepdescription}
            </h2>
            <hr className="my-2" />
            <p className="font-medium w-full text-gray-700">{descrption}</p>
          </div>
        </div>
      </motion.div>
    </li>
  );
};

const HowitworksWholeProcess = ({ details }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });
  return (
    <div className="py-20">
      <div className="max-w-6xl lg:mx-auto mx-5 flex lg:flex-row flex-col gap-10 lg:gap-0">
        <div className="w-full">
          <div ref={ref} className="mx-auto relative pt-10">
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute left-8 top-0 w-[4px] h-full bg-primary origin-top"
            />
            <ul className="w-full flex flex-col items-start justify-between ml-4">
              <Details
                step="Step 1"
                stepdescription="Sign Up"
                descrption="Go to the registration form on the DigiPAKISTAN website and provide your details, including your name, email, and password. Signing up is the first step to accessing high-quality certifications."
              />
              <Details
                step="Step 2"
                stepdescription="Email Verification"
                descrption="Check your email inbox for a confirmation email. Click the verification link in the email to activate your account."
              />
              <Details
                step="Step 3"
                stepdescription="Procced With Registration"
                descrption="After verifying your email, complete your registration by filling out the additional details in the registration form."
              />
              <Details
                step="Step 4"
                stepdescription="Application Review"
                descrption="Once you have submitted registration from, our team will review your application to ensure all details are correct. This process may take a 24-48 hours."
              />
              <Details
                step="Step 5"
                stepdescription="Fee Payment"
                descrption="After your application is approved, you have to pay a minimal admission fee to finalize your registration."
              />
              <Details
                step="Step 6"
                stepdescription="Receive LMS Credentials"
                descrption="Once your payment is successfully processed, you will receive your LMS (Learning Management System) login credentials via email."
              />
              <Details
                step="Step 7"
                stepdescription="Login to LMS"
                descrption="Log in to the LMS using the credentials provided and start exploring your courses and resources."
              />
              <Details
                step="Step 8"
                stepdescription="Access Resources"
                descrption="Access the comprehensive learning resources, including videos, quizzes, and reading materials available in the LMS."
              />
              <Details
                step="Step 9"
                stepdescription="Track Your Progress"
                descrption="Use the LMS to track your learning progress and stay updated on upcoming assignments and assessments."
              />
              <Details
                step="Step 10"
                stepdescription="Complete Your Certification"
                descrption="Complete the course and receive your certification upon meeting the requirements. This marks your journey toward international recognition."
              />
            </ul>
          </div>
          <div className="flex justify-center mt-5">
            <Link href={"/signup"}>
              <button className="py-2 flex gap-2 items-center px-5 bg-primary text-white rounded-md">
                <span>Register Now</span> <FaLongArrowAltRight />
              </button>
            </Link>
          </div>
        </div>
        <div className="lg:w-[25rem] sticky top-[120px] h-[40rem] grid gap-3 md:grid-cols-2 lg:grid-cols-1">
          {/* Assistance Section */}
          <div className="w-full border flex flex-col items-center h-[20rem] rounded-md py-6 px-5 border-gray-300 shadow-lg">
            <h3 className="heading-text text-center text-2xl font-semibold">
              Need Assistance?
            </h3>
            <div className="p-5 mt-4 rounded-full flex items-center justify-center bg-primary text-white">
              <MdSupportAgent size={40} />
            </div>
            <h6 className="mt-4 text-gray-500 text-center">
              Let us assist you with your queries. Use the contact form to reach
              out.
            </h6>
            <Link href="/contact">
              <button className="mt-4 hover:bg-primary hover:border-white duration-300 hover:text-white border-primary border px-4 py-1 rounded-full text-[13px]">
                Contact Us
              </button>
            </Link>
          </div>

          {/* Email Section */}
          <div className="w-full border flex flex-col items-center h-[21rem] rounded-md py-6 px-5 border-gray-300 shadow-lg">
            <h3 className="heading-text text-center text-2xl font-semibold">
              Email Us
            </h3>
            <div className="p-5 mt-4 rounded-full flex items-center justify-center bg-primary text-white">
              <CiMail size={40} />
            </div>
            <h6 className="mt-4 text-gray-500 text-center">
              Our team is here to respond to your queries promptly.
            </h6>
            <h2 className="mt-4 text-gray-700 font-medium">
              {details?.email || "support@digipakistan.com"}
            </h2>
            <a
              href={`mailto:${details?.email || "support@digipakistan.com"}`}
              className="mt-4 hover:bg-primary hover:text-white hover:border-white duration-300 border-primary border px-4 py-1 rounded-full text-[13px]"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowitworksWholeProcess;
