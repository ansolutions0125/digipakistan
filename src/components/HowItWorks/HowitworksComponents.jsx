import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

const Howitworks = () => {
  return (
    <div className="py-20">
      <div className="max-w-6xl lg:mx-auto mx-5">
        <div className="flex lg:flex-row flex-col">
          <div className="w-full">
            <div className="flex items-center gap-5">
              <h3 className="font-bold heading-text">What we do</h3>
              <hr className="border-black w-[20px]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-5xl heading-text font-medium  mt-4">
              How it works?
            </h1>
          </div>
          <div className="w-full">
            <p className="text-gray-500 font-[1rem]">
              Follow these steps to effortlessly secure your spot in the course
              of your choice. Happy learning with DigiPAKISTAN!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 lg:flex-row flex-col lg:gap-3 mt-7">
          <div className="bg-bgcolor w-full py-10 flex items-center flex-col group hover:border-2 hover:border-primary rounded-lg duration-300 border-2">
            <div className="w-[80px] h-[80px] relative bg-primary flex rounded-lg justify-center items-center">
              <img src="/howitworks-icon1.png" className="imgwhite" alt="" />
              <div className="flex items-center bg-second rounded-full text-white translate-x-3 -translate-y-3 w-[30px] h-[30px] top-0 right-0 absolute justify-center">
                <h6>1</h6>
              </div>
            </div>
            <strong className="mt-3">Step 1:</strong>{" "}
            <span className="text-center">
              Sign up, verify your email, and complete the registration form
            </span>
            <Link href={"/howitworks"} className="flex items-center gap-1 mt-2">
              <span>Read More</span> <MdKeyboardArrowRight />
            </Link>
          </div>
          <Image
            src={"/howitworks-steps-arrow.png"}
            width={60}
            className="lg:block hidden"
            height={20}
            alt="arrow"
          />
          <div className="bg-bgcolor w-full py-10 flex items-center flex-col group hover:border-2 hover:border-primary rounded-lg duration-300 border-2">
            <div className="w-[80px] h-[80px] relative bg-primary flex rounded-lg justify-center items-center">
              <img src="/howitworks-icon2.png" className="imgwhite" alt="" />
              <div className="flex items-center bg-second rounded-full text-white translate-x-3 -translate-y-3 w-[30px] h-[30px] top-0 right-0 absolute justify-center">
                <h6>2</h6>
              </div>
            </div>
            <strong className="mt-3">Step 2:</strong>{" "}
            <span className="text-center">
              Wait for approval and pay a small admission fee.
            </span>
            <Link href={"/howitworks"} className="flex items-center gap-1 mt-2">
              <span>Read More</span> <MdKeyboardArrowRight />
            </Link>
          </div>
          <Image
            src={"/howitworks-steps-arrow.png"}
            width={60}
            className="lg:block hidden"
            height={20}
            alt="arrow"
          />
          <div className="bg-bgcolor w-full py-10 flex px-4 items-center flex-col group hover:border-2 hover:border-primary rounded-lg duration-300 border-2">
            <div className="w-[80px] h-[80px] relative bg-primary flex rounded-lg justify-center items-center">
              <img src="/howitworks-icon3.png" className="imgwhite" alt="" />
              <div className="flex items-center bg-second rounded-full text-white translate-x-3 -translate-y-3 w-[30px] h-[30px] top-0 right-0 absolute justify-center">
                <h6>3</h6>
              </div>
            </div>
            <strong className="mt-3">Step 3:</strong>{" "}
            <span className="text-center">
              Receive login credentials and start learning on the LMS.
            </span>
            <Link href={"/howitworks"} className="flex items-center gap-1 mt-2">
              <span>Read More</span> <MdKeyboardArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Howitworks;
