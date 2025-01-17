import EnrollUserComponent from "@/app/(pages)/testthink/page";
import React from "react";
import { CgUser } from "react-icons/cg";
import {  IoTimeOutline } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";

const CoursePageInfo = ({ PageName,pageDescription,reviews,duration,totalReview,enrolled,level }) => {
  return (
    <div className="pageinfo-bg " >
    <div className="max-w-7xl lg:mx-auto flex z-0 min-h-[50vh] lg:min-h-[60vh]">
      <div className=" text-left flex flex-col gap-3 lg:gap-7 mx-5">
        <div>
        <h1 className="text-white font-medium text-left lg:mt-14 lg:mb-5 my-5 text-2xl lg:text-5xl">
          {PageName}
        </h1>
        <h6 className=" text-left lg:text-[22px] mt-3 lg:w-2/3 text-white">{pageDescription} </h6>
        </div>

        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex gap-2 items-center text-white ">
            <IoTimeOutline/>
            {duration}
            </div>
            <div className="flex gap-2 items-center text-white ">
            <MdOutlineRateReview/>
            {reviews} ({totalReview})
            </div>
            <div className="flex gap-2 items-center text-white ">
            <CgUser/>
            {enrolled}
            </div>
            <div className="flex gap-2 items-center text-white ">
            <RxActivityLog/>
            {level}
            </div>
        </div>

        <div>
          <button className="bg-gray-100 p-3 hover:bg-yellow-600 hover:text-white duration-300 mt- w-40 rounded lg:hidden">Apply Now</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CoursePageInfo;
