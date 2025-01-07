import React, { useState } from "react";
import { CiVideoOn } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import Link from "next/link"
import { MdOutlineLocalOffer, MdOutlineVerified } from "react-icons/md";

const SingleCourse = ({ data,loading }) => {
    const [activeIdx, setIsActiveIdx] = useState(null);


    
  const curriculum = [
    {
      heading: "Introduction",
      outlines: [
        "what is Machine Learning",
        "Data Science Play Ground",
        "First Image Classifier",
        "Resources",
      ],
    },
    {
      heading: "Data Science And Machine Learning",
      outlines: [
        "Recommender Systemt using K nearst Means",
        "Data Science vs Machine Learning vs Artificial Intelligence",
        "Sumarizing it all",
      ],
    },
    {
      heading: "AI Project Life Cycle",
      outlines: [
        "AI Project Framework",
        "STep-1 Problem Defination",
        "Step-2 Data",
        "Step-3 Evaluation",
        "Step-4 Features",
        "Step-5 Modelling",
        "Step-5 Data Validation",
        "Step-6 Course Correction",
        "Tools needed for AI Project",
    ],
    },
    {
      heading: "Python the Most Powerful Language",
      outlines: [
        "What is Programming Language",
        "Python Interpreter and First Code",
        "Python 3 vs Python 2",
        "Formula to Learn Coding",
        "Data Types and Basic Arithmatic",
        "Basic Arithmetic Part 2",
        "Rule of Programming",
        "Mathematical Operators and Order of Precedence",
        "Variables and their BIG No No",
        "Statement vs Expression",
        "Augmented Assignment Operator",
        "String Data Type",
        "Type Conversion",
        "String Formatting",
        "Indexing",
        "Immutability",
        "Built in Function and Methods",
        "Boolean Data Type",
        "Excercise",
        "Data Structor and Lists",
        "Lists continued",
        "Matrix from Lists",
        "List Methods",
        "Lists Methods 2",
        "Creating Lists Programatically",
    ],
},
  ];


if(!data)return null;
  const toggleAccordion = (idx)=>{
    setIsActiveIdx(activeIdx === idx?null : idx)
  }

  return (
   
      <div className="max-w-6xl flex mx-auto">
        <div className="flex flex-col w-full gap-4 lg:flex-row">
       {loading? <div className="animate-pulse py-3 w-full">
 
        <div className="h-auto flex flex-col lg:gap-3 w-full p-5 rounded bg-gray-100">
          <div className="h-5 w-1/3 bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>
          
          
          <div className="h-5 mt-4 w-1/3 bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>

          <div className="h-5 mt-4 w-1/3 bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>
          <div className="h-3 w-full bg-gray-300"></div>


        </div>

   
 


</div>  : <div className="flex-1  p-5 rounded-xl">
          <h1 className="font-bold text-2xl">Course Overview</h1>
          <h1 className="font-bold mt-5 text-2xl"> Course Description</h1>
          <p className="mt-3">
            {data?.courseLongDescription}
          </p>
          <ul className="list-disc px-5 mt-3">
            {data?.descriptionPoints && data.descriptionPoints.map((data,idx)=>{
             return <li className="text" key={idx}>{data}</li>
            })}
          </ul>
          <h1 className="font-bold mt-5 text-2xl">Who This Course is for?</h1>
          <ul className="list-disc px-5 mt-3">
           {data?.whoisthecoursefor && data.whoisthecoursefor.map((data,idx)=>{
            return <li key={idx} >{data}</li>
           })}
          </ul>

          {data?.certificate && (
           <div>
            <h1 className="font-bold mt-5 text-2xl">Certificate</h1>
            
            <p className="mt-3">{data.certificate} </p>
     
           </div>
          )}

          <h1 className="font-bold mt-5 text-2xl">Duration & Frequency</h1>
          <p className="mt-3">Total Duration of the course is {data?.batchDuration} </p>

          <h1 className="font-bold mt-5 text-2xl">What will I learn?</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 border rounded-xl max-w-3xl gap-4 p-4 shadow-md">
          {data?.whatyouwillLearn?.map((data,idx)=>{
            return  <div key={idx} className="flex gap-3 items-start">
            <FaCheck className="text-green-500 mt-1" />
            <p className="flex-1">
              {data}
              </p>
          </div>
          })} 
          </div> 


          <h1 className="font-bold mt-5 text-2xl">Requirements</h1>
          <ul className="list-disc px-5 mt-3">
            {data?.requirements?.map((data,idx)=>{
             return <li key={idx}>{data} </li>
            })}
          </ul>

          <h1 className="font-bold mt-5 text-2xl">Curriculum for this course</h1>

          <div className="accordion mt-5">
            {data?.curriculumData?.map((curriculums, idx) => (
              <div key={idx} className="accordion-item border-b">
                <div
                  className={`accordion-title flex gap-5 text-white bg-primary items-center cursor-pointer py-4 px-2 `}
                >
                  <div>{idx +1} . {""} {curriculums.curriculumTitle}</div>
                </div>

          
            {curriculums?.curriculumPoints?.map((item, index) => (
              <div
                key={index}
                className="flex items-center py-3 px-2 text-primary border-b-2"
              >
                <CiVideoOn />
                <p className="ml-4">{item}</p>
              </div>
            ))}
          </div>
            ))}
          </div>
        </div>
}
        <div className="border h-96 p-3 rounded-xl shadow-md sticky top-24 right-0">
                <img className="w-64" src="/course_thumbnail.jpg" alt="" />
            <div className="my-4 min-w-full">
               <button className=" w-full hover:bg-primary hover:text-white p-3 text-center text-sm border rounded-full border-yellow-600 text-yellow-600" > <Link  href="/registration" >Apply Now</Link></button>
               <p className="my-2">Includes:</p>
                
                <div className="flex gap-2 items-center">
                    <MdOutlineVerified />
                    <p>Verified Certificate</p>
                </div>
                <div className="flex gap-2 items-center">
                    <MdOutlineLocalOffer />
                    <p>Internship Opportunity</p>
                </div>
                <div className="flex gap-2 items-center">
                   <GrCertificate/>
                    <p>Career Development</p>
                </div>
            </div>
        </div>
      </div>
      </div>
   
  );
};

export default SingleCourse;
