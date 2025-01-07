import Image from "next/image";
import React from "react";
import { IoMdCheckmark } from "react-icons/io";

const About = () => {
  return (
    <div className="py-20" id="aboutcomponent">
      <div className="max-w-6xl lg:mx-auto mx-5">
        <div className="flex lg:flex-row flex-col items-center gap-10">
          <div className="w-full">
            <div>
              <div className="flex items-center gap-5">
                <h3 className="font-bold heading-text">ABOUT DigiPAKISTAN</h3>
                <hr className="border-black w-[20px]" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl heading-text font-medium lg:w-[600px] mt-4">
                Shaping the Future of IT Education
              </h1>
              <p className="text-gray-500 mt-4 ">
              DigiPAKISTAN is a transformative IT training program supported by
                the Government of Pakistan, aimed at equipping individuals with
                globally recognized skills in the rapidly evolving field of
                information technology. Under this initiative, participants gain
                access to high-quality training in emerging technologies,
                preparing them for international certifications from leading
                organizations like Google, AWS, Microsoft, and Cisco. With its
                focus on bridging the IT skills gap, DigiPAKISTAN empowers 2
                million youth, housewives, and professionals across Pakistan to
                thrive in the digital economy. Join DigiPAKISTAN today and embark
                on a journey toward a brighter future!
              </p>
            </div>
          </div>
          <div className="w-full relative">
            <div className="w-full h-[440px]">
              <Image
                src="/aboutus-img2.jpg"
                alt="About Background"
                className="rounded-lg object-cover"
                layout="fill" // Adjusts the image to cover the container dimensions
                objectFit="cover" // Ensures the image scales correctly within the container
              />
            </div>
            <div className="absolute top-0 bg-primary rounded-lg -translate-y-4 -translate-x-3">
              <img src="/about-icon1.png" className="imgwhite" alt="" />
            </div>
            <div className="flex justify-center w-full z-50 -mt-10 bottom-0">
              <div className="bg-white w-full shadow-md mx-10 px-5 pt-5 rounded-lg">
                <div className="p-5">
                  <p className="text-gray-500">Top Notch Instructors</p>
                </div>
                <div className="bg-primary w-full h-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
