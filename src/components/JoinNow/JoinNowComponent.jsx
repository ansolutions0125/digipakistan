"use client";
import Aos from "aos";
import Link from "next/link";
import React, { useEffect } from "react";

const JoinNowComponent = () => {
  useEffect(() => {
    Aos.init({
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div className="py-24 bg-joinnow">
      <div className="max-w-6xl lg:mx-auto mx-5 flex-col gap-6 justify-center flex items-center">
        <h1 className="text-white font-bold text-center text-xl md:text-4xl">
          Take Charge of Your Future by Mastering Freelancing Skills
        </h1>
        <Link
          href={"/registration"}
          data-aos="fade-up"
          data-aos-duration="1000"
          className=" group hover:bg-white hover:text-primary text-[13px]  md:text-xl rounded-md duration-300  px-4 py-2 bg-primary text-white"
        >
          Join Now For Free
        </Link>
      </div>
    </div>
  );
};

export default JoinNowComponent;
