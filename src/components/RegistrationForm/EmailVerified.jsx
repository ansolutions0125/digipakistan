"use client";
import userHooks from "@/Hooks/userHooks";
import Link from "next/link";
import React, { useState } from "react";

const EmailVerified = () => {
    const [loading,setLoading]= useState(false)
    const {userData} = userHooks();

const buttonLoad = ()=>{
        setLoading(true);
    setTimeout(()=>{
        setLoading(false);
    },1000)
}

if(!userData) return null;
  return (
    <div className="apply_now_bg min-h-[70vh]">
      <div className="flex items-center justify-center p-3 lg:p-5">
        <div className="w-full min-h-[60vh] rounded-xl bg-white flex flex-col border shadow-2xl text-center p-5 lg:w-[90%]">
          <img className=" w-40  mx-auto" src="/email-verify.gif" alt="" />
           <h1 className="lg:text-3xl text-2xl font-bold">Hi {userData.firstName} {userData.lastName} </h1>
           <p className="mt-2">Your Email has Verified, click continue</p>

           <div className="flex justify-center items-center mt-5 gap-2">
            
                <Link onClick={()=>buttonLoad()} href={"/terms-conditions"} className="bg-primary hover:bg-second duration-150 text-sm rounded-md p-2 text-white"> 
               {loading ? "Loading...." : " Continue"}
             </Link>
           </div>

         
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
