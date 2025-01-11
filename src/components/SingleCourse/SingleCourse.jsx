import React, { useState } from "react";
import { CiVideoOn } from "react-icons/ci";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import Link from "next/link";
import { MdOutlineLocalOffer, MdOutlineVerified } from "react-icons/md";

const SingleCourse = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);
  const toggleTab = (index) => {
    setActiveTab(index);
  };
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl  flex lg:mx-auto">
        <div className="flex flex-col w-full gap-4 lg:flex-row ">
          <div className="lg:w-3/4 -mt-20 bg-white z-20 shadow-2xl border mb-5 p-5 rounded-xl">
            {/* Tabs */}
            <div className="tabs flex space-x-4 border-b">
              <button
                className={`py-4 lg:px-4 text-[15px] ${
                  activeTab === 0
                    ? "text-primary font-bold duration-100 transition-all border-b-2 border-primary "
                    : ""
                }`}
                onClick={() => toggleTab(0)}
              >
                Description
              </button>
              <button
                className={`py-4 lg:px-4 text-[15px] ${
                  activeTab === 1
                    ? "text-primary font-bold duration-100 transition-all border-b-2 border-primary "
                    : ""
                }`}
                onClick={() => toggleTab(1)}
              >
                Curriculum
              </button>
            </div>

            {/* Tab Content */}
            <div
              className={`transition-opacity duration-500 ease-in-out ${
                activeTab === 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              {activeTab === 0 && (
                <div>
                  <p className="mt-3">{data.courseLongDescription}</p>
                  <ul className="list-disc px-5 mt-3">
                    {data?.descriptionPoints?.map((item, idx) => (
                      <li className="text" key={idx}>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <h1 className="font-bold mt-5 text-2xl">
                    Who This Course is for?
                  </h1>
                  <ul className="list-disc px-5 mt-3">
                    {data?.whoIsTheCourseFor.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  {data?.certificate && (
                    <div>
                      <h1 className="font-bold mt-5 text-2xl">Certificate</h1>
                      <p className="mt-3">{data.certificate}</p>
                    </div>
                  )}

                  <h1 className="font-bold mt-5 text-2xl">
                    Duration & Frequency
                  </h1>
                  <p className="mt-3">
                    Total Duration of the course is {data?.batchDuration}
                  </p>

                  <h1 className="font-bold mt-5 text-2xl">
                    What will I learn?
                  </h1>
                  <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 border rounded-xl max-w-3xl gap-4 p-4 shadow-md">
                    {data?.whatYouWillLearn?.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <FaCheck className="text-green-500 mt-1" />
                        <p className="flex-1">{item}</p>
                      </div>
                    ))}
                  </div>

                  <h1 className="font-bold mt-5 text-2xl">Requirements</h1>
                  <ul className="list-disc px-5 mt-3">
                    {data?.requirements?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div
              className={`transition-opacity duration-500 ease-in-out ${
                activeTab === 1 ? "opacity-100" : "opacity-0"
              }`}
            >
              {activeTab === 1 && (
                <div>
                  <h1 className="font-bold mt-5 text-2xl">
                    Curriculum for this course
                  </h1>
                  <div className="accordion mt-5">
                    {data?.curriculumData?.map((curriculum, idx) => (
                      <div key={idx} className="accordion-item border-b">
                        {/* Accordion title */}
                        <div
                          onClick={() => toggleAccordion(idx)}
                          className="accordion-title flex gap-5 justify-between items-center cursor-pointer py-4 px-2"
                        >
                          <div>
                            {idx + 1} . {curriculum.curriculumTitle}
                          </div>
                          {activeAccordion === idx ? (
                            <FaAngleUp />
                          ) : (
                            <FaAngleDown />
                          )}
                        </div>
                        {/* Accordion content */}
                        <div
                          className={`accordion-content ${
                            activeAccordion === idx ? "active" : ""
                          }`}
                        >
                          {curriculum?.curriculumPoints?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center py-3 px-2 text-primary"
                            >
                              <CiVideoOn className="bg-gray-100 w-9 h-9 p-2 rounded-full" />
                              <p className="ml-4 ">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className=" w-full z-20 mb-5 flex gap-5 flex-col lg:mt-[-250px]  lg:w-[400px] p-3 ">
            {/* 2nd */}
            <div className=" border bg-white p-3 rounded-xl sticky top-[150px]">
              <div className="p-3 min-w-full">
                <p className=" py-3 font-bold text-xl">What's included</p>
                <hr className="bg-primary h-[1px]" />
                <div className="flex gap-2 py-3 items-center">
                  <MdOutlineVerified className="text-primary" />
                  <p>Verified Certificate</p>
                </div>
                <hr className="bg-primary h-[1px] " />
                <div className="flex gap-2 py-3 items-center">
                  <MdOutlineLocalOffer className="text-primary" />
                  <p>Internship Opportunity</p>
                </div>
                <hr className="bg-primary h-[1px] " />
                <div className="flex gap-2 py-3 items-center">
                  <GrCertificate className="text-primary" />
                  <p>Career Development</p>
                </div>
                <hr className="bg-primary h-[1px] " />
                <Link href={"/registration/register"}>
                <button className="text-center w-full p-3 hover:font-extrabold  duration-300 border-3 border border-yellow-700 hover:bg-yellow-700 bg-primary text-white rounded mt-4">
                  Enroll Now
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCourse;
