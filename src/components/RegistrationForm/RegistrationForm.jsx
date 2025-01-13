"use client";
import Link from "next/link";
import React, { useState } from "react";

const RegistrationForm = () => {


  return (
    <div className="apply_now_bg min-h-[70vh] ">
      <div className="flex items-center justify-center p-3 lg:p-5">
        <div className="w-full min-h-[60vh] rounded-xl bg-white flex flex-col border shadow-2xl text-center p-5 lg:w-[90%] ">
          <img className="w-36 h-36 mx-auto" src="/logo.jpg" alt="" />
          <h1 className="text-4xl font-bold pb-5">Online Apllication System</h1>
          <p className="text-sm max-w-4xl lg:mx-auto">
            <span className="text-red-600">Register yourself</span> as a new
            applicant. After successfully registration, enter your login details
            (Type your email & password which you have created during
            registration). You will be successfully logged into the Candidate
            Portal.
          </p>
          <div className="flex items-center justify-center mt-5 gap-3">
            <Link href="/registration/register" className="text-white bg-primary hover:bg-second rounded-md py-2 px-3 ">New Registeration</Link>
            <Link href="/signin" className="text-white bg-primary hover:bg-second rounded-md  py-2 px-3 ">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
