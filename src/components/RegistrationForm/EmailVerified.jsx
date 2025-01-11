"use client";
import userHooks from "@/Hooks/userHooks";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";

const EmailVerified = () => {
  const [loading, setLoading] = useState(false);
  const { userData } = userHooks();

  const buttonLoad = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (!userData) return null;

 


  return (
    <div className="apply_now_bg min-h-[70vh]">
      <div className="flex items-center justify-center p-3 lg:p-5">
        <div className="w-full min-h-[60vh] rounded-xl bg-white flex items-center justify-center flex-col border shadow-2xl text-center p-5 lg:w-[90%]">
          {/* <img className=" w-40  mx-auto" src="/email-verify.gif" alt="" /> */}
          {/* <div className="flex items-center justify-center gap-3"> */}
            <MdVerified className="text-9xl text-primary" />
            <h1 className="lg:text-3xl text-2xl font-bold">
              Hi {userData.firstName} {userData.lastName}{" "}
            </h1>
          {/* </div> */}
          <p className="mt-2">
            Your Email has Verified, complete the further process for enrollment
            in DigiPakistan NATIONAL SKILLS DEVELOPMENT PROGRAM.{" "}
          </p>
          <p className="mt-2 text-xl">
            آپ کا ای میل تصدیق ہو چکا ہے، ڈیجی پاکستان نیشنل اسکلز ڈیولپمنٹ
            پروگرام میں اندراج کے لیے مزید عمل مکمل کریں۔{" "}
          </p>

          <div className="flex justify-center items-center mt-5 gap-2">
            <Link
              onClick={() => buttonLoad()}
              href={"/terms-conditions"}
              className="bg-primary hover:bg-second duration-150 text-sm rounded-md p-2 text-white"
            >
              {loading ? "Loading...." : " Continue"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
