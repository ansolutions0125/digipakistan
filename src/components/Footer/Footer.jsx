"use client";
import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaLocationDot, FaSquareFacebook, FaXTwitter } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import { TfiYoutube } from "react-icons/tfi";
import FooterCopyRights from "./FooterCopyRights";
import Link from "next/link";
import Image from "next/image";
import { getSiteDetails } from "@/Backend/firebasefunctions";
import { IoLogoLinkedin, IoLogoYoutube } from "react-icons/io5";

const Footer = () => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetais = async () => {
      const data = await getSiteDetails("siteDetailsId");
      setDetails(data);
    };
    fetchDetais();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full  mb-[-30] ">
      <div className="bg-primary w-full text-center text-white p-5 font-bold text-2xl">
        DigiPAKISTAN NATIONAL SKILLS DEVELOPMENT INITIATIVE
      </div>
      <div className="flex justify-center items-center flex-col text-center bg-second pt-10 lg:p-20 lg:text-xl  text-white">
        <img src="/digipakistan-white-png.png" className="w-28" alt="" />
        <div className="">
          <p className="lg:px-36 px-4 py-10 ">
            To transform Pakistani Youth into productive workforce to contest
            the challenges of fourth industrial revolution through latest,
            demand driven and state of the art IT Skills with the increased
            access to high-quality education for everyone, anywhere and anytime.
          </p>
          <p>
            In case of queries you can dial{" "}
            <span className="text-primary font-bold">
              {" "}
              <a href="tel:042-35482528">042-35482528</a>{" "}
            </span>{" "}
            |{" "}
            <span className="text-primary font-bold">
              <a href="tel:042-35482529">042-35482529</a>{" "}
            </span>{" "}
            and can email at{" "}
            <span className="text-primary font-bold">
              <a href="mailto:support@digipakistan.org">
                support@digipakistan.org
              </a>
            </span>
          </p>

          <div className=" flex items-center justify-center gap-5 p-10 text-4xl">
            <p className="hover:text-yellow-600 duration-300 cursor-pointer">
              <FaSquareFacebook />
            </p>
            <p className="hover:text-yellow-600 duration-300 cursor-pointer">
              <FaInstagram />
            </p>
            <p className="hover:text-yellow-600 duration-300 cursor-pointer">
              <FaXTwitter />
            </p>
            <p className="hover:text-yellow-600 duration-300 cursor-pointer">
              <IoLogoLinkedin />
            </p>
            <p className="hover:text-yellow-600 duration-300 cursor-pointer">
              <IoLogoYoutube />
            </p>
          </div>
        </div>
      </div>
      <FooterCopyRights/>
    </div>
  );
};

export default Footer;
